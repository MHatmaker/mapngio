import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-sharinghelp',
  templateUrl: './sharinghelp.component.html',
  styleUrls: ['./sharinghelp.component.scss'],
})
export class SharinghelpComponent {

  constructor(public modalCtrl: ModalController) {
    console.log('Hello SharinghelpComponent Component');
  }
  dismiss() {
      this.modalCtrl.dismiss();
  }
}
