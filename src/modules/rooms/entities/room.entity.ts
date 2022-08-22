import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageEntity } from 'src/modules/messages/entities/message.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => MessageEntity, (message: MessageEntity) => message.room, {
    onDelete: 'CASCADE',
  })
  messages: MessageEntity[];

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
