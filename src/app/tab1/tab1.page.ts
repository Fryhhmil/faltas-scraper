import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  logado = false;
  carregando = true;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.verificaLogado();
    this.carregarDados();
  }

  // async salvarLogin() {
  //   await this.storageService.setLogin("MEU_TOKEN_SUPER_SEGURO");
  //   console.log('Token salvo com sucesso!');
  // }

  async verificaLogado() {
    const login = await this.storageService.getLogin();
    if(login != null) this.logado = true;
  }

  async mostrarLogin() {
    const token = await this.storageService.getLogin();
    console.log('Token recuperado:', token);
  }

  async apagarLogin() {
    await this.storageService.removeLogin();
    console.log('Token removido!');
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

  carregarDados(): void {
    this.carregando = false;
  }

}
