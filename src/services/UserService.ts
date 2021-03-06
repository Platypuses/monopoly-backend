import UserResponseDto from '../models/response/UserResponseDto';
import UserRequestDto from '../models/request/UserRequestDto';
import UserRepository from '../repositories/UserRepository';
import { userRepository } from '../di/DIContainer';

export default class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = userRepository;
  }

  public async createUser(userRequestDto: UserRequestDto): Promise<UserResponseDto> {
    return this.userRepository.createUser(userRequestDto.email, userRequestDto.name);
  }

  public async getUser(userId: number): Promise<UserResponseDto> {
    return this.userRepository.getUser(userId);
  }
}
