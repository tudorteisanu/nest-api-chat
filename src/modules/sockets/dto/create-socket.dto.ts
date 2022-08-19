import { Room } from '../../rooms/entities/room.entity';

export class CreateSocketDto {
  message: string;
  roomId: number;
  author: any;
  room: Room;
  attachments: Array<any>;
}
