import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent  implements OnInit {

  logado: boolean = false;

  constructor(private router: Router) {}

  // Exemplo de ação de login
  login() {
    this.logado = true;
  }

  apagarLogin() {
    this.logado = false;
  }

  ngOnInit() {}

}
