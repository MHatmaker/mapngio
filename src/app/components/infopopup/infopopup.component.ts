
import { Component } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { PusherclientService } from '../../services/pusherclient.service';

@Component({
  selector: 'app-infopopup',
  templateUrl: './infopopup.component.html',
  styleUrls: ['./infopopup.component.scss'],
})
export class InfopopupComponent {

  private itemContent: any;
  public content: string;
  public title: string;
  public dockBtnId: string;
  public shareBtnId: string;
  public popoverId: string;

  constructor(info: NavParams, public modalCtrl: ModalController, private pusherClientService: PusherclientService ) {
    console.log('Hello InfopopupComponent Component');
    // alert(info.get('address'));
    // this.itemContent = info.get('address');
    const pushLL = {
        x : info.get('x'),
        y : info.get('y'),
        z : info.get('z'),
        referrerId : info.get('referrerId'),
        referrerName : info.get('referrerName'),
        address : info.get('address')
    };
    this.itemContent = pushLL;
    // this.itemContent = this.sharemapInfo.getInfo();
  }

  publishInfo() {
    this.pusherClientService.publishClickEvent(this.itemContent);
    this.modalCtrl.dismiss();

  }
  cancel() {
    console.log('cancelled arcgis infopopup');
    this.modalCtrl.dismiss();
  }

}
