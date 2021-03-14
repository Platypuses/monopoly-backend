import { getRepository } from 'typeorm';
import Bcrypt from 'bcryptjs';
import User from '../models/entities/User';
import ClientError from '../models/error/ClientError';
import AccountType from '../models/entities/enums/AccountType';

const HASH_SALT = 10;

export default {
  async test(): Promise<string> {
    const user = await getRepository(User).findOne(1);

    if (user === undefined) {
      throw new ClientError('Test Error');
    }

    return user.nickname;
  },

  async createUser(nickname: string, password: string): Promise<User> {
    const userRepository = getRepository(User);

    if (!nickname || !password) {
      throw new ClientError('Заполните все требуемые поля!');
    }

    if (nickname.length < 5 || nickname.length > 15) {
      throw new ClientError('Никнейм должен быть длиной от 5 до 15 символов!');
    }

    if (password.length < 5 || password.length > 30) {
      throw new ClientError('Пароль должен быть длиной от 5 до 30 символов!');
    }

    if (await userRepository.findOne({ nickname })) {
      throw new ClientError('Пользователь с таким именем уже существует!');
    }

    let user: User = new User();
    user.nickname = nickname;
    user.password = Bcrypt.hashSync(password, HASH_SALT);
    user.accountType = AccountType.PERMANENT_ACCOUNT;
    user.registrationDate = new Date();

    user = await userRepository.save(user);

    return user;
  },
};
