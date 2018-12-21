import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Event } from '../models/event';
import { handleError } from './service-helper';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private url = 'api/events';

  constructor(private http: HttpClient) {}

  get(): Observable<Event[]> {
    return this.http.get<Event[]>(this.url).pipe(catchError(handleError));
  }

  insert(event: Event): Observable<Event> {
    return this.http.post<Event>(this.url, event).pipe(catchError(handleError));
  }

  update(event: Event): Observable<void> {
    return this.http.put<void>(`${this.url}/${event.id}`, event).pipe(catchError(handleError));
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(catchError(handleError));
  }
}
