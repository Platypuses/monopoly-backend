import { getRepository } from 'typeorm';
import User from '../models/entities/User';
import ClientError from '../models/error/ClientError';

export default {
  async test(): Promise<string> {
    const user = await getRepository(User).findOne(1);

    if (user === undefined) {
      throw new ClientError('Test Error');
    }

    return user.nickname;
  },
};
