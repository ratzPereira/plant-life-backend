import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import {
  BadRequestException,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Model, Schema, Types, ObjectId } from 'mongoose';
import { AuthService } from '../src/user/service/auth.service';
import { UserService } from '../src/user/service/user.service';
import { User, UserSchema } from '../src/user/models/User';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CreateUserDto } from '../src/user/dto/CreateUser.dto';

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
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        name: 'ratz',
        password: 'testpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/api/register')
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

      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        name: 'ratz',
        username: 'existinguser',
        password: 'newpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/api/register')
        .send(createUserDto)
        .expect(409);

      expect(response.body.message).toBe('Email or username already exists');
    });
  });

  describe('/api/auth/login (POST)', () => {
    it('should login with valid credentials', async () => {
      // Crie um usuário de teste para efetuar o login
      const createUserDto: CreateUserDto = {
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
        .post('/api/login')
        .send(loginDto)
        .expect(201);

      expect(response.body).toHaveProperty('token');
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      // Crie um usuário de teste para efetuar o login
      const createUserDto: CreateUserDto = {
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
        .post('/api/login')
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

  describe('findUser', () => {
    it('should find a user by ID', async () => {
      const existingUser = new userModel({
        email: 'test@example.com',
        username: 'testuser',
        name: 'John Doe',
        password: 'testpassword',
      });
      await existingUser.save();

      const result = await userService.findUser(existingUser._id);

      expect(result).toHaveProperty('_id', existingUser._id);
      expect(result).toHaveProperty('email', existingUser.email);
      expect(result).toHaveProperty('username', existingUser.username);
      expect(result).toHaveProperty('name', existingUser.name);
      expect(result).not.toHaveProperty('password');
    });
    it('should throw a NotFoundException when user is not found', async () => {
      const id = '60921a4a6de4f2154b7842e3';

      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);

      await expect(userService.findUser(id)).rejects.toThrowError(
        new NotFoundException('User not found'),
      );
    });
  });
  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const existingUser = new userModel({
        email: 'test@example.com',
        username: 'testuser',
        name: 'John Doe',
        password: 'testpassword',
      });
      await existingUser.save();

      const user = await userModel.findOne({ email: 'test@example.com' });

      await userService.deleteUser(user._id);
      const userAfterDelete = await userModel.findOne({
        email: 'test@example.com',
      });
      expect(userAfterDelete).toBeNull();
    });

    it('should throw NotFoundException if user is not found', async () => {
      const id = '60921a4a6de4f2154b7842e3';
      jest.spyOn(userModel, 'findByIdAndDelete').mockResolvedValueOnce(null);

      await expect(userService.deleteUser(id)).rejects.toThrowError(
        new NotFoundException('User not found'),
      );
    });

    it('should throw BadRequestException if ID is not valid', async () => {
      const id = 'invalid-id';

      await expect(userService.deleteUser(id)).rejects.toThrowError(
        new BadRequestException('Invalid user ID'),
      );
    });
  });
  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const user = new userModel({
        _id: 'user-id-123',
        email: 'test@example.com',
        username: 'testuser',
        name: 'testname',
        bio: 'testbio',
        location: 'testlocation',
        image: 'testimage',
      });

      const updateProfileDto = {
        name: 'newname',
        username: 'newusername',
        bio: 'newbio',
        location: 'newlocation',
        image: 'newimage',
      };

      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(user, 'save').mockResolvedValueOnce(user);

      const result = await userService.updateProfile(user.id, updateProfileDto);

      expect(result.name).toBe(updateProfileDto.name);
      expect(result.username).toBe(updateProfileDto.username);
      expect(result.bio).toBe(updateProfileDto.bio);
      expect(result.location).toBe(updateProfileDto.location);
      expect(result.image).toBe(updateProfileDto.image);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const id = '60921a4a6de4f2154b7842e3';
      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);

      await expect(
        userService.updateProfile(id, {
          name: 'newname',
          username: 'newusername',
        }),
      ).rejects.toThrowError(new NotFoundException('User not found'));
    });
  });
  describe('when adding a friend', () => {
    it('should add the friend successfully', async () => {
      const currentUser = new userModel({
        _id: 'user-id-123',
        email: 'test@example.com',
        username: 'testuser',
        name: 'ratz',
        password: 'testpassword',
        friends: ['friend-id-123'],
      });

      const user = new userModel(currentUser);

      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(user, 'save').mockResolvedValueOnce(user);

      const result = await userService.addOrRemoveFriend(
        currentUser.friends[1],
        currentUser,
      );

      expect(result).toEqual(user);
      expect(user.friends).toContain(currentUser.friends[1]);
      expect(user.save).toHaveBeenCalledTimes(1);
    });

    it('should throw a BadRequestException if trying to add themselves as a friend', async () => {
      const friendId = '643ebd8e82ea452664fa5acf';
      const currentUser = new userModel({
        _id: 'oi',
        email: 'test@example.com',
        username: 'testuser',
        name: 'ratz',
        password: 'testpassword',
        friends: [friendId],
      });

      await expect(
        userService.addOrRemoveFriend(currentUser._id.toString(), currentUser),
      ).rejects.toThrowError(
        new BadRequestException('Cannot add yourself as a friend'),
      );
    });

    it('should throw a NotFoundException if user is not found', async () => {
      const friendId = 'friend-id-123';
      const currentUser = new userModel({
        _id: 'user-id-123',
        email: 'test@example.com',
        username: 'testuser',
        name: 'ratz',
        password: 'testpassword',
        friends: [friendId],
      });

      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);

      await expect(
        userService.addOrRemoveFriend(friendId, currentUser),
      ).rejects.toThrowError(
        new NotFoundException(`User with id ${currentUser._id} not found`),
      );
    });
  });

  describe('when removing a friend', () => {
    it('should remove the friend successfully', async () => {
      const friendId = 'friend-id-123';
      const currentUser = new userModel({
        _id: 'user-id-123',
        email: 'test@example.com',
        username: 'testuser',
        name: 'ratz',
        password: 'testpassword',
        friends: [friendId],
      });
      const user = new userModel(currentUser);

      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(user, 'save').mockResolvedValueOnce(user);

      const result = await userService.addOrRemoveFriend(friendId, currentUser);

      expect(result).toEqual(user);
      expect(user.friends).not.toContain(friendId);
      expect(user.save).toHaveBeenCalledTimes(1);
    });
  });
});
