import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { LoginForm } from '../model/login';
import { FaltaDTO } from '../model/faltas';


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

  async setLogin(loginForm: LoginForm) {
    await this._storage?.set('login', loginForm);
  }

  async getLogin() {
    return await this._storage?.get('login');
  }

  async removeLogin() {
    await this._storage?.remove('login');
  }

  async setData(data: FaltaDTO[]) {
    await this._storage?.set('data', data);
  }

  async getData(): Promise<FaltaDTO[]> {
    return await this._storage?.get('data');
  }
}
