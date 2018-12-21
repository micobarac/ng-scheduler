import { Type } from './type';
import { User } from './user';

export class Event {
  id: number;
  type: Type;
  user: User;
  start_date: string;
  end_date: string;
  text: string;
}
