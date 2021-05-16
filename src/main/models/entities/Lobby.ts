import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import LobbyStatus from '../enums/LobbyStatus';
import LobbyParticipant from './LobbyParticipant';
import LobbyMessage from './LobbyMessage';
import Game from './Game';

@Entity('lobbies')
export default class Lobby {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: LobbyStatus,
  })
  status!: LobbyStatus;

  @OneToMany(
    () => LobbyParticipant,
    (lobbyParticipant) => lobbyParticipant.lobby,
    { eager: true }
  )
  lobbyParticipants!: LobbyParticipant[];

  @OneToMany(() => LobbyMessage, (lobbyMessage) => lobbyMessage.lobby, {
    eager: true,
  })
  lobbyMessages!: LobbyMessage[];

  @OneToOne(() => Game, (game) => game.lobby, {
    cascade: true,
    eager: true,
  })
  game!: Game | null;
}
