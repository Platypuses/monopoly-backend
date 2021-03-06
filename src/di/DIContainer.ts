import UserService from '../services/UserService';
import UserRepository from '../repositories/UserRepository';

const mockedId = 0;
const mockedEmail = 'test@example.com';
const mockedName = 'TestUser';

export const userRepository = new UserRepository(mockedId, mockedEmail, mockedName);
export const userService = new UserService();
