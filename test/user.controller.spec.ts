import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { INestApplication, NotFoundException } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../src/user/service/auth.service';
import { UserService } from '../src/user/service/user.service';
import { User } from '../src/user/models/User';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CreateUserDTO } from '../src/user/dto/CreateUserDTO';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let userModel: Model<User>;
  let authService: AuthService;
  let userService: UserService;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userModel = moduleFixture.get<Model<User>>('UserModel');
    authService = moduleFixture.get<AuthService>(AuthService);
    userService = moduleFixture.get<UserService>(UserService);

    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  describe('/api/auth/register (POST)', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDTO = {
        email: 'test@example.com',
        username: 'testuser',
        name: 'ratz',
        password: 'testpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('username', createUserDto.username);
      expect(response.body).toHaveProperty('email', createUserDto.email);
      expect(response.body).toHaveProperty('token');

      const savedUser = await userModel.findOne({
        email: createUserDto.email,
      });

      expect(savedUser).toBeDefined();
      expect(savedUser.password).not.toBe(createUserDto.password);
    });

    it('should throw ConflictException when email or username already exists', async () => {
      const existingUser = new userModel({
        email: 'existing@example.com',
        username: 'existinguser',
        name: 'ratz',
        password: 'existingpassword',
      });
      await existingUser.save();

      const createUserDto: CreateUserDTO = {
        email: 'existing@example.com',
        name: 'ratz',
        username: 'existinguser',
        password: 'newpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(createUserDto)
        .expect(409);

      expect(response.body.message).toBe('Email or username already exists');
    });
  });

  describe('/api/auth/login (POST)', () => {
    it('should login with valid credentials', async () => {
      // Crie um usuário de teste para efetuar o login
      const createUserDto: CreateUserDTO = {
        email: 'test@example.com',
        username: 'testuser',
        name: 'ratz',
        password: 'testpassword',
      };
      await userService.createUser(createUserDto);

      const loginDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(201);

      expect(response.body).toHaveProperty('token');
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      // Crie um usuário de teste para efetuar o login
      const createUserDto: CreateUserDTO = {
        email: 'test@example.com',
        username: 'testuser',
        name: 'ratz',
        password: 'testpassword',
      };
      await userService.createUser(createUserDto);

      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });
  });
  describe('findUser', () => {
    it('should throw NotFoundException if id is not valid', async () => {
      const id = 'invalid-id';
      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);

      await expect(userService.findUser(id)).rejects.toThrowError(
        new NotFoundException('User not found'),
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      const id = '60921a4a6de4f2154b7842e3';
      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);

      await expect(userService.findUser(id)).rejects.toThrowError(
        new NotFoundException('User not found'),
      );
    });

    it('should return the user without the password field', async () => {
      const existingUser = new userModel({
        email: 'test@example.com',
        username: 'testuser',
        name: 'ratz',
        password: 'testpassword',
      });
      await existingUser.save();

      const user = await userModel.findOne({ email: 'test@example.com' });

      const result = await userService.findUser(user._id);
      expect(result).toMatchObject({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    });
  });
});
