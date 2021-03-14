import { getRepository } from 'typeorm';
import User from '../models/entities/User';
import ClientError from '../models/error/ClientError';
import UserResponseDto from '../models/responses/UserResponseDto';
import logger from '../config/logger';

const USER_DOES_NOT_EXIST = 'Пользователь не существует';

export default {
  async getUser(userId: number): Promise<UserResponseDto> {
    const user = await getRepository(User).findOne(userId);

    if (user === undefined) {
      throw new ClientError(USER_DOES_NOT_EXIST);
    }

    logger.info(`Getting user information by id == ${userId}`);

    return {
      id: user.id,
      nickname: user.nickname,
    };
  },
};
