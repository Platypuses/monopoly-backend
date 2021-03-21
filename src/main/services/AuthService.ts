import UserAuthorizationRequestDto from '../models/requests/UserAuthorizationRequestDto';
import TokensPairResponseDto from '../models/responses/TokensPairResponseDto';
import UserService from './UserService';
import TokenService from './TokenService';

export default {
  async authorizeUser(
    requestDto: UserAuthorizationRequestDto
  ): Promise<TokensPairResponseDto> {
    const user = await UserService.getUserByNicknameAndPassword(requestDto);
    return TokenService.generateTokens(user.id);
  },
};
