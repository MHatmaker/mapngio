
import { Injectable, Output, EventEmitter } from '@angular/core';
import { InfopopupComponent } from '../components/infopopup/infopopup.component';
import { PusherclientService } from './pusherclient.service';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SharemapService {

  // @Output() change: EventEmitter<boolean> = new EventEmitter();
  info: any;
  private useStoredInfo = false;

  constructor(private modalCtrl: ModalController, private pusherClientService: PusherclientService) {
    console.log('Hello SharemapProvider Provider');
    this.useStoredInfo = false;
  }

  setInfo(nfo) {
    this.useStoredInfo = true;
    this.info = nfo;
  }

  shareInfo(nfo) {
    if (this.useStoredInfo) {
      this.useStoredInfo = false;
      // this.change.emit(this.info);
      this.pusherClientService.publishClickEvent(this.info);
    } else {
      // this.change.emit(nfo);
      this.pusherClientService.publishClickEvent(nfo);
    }
  }

  getInfo() {
    return this.info;
  }
  async showInfo(nfo) {
    // need to pass nfo to modal
    const modal = await this.modalCtrl.create({component: InfopopupComponent});
    modal.present();
  }

}
