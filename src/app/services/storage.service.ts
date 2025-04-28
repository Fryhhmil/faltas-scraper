import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { LoginForm } from '../model/login';
import { FaltaDTO } from '../model/faltas';
import { DadosCookie } from '../model/dadosCookie';
import { HorarioAlunoDTO } from '../model/horarioAluno';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // DADOS LOGIN
  async setLogin(loginForm: LoginForm) {
    await this._storage?.set('login', loginForm);
  }

  async getLogin() {
    return await this._storage?.get('login');
  }

  async removeLogin() {
    await this._storage?.remove('login');
  }

  // DADOS FALTAS
  async setData(data: FaltaDTO[]) {
    await this._storage?.set('data', data);
  }

  async getData(): Promise<FaltaDTO[]> {
    return await this._storage?.get('data');
  }

  // DADOS COOKIES
  async setCookie(data: DadosCookie) {
    await this._storage?.set('cookie', data);
  }

  async removeCookie() {
    await this._storage?.remove('cookie');
  }

  async getCookie(): Promise<DadosCookie> {
    return await this._storage?.get('cookie');
  }

  // DADOS CALENDARIO
  async setCalendario(data: HorarioAlunoDTO) {
    await this._storage?.set('horario', data);
  }

  async getCalendario(): Promise<HorarioAlunoDTO> {
    return await this._storage?.get('horario');
  }
}
