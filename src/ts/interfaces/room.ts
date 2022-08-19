import { UserInterface } from './user';

export interface RoomInterface {
  id: number;
  name: string;
  users?: UserInterface;
}
