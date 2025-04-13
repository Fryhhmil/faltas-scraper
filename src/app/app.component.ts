import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private storageService: StorageService) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.storageService.init();
  }
}

