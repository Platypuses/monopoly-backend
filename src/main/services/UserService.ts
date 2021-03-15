import { getRepository } from 'typeorm';
import Bcrypt from 'bcrypt';
import User from '../models/entities/User';
import ClientError from '../models/error/ClientError';
import AccountType from '../models/entities/enums/AccountType';
import logger from '../config/logger';
import UserRequestDto from '../models/requests/UserRequestDto';

const SALT_ROUNDS = 10;

const FILL_ALL_FIELDS = 'Заполните все требуемые поля!';
const NICKNAME_LENGTH_WARN = 'Никнейм должен быть длиной от 5 до 15 символов!';
const PASSWORD_LENGTH_WARN = 'Пароль должен быть длиной от 5 до 30 символов!';
const NICKNAME_ALREADY_EXISTS = 'Пользователь с таким именем уже существует!';

async function validateUserRegistration(nickname: string, password: string) {
  if (!nickname || !password) {
    throw new ClientError(FILL_ALL_FIELDS);
  }

  if (nickname.length < 5 || nickname.length > 15) {
    throw new ClientError(NICKNAME_LENGTH_WARN);
  }

  if (password.length < 5 || password.length > 30) {
    throw new ClientError(PASSWORD_LENGTH_WARN);
  }

  if (await getRepository(User).findOne({ nickname })) {
    throw new ClientError(NICKNAME_ALREADY_EXISTS);
  }
}

export default {
  async test(): Promise<string> {
    const user = await getRepository(User).findOne(1);

    if (user === undefined) {
      throw new ClientError('Test Error');
    }

    return user.nickname;
  },

  async createUser(userRequestDto: UserRequestDto): Promise<void> {
    const nickname = userRequestDto.nickname.trim();
    const password = userRequestDto.password.trim();

    await validateUserRegistration(nickname, password);

    let user: User = new User();
    user.nickname = nickname;
    user.password = await Bcrypt.hash(password, SALT_ROUNDS);
    user.accountType = AccountType.PERMANENT_ACCOUNT;
    user.registrationDate = new Date();

    user = await getRepository(User).save(user);

    logger.info(`Created user '${user.nickname}' with id '${user.id}'.`);
  },
};
