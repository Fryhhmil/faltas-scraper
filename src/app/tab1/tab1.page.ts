import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { LoginForm } from '../model/login';
import { NavigationEnd, Router } from '@angular/router';
import { catchError, filter, throwError } from 'rxjs';
import { FaltaDTO } from '../model/faltas';
import { LoginService } from '../services/login.service';
import { HttpErrorResponse } from '@angular/common/http';

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
    this.data = data;
    this.carregando = false;
  }

  async login() {
    const login: LoginForm = await this.storageService.getLogin();

    this.loginService.login(login).pipe(
      // debounceTime(3000),
      // distinctUntilChanged(),
      catchError((e: HttpErrorResponse) => {
        this.carregando = false;
        return throwError(() => e);
      })
    ).subscribe({
      next: (retorno) => {
        this.carregando = false;
        this.buscarFaltas(retorno);
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
        this.carregarDados();
      }
    });
  }

}
