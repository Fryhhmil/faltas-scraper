import { StorageService } from './../services/storage.service';
import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, throwError } from 'rxjs';
import { LoginForm } from '../model/login';
import { IonNav, IonNavLink, LoadingController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent  implements OnInit {

  cadastroForm: FormGroup;
  carregando = true;

  ngOnInit() {
    this.verificaLogado();
    this.carregando = false;
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loginService: LoginService,
    private storageService :StorageService,
    private loadingCtrl: LoadingController
  ) {
    this.cadastroForm = this.fb.group({
      cpf: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  // Exemplo de ação de login
  async login() {
    if (this.carregando == true) return;

    this.carregando = true;
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
      spinner: 'crescent'
    });
    await loading.present();

    const value = this.cadastroForm.value;

    this.loginService.login(value).pipe(
      // debounceTime(3000),
      // distinctUntilChanged(),
      catchError((e: HttpErrorResponse) => {
        this.carregando = false;
        return throwError(() => e);
      })
    ).subscribe({
      next: (retorno) => {
      this.storageService.setLogin(value);
      this.storageService.setCookie({ cookie: retorno, dataCriacao: new Date() });
      this.buscarFaltas(retorno);
      this.buscarHorario(retorno);
      },
      complete: async () => {
        this.router.navigate(['/']);
        await loading.dismiss();
        this.carregando = false;
      }, error: async () => {
        await loading.dismiss();
      }
    });
    // window.location.reload();
  }

  buscarFaltas(cookie: string): void {
    this.loginService.buscarFaltas(cookie).pipe(
      catchError((e: HttpErrorResponse) => {
        return throwError(() => e);
      })
    ).subscribe((retorno) => {
      this.storageService.setData(retorno);
    });
  }

  async verificaLogado() {
    const login: LoginForm = await this.storageService.getLogin();
    if(login && login.cpf != null) {
      this.router.navigate(['/']);
    }
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
      }
    });
  }

}
