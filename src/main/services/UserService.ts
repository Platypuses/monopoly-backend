import { getRepository } from 'typeorm';
import Bcrypt from 'bcrypt';
import User from '../models/entities/User';
import ClientError from '../models/error/ClientError';
import AccountType from '../models/entities/enums/AccountType';
import logger from '../config/logger';
import UserRegistrationRequestDto from '../models/requests/UserRegistrationRequestDto';
import UserResponseDto from '../models/responses/UserResponseDto';
import UserAuthorizationRequestDto from '../models/requests/UserAuthorizationRequestDto';

const SALT_ROUNDS = 10;

const USER_DOES_NOT_EXIST = 'Пользователь не существует';
const USER_WITH_THAT_NICKNAME_DOES_NOT_EXIST =
  'Пользователь с таким никнеймом не зарегистрирован.';
const INCORRECT_PASSWORD = 'Пароль неверный.';
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

  async getUserByNicknameAndPassword(
    userRequestDto: UserAuthorizationRequestDto
  ): Promise<User> {
    const nickname = userRequestDto.nickname.trim();
    const password = userRequestDto.password.trim();

    if (!nickname || !password) {
      throw new ClientError(FILL_ALL_FIELDS);
    }

    const user = await getRepository(User).findOne({
      nickname,
      accountType: AccountType.PERMANENT_ACCOUNT,
    });

    if (user === undefined) {
      throw new ClientError(USER_WITH_THAT_NICKNAME_DOES_NOT_EXIST, 401);
    }

    if (!(await Bcrypt.compare(password, user.password))) {
      throw new ClientError(INCORRECT_PASSWORD, 401);
    }

    logger.info(`Getting user by nickname == ${nickname}`);

    return user;
  },

  async createUser(
    userRegistrationRequestDto: UserRegistrationRequestDto
  ): Promise<void> {
    const nickname = userRegistrationRequestDto.nickname.trim();
    const password = userRegistrationRequestDto.password.trim();

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
