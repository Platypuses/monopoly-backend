import { getRepository } from 'typeorm';
import UserResponseDto from '../models/responses/UserResponseDto';
import UserRequestDto from '../models/requests/UserRequestDto';
import User from '../models/entities/User';
import ClientError from '../models/error/ClientError';

const USER_NOT_FOUND_ERROR_MESSAGE = 'User not found';

export default {
  async createUser(userRequestDto: UserRequestDto): Promise<UserResponseDto> {
    const user = new User();
    user.email = userRequestDto.email;
    user.name = userRequestDto.name;
    return getRepository(User)
      .save(user);
  },

  async getUser(userId: number): Promise<UserResponseDto> {
    const user = await getRepository(User)
      .findOne(userId);

    if (user === undefined) {
      throw new ClientError(USER_NOT_FOUND_ERROR_MESSAGE);
    }

    return user;
  },
};
