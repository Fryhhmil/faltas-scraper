import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginForm } from '../model/login';
import { environment } from 'src/environments/environment.prod';
import { FaltaDTO } from '../model/faltas';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
  ) { }

  private handleError(errorResponse: HttpErrorResponse) {
    return throwError(() => errorResponse);
  }


  login(body: LoginForm): Observable<string> {
    return this.http
      .post<string>(
        `${environment.URL_BASE}/login`,
        body,
        { responseType: 'text' as 'json' } // <- aqui está o segredo
      )
      .pipe(catchError(this.handleError));
  }

  buscarFaltas(cookie: string): Observable<FaltaDTO[]> {
    return this.http
      .post<FaltaDTO[]>(
        `${environment.URL_BASE}/buscar-faltas`, cookie)
      .pipe(catchError(this.handleError));
  }

}
