import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-linkrhelp',
  templateUrl: './linkrhelp.component.html',
  styleUrls: ['./linkrhelp.component.scss'],
})
export class LinkrhelpComponent {

  constructor(public viewCtrl: ModalController) {
    console.log('Hello LinkrhelpComponent Component');
  }
  dismiss() {
      this.viewCtrl.dismiss();
  }
}
