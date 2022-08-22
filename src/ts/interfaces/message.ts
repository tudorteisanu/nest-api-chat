import { MediaInterface } from './media';
import { UserInterface } from '@/ts/interfaces/user';
import { RoomInterface } from '@/ts/interfaces/room';

export interface MessageInterface {
  id: number;
  message: string;
  attachments: MediaInterface[];
  url?: string;
  author?: UserInterface;
  room?: RoomInterface;
}
