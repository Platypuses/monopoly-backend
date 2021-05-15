import LobbyStatus from '../enums/LobbyStatus';
import LobbyParticipantDto from './LobbyParticipantDto';
import LobbyMessageDto from './LobbyMessageDto';

export default interface LobbyResponseDto {
  id: number;
  status: LobbyStatus;
  lobbyParticipants: LobbyParticipantDto[];
  lobbyMessages: LobbyMessageDto[];
}
