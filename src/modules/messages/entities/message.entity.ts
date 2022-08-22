import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Room } from 'src/modules/rooms/entities/room.entity';
import { User } from '../../users/entities/user.entity';
import { FileEntity } from '../../file/entities/file.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Room, (room) => room.messages, { onDelete: 'CASCADE' })
  room: Room;

  @ManyToOne(() => User, (user) => user.messages)
  author: User;

  @ManyToMany(() => FileEntity)
  @JoinTable()
  attachments: FileEntity[];
}
