
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { RolesEnum } from '../enum/roles.enum';

@Entity({ name: 'Credential' })
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: RolesEnum,
    default: RolesEnum.ADMIN,
  })
  role: RolesEnum;

  @Column({ default: true })
  active: boolean;

  @OneToOne(() => User, (user) => user.credential, { onDelete: 'CASCADE' })
  user: User;
}