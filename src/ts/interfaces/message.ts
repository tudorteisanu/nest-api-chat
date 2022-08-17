import { MediaInterface } from './media';

export interface MessageInterface {
  id: number;
  message: string;
  attachments: MediaInterface[];
  url?: string;
}
