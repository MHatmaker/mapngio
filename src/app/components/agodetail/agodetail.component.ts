import { Component } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';


@Component({
  selector: 'app-agodetail',
  templateUrl: './agodetail.component.html',
  styleUrls: ['./agodetail.component.scss'],
})
/**
 * Generated class for the AgodetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'agodetail',
  templateUrl: 'agodetail.component.html'
})
export class AgodetailComponent {

  title: string;
  snippet: string;
  thumbnailUrl: any;

  constructor(private detailInfo: NavParams, private modalCtrl: ModalController ) {
    console.log('Hello AgodetailComponent Component');
    this.title = detailInfo.get('title');
    this.snippet = detailInfo.get('snippet');
    this.thumbnailUrl = detailInfo.get('thumbnailUrl');
  }
  cancelSelectedItem() {
    const data = {selected: false};
    this.modalCtrl.dismiss(data );
  }
  loadMapForItem() {
    const data = {selected : true};
    console.log('agodetail loadMapForItem ');
    console.log(data);
    this.modalCtrl.dismiss(data);
  }
}
