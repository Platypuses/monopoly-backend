import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import LobbyStatus from './enums/LobbyStatus';
import LobbyParticipant from './LobbyParticipant';
import LobbyMessage from './LobbyMessage';

@Entity('lobbies')
export default class Lobby {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  uuid!: string;

  @Column({ type: 'enum', enum: LobbyStatus })
  lobbyStatus!: LobbyStatus;

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
}
