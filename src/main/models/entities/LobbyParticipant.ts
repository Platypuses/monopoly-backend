import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import User from './User';
import Lobby from './Lobby';

@Entity('lobby_participants')
export default class LobbyParticipant {
  @OneToOne(() => User, (user) => user.lobbyParticipant, {
    primary: true,
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Lobby, (lobby) => lobby.lobbyParticipants, {
    primary: true,
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  lobby!: Lobby;

  @Column({ default: false })
  isCreator!: boolean;

  @Column({ default: false })
  isReady!: boolean;
}
