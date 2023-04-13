export interface UserResponseInterface {
  name: string;
  email: string;
  username: string;
  image: string;
  role: string;
  favoritePlants: string[];
  bio: string;
  location: string;
  postsCount: number;
  followersCount: number;
  following: string[];
  createdAt: Date;
  updatedAt: Date;
  token: string;
}
