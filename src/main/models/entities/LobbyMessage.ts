import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import User from './User';
import Lobby from './Lobby';

@Entity('lobby_messages')
export default class LobbyMessage {
  @ManyToOne(() => User, (user) => user.lobbyMessages, {
    primary: true,
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Lobby, (lobby) => lobby.lobbyMessages, {
    primary: true,
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  lobby!: Lobby;

  @Column('text')
  messageText!: string;

  @Column('timestamp')
  messageDate!: Date;
}
