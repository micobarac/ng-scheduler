import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Type } from '../models/type';
import { handleError } from './service-helper';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  private url = 'api/types';

  constructor(private http: HttpClient) {}

  get(): Observable<Type[]> {
    return this.http.get<Type[]>(this.url).pipe(catchError(handleError));
  }

  insert(type: Type): Observable<Type> {
    return this.http.post<Type>(this.url, type).pipe(catchError(handleError));
  }

  update(type: Type): Observable<void> {
    return this.http.put<void>(`${this.url}/${type.key}`, type).pipe(catchError(handleError));
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(catchError(handleError));
  }
}
