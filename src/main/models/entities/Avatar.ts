import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';
import MediaType from './enums/MediaType';

@Entity('avatars')
export default class Avatar {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  filePath!: string;

  @Column({ type: 'enum', enum: MediaType })
  mediaType!: MediaType;

  @OneToOne(() => User, (user) => user.avatar, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user!: User;
}
