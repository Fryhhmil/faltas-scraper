import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { LoginService } from '../services/login.service';
import { HorarioAluno, HorarioAlunoDTO } from '../model/horarioAluno';
import { LoginForm } from '../model/login';
import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { catchError, throwError } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  data: HorarioAlunoDTO = new HorarioAlunoDTO;
  podeFaltar = {
    segunda: null,
    terca: null,
    quarta: null,
    quinta: null,
    sexta: null
  }

  constructor(
    private storageService: StorageService,
    private loginService: LoginService,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit(): Promise<void> {
    this.carregarDados();
  }


  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.login();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

  async carregarDados(): Promise<void> {
    const data: HorarioAlunoDTO = await this.storageService.getCalendario();
    this.data = data;
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
      spinner: 'crescent'
    });
    await loading.present();

    const login: LoginForm = await this.storageService.getLogin();

    if (await this.loginService.isCookieValid()) {
      this.buscarHorario((await this.loginService.getCookie()).cookie);
      this.carregarDados();
      await loading.dismiss();
      return;
     }

    this.loginService.login(login).pipe(
      // debounceTime(3000),
      // distinctUntilChanged(),
      catchError((e: HttpErrorResponse) => {
        return throwError(() => e);
      })
    ).subscribe({
      next: (retorno) => {
        this.storageService.setCookie({ cookie: retorno, dataCriacao: new Date() });
        this.buscarHorario(retorno);
      },
      error: (error) => {
        console.error('Erro no login:', error);
        loading.dismiss();
      },
      complete: () => {
        loading.dismiss();
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
        console.error('Erro no login:', error);
      },
      complete: () => {
        this.carregarDados();
      }
    });
  }

}
