import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Lobby from './Lobby';

@Entity('games')
export default class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Lobby, (lobby) => lobby.game, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  lobby!: Lobby;

  @Column('text')
  stateJson!: string | null;
}
