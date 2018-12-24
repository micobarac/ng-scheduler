import { Type } from './type';
import { User } from './user';

export class Event {
  id: number;
  type: Type;
  user: User;
  start_date: Date;
  end_date: Date;
  text: string;
}
