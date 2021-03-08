import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';

@Entity('user_statistics')
export default class UserStatistics {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  winsCount!: number;

  @Column()
  defeatsCount!: number;

  @OneToOne(() => User, (user) => user.userStatistics, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user!: User;
}
