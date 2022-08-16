import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MessageEntity } from '../../messages/entities/message.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => MessageEntity, (message: MessageEntity) => message.author)
  messages: MessageEntity[];
}
