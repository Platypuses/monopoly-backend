import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import UserStatistics from './UserStatistics';
import Avatar from './Avatar';
import RefreshToken from './RefreshToken';
import LobbyParticipant from './LobbyParticipant';
import LobbyMessage from './LobbyMessage';
import AccountType from './enums/AccountType';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  nickname!: string;

  @Column({ length: 100 })
  password!: string;

  @Column('timestamp')
  registrationDate!: Date;

  @Column({ type: 'enum', enum: AccountType })
  accountType!: AccountType;

  @OneToOne(() => Avatar, (avatar) => avatar.user, {
    cascade: true,
    eager: true,
  })
  avatar: Avatar | undefined = undefined;

  @OneToOne(() => UserStatistics, (userStatistics) => userStatistics.user, {
    cascade: true,
    eager: true,
  })
  userStatistics!: UserStatistics;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens!: RefreshToken[];

  @OneToOne(
    () => LobbyParticipant,
    (lobbyParticipant) => lobbyParticipant.user,
    { cascade: true }
  )
  lobbyParticipant!: LobbyParticipant;

  @OneToMany(() => LobbyMessage, (lobbyMessage) => lobbyMessage.user, {
    eager: true,
  })
  lobbyMessages!: LobbyMessage[];
}
