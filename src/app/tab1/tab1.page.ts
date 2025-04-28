import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { LoginForm } from '../model/login';
import { NavigationEnd, Router } from '@angular/router';
import { catchError, filter, throwError } from 'rxjs';
import { FaltaDTO } from '../model/faltas';
import { LoginService } from '../services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HorarioAluno, HorarioAlunoDTO } from '../model/HorarioAluno';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  logado = false;
  carregando = true;
  data: FaltaDTO[] = []
  horario: HorarioAlunoDTO = new HorarioAlunoDTO;
  diaHoje = 'Indefinido';
  materiasHoje = 'Indefinido'

  constructor(private storageService: StorageService, private router: Router, private loginService: LoginService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects === '/tabs/tab1') {
        this.verificaLogado();
        this.carregarDados();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.carregarDados();
  }

  async verificaLogado() {
    const login: LoginForm = await this.storageService.getLogin();
    if (login && login.cpf != null) {
      this.logado = true;
    } else {
      this.logado = false;
    }
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.carregando = true
      this.login();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

  async carregarDados(): Promise<void> {
    const data: FaltaDTO[] = await this.storageService.getData();
    this.horario = await this.storageService.getCalendario();
    this.data = data;
    this.carregando = false;
  }

  async login() {
    const login: LoginForm = await this.storageService.getLogin();

    if (await this.loginService.isCookieValid()) {
      this.buscarFaltas((await this.loginService.getCookie()).cookie);
      this.carregarDados();
      return;
    }

    this.loginService.login(login).pipe(
      // debounceTime(3000),
      // distinctUntilChanged(),
      catchError((e: HttpErrorResponse) => {
        this.carregando = false;
        return throwError(() => e);
      })
    ).subscribe({
      next: (retorno) => {
        this.storageService.setCookie({ cookie: retorno, dataCriacao: new Date() });
        this.buscarFaltas(retorno);
        this.buscarHorario(retorno);
      },
      error: (error) => {
        this.carregando = false;
        console.error('Erro no login:', error);
      }
    });
  }

  buscarFaltas(cookie: string): void {
    this.loginService.buscarFaltas(cookie).pipe(
      catchError((e: HttpErrorResponse) => {
        if (e.status === 406) {
          this.storageService.removeCookie();
        }
        return throwError(() => e);
      })
    ).subscribe({
      next: (retorno) => {
      this.storageService.setData(retorno);
      },
      error: (error) => {
        this.carregando = false;
        console.error('Erro no login:', error);
      },
      complete: () => {
      }
    });
  }

  buscarHorario(cookie: string): void {
    this.loginService.buscarHorario(cookie).pipe(
      catchError((e: HttpErrorResponse) => {
        if (e.status === 406) {
          this.storageService.removeCookie();
        }
        return throwError(() => e);
      })
    ).subscribe({
      next: (retorno) => {
      this.storageService.setCalendario(retorno);
      },
      error: (error) => {
        this.carregando = false;
        console.error('Erro no login:', error);
      },
      complete: () => {
        this.carregarDados();
        this.carregando = false;
      }
    });
  }

  getFaltasHj(): number | string {
    const hoje = new Date().getDay();

    switch (hoje) {
      case 0:
        this.diaHoje = 'Domingo';
        return 'Indefinido';
      case 1:
        this.diaHoje = 'Segunda';
        return this.horario.podefaltarSegunda;
      case 2:
        this.diaHoje = 'Terça'
        return this.horario.podefaltarTerca;
      case 3:
        this.diaHoje = 'Quarta'
        return this.horario.podefaltarQuarta;
      case 4:
        this.diaHoje = 'Quinta'
        return this.horario.podefaltarQuinta;
      case 5:
        this.diaHoje = 'Sexta'
        return this.horario.podefaltarSexta;
      case 7:
        this.diaHoje = 'Sábado';
        return 'Indefinido';
      default:
        return 'Indefinido'; // Domingo ou sábado
    }
  }

}
