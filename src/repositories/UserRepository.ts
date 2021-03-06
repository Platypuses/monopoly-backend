import User from '../models/entity/User';

export default class UserRepository {
  private readonly mockedId: number;

  private readonly mockedEmail: string;

  private readonly mockedName: string;

  constructor(mockedId: number, mockedEmail: string, mockedName: string) {
    this.mockedId = mockedId;
    this.mockedEmail = mockedEmail;
    this.mockedName = mockedName;
  }

  public async createUser(email: string, name: string): Promise<User> {
    return {
      id: this.mockedId,
      email,
      name,
    };
  }

  public async getUser(userId: number): Promise<User> {
    return {
      id: userId,
      email: this.mockedEmail,
      name: this.mockedName,
    };
  }
}
