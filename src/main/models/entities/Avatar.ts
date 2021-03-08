import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';
import AvatarMediaType from './enums/AvatarMediaType';

@Entity('avatars')
export default class Avatar {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  filePath!: string;

  @Column({ type: 'enum', enum: AvatarMediaType })
  mediaType!: AvatarMediaType;

  @OneToOne(() => User, (user) => user.avatar, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user!: User;
}
