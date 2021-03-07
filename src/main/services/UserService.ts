import { getRepository } from 'typeorm';
import UserResponseDto from '../models/responses/UserResponseDto';
import UserRequestDto from '../models/requests/UserRequestDto';
import User from '../models/entities/User';

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
      throw new Error('User not found');
    }

    return user;
  },
};
