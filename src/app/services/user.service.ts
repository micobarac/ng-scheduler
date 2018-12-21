import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { handleError } from './service-helper';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'api/users';

  constructor(private http: HttpClient) {}

  get(): Observable<User[]> {
    return this.http.get<User[]>(this.url).pipe(catchError(handleError));
  }

  insert(user: User): Observable<User> {
    return this.http.post<User>(this.url, user).pipe(catchError(handleError));
  }

  update(user: User): Observable<void> {
    return this.http.put<void>(`${this.url}/${user.id}`, user).pipe(catchError(handleError));
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(catchError(handleError));
  }
}
