import { InMemoryDbService } from 'angular-in-memory-web-api';
import { addDays, addHours, format } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd H:mm');
}

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const date = new Date();

    const events = [
      {
        id: 1,
        start_date: `${formatDate(date)}`,
        end_date: `${formatDate(addDays(addHours(date, 2), 1))}`,
        text: 'Event 1'
      },
      {
        id: 2,
        start_date: `${formatDate(addDays(date, 3))}`,
        end_date: `${formatDate(addDays(addHours(date, 2), 4))}`,
        text: 'Event 2',
        type: 2
      },
      {
        id: 3,
        start_date: `${formatDate(addDays(date, 2))}`,
        end_date: `${formatDate(addDays(addHours(date, 2), 2))}`,
        text: 'Event 3',
        type: 3
      },
      {
        id: 4,
        start_date: `${formatDate(addDays(date, 3))}`,
        end_date: `${formatDate(addDays(addHours(date, 2), 3))}`,
        text: 'Event 4',
        type: 4
      }
    ];
    return { events };
  }
}
