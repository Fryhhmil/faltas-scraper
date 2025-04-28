import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginForm } from '../model/login';
import { environment } from 'src/environments/environment';
import { FaltaDTO } from '../model/faltas';
import { HorarioAluno, HorarioAlunoDTO } from '../model/horarioAluno';
import { StorageService } from './storage.service';
import { DadosCookie } from '../model/dadosCookie';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private storage: StorageService
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

  buscarHorario(cookie: string): Observable<HorarioAlunoDTO> {
    return this.http
      .post<HorarioAlunoDTO>(
        `${environment.URL_BASE}/buscar-horario`, cookie)
      .pipe(catchError(this.handleError));
  }

  async getCookie(): Promise<DadosCookie> {
    return await this.storage.getCookie();
  }

  async isCookieValid(): Promise<boolean> {
    const cookieRetorno = await this.getCookie();

    if (!cookieRetorno) {
      return false;
    }

    const dataCriacao = new Date(cookieRetorno.dataCriacao);
    const agora = new Date();
    const limite = new Date(dataCriacao.getTime() + 35 * 60 * 1000); // 50 minutos depois da criação

    if (agora > limite) {
      return false;
    }

    return true;
  }


}
