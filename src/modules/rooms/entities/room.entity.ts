import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MessageEntity } from 'src/modules/messages/entities/message.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => MessageEntity, (message: MessageEntity) => message.room)
  messages: MessageEntity[];
}
