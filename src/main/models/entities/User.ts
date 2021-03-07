import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  email!: string;

  @Column()
  name!: string;
}
