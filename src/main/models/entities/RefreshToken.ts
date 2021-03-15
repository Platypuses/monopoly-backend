import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';

@Entity('refresh_tokens')
export default class RefreshToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  value!: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, {
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user!: User;
}
