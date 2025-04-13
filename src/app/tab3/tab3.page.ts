import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  constructor(
    private storageService: StorageService,
  ) {}

  async apagarLogin() {
    await this.storageService.removeLogin();
    console.log('Token removido!');
  }

}
