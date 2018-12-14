import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const events = [
      { id: 1, start_date: '2018-12-11 6:00', end_date: '2018-12-12 8:00', text: 'Event 1' },
      { id: 2, start_date: '2018-12-14 6:00', end_date: '2018-12-15 8:00', text: 'Event 2', type: 2 },
      { id: 3, start_date: '2018-12-13 6:00', end_date: '2018-12-13 8:00', text: 'Event 3', type: 3 },
      { id: 4, start_date: '2018-12-14 6:00', end_date: '2018-12-14 8:00', text: 'Event 4', type: 4 }
    ];
    return { events };
  }
}
