
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AgoqueryService, IAgoItem } from '../../services/agoquery.service';
import { AgodetailComponent } from '../agodetail/agodetail.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'agoitem',
  templateUrl: 'agoitem.component.html'
})
export class AgoitemComponent {

  searchTermItem: string;
  private agoitemgroup: FormGroup;
  private agoItems: any;
  private items: any;
  private selectedItem: IAgoItem;
  private detailAccepted = false;
  private agodtl: HTMLIonModalElement;

  constructor(
    public modalCtrl: ModalController, private formBuilder: FormBuilder,
    private agoqp: AgoqueryService) {
    console.log('Hello AgoItemComponent Component');
    this.searchTermItem = 'Arcadia runs';
    this.agoitemgroup = this.formBuilder.group({
      searchTermItem: 'Arcadia runs',
      agoItems: Array<IAgoItem[]>()
    });
  }

  checkEnter(e) {   //  e is event object passed from function invocation
    let characterCode;   // literal character code will be stored in this variable

    if (e && e.which) {   // if which property of event object is supported (NN4)
      e = e;
      characterCode = e.which;   // character code is contained in NN4's which property
    } else {
      e = event;
      characterCode = e.keyCode;   // character code is contained in IE's keyCode property
    }

    if (characterCode === 13) {   // if generated character code is equal to ascii 13 (if enter key)
      this.itemFinderSubmit();   // submit the form
      return false;
    } else {
      return true;
    }
  }

  async itemFinderSubmit() {
    this.detailAccepted = false;
    const itm = this.agoitemgroup.getRawValue();
    const searchRes = await this.agoqp.findArcGISItem(itm.searchTermItem);
    console.log(searchRes);
    this.agoItems = searchRes;
      //  this.agoItems = searchRes.toArray();
/*          data => {
          let d: any = data;
          this.agoItems = d.results;
        },
        err => console.error(err),
          //  the third argument is a function which runs on completion
        () => console.log('done loading items')
      );
*/
    console.log(this.agoItems);
  }
  async selectAgoItem(itm) {
      console.log(`selected map item ${itm.title}`);
      this.selectedItem = itm;
      this.agodtl = await this.modalCtrl.create(
        {component: AgodetailComponent, componentProps: {title: itm.title, snippet: itm.snippet, thumbnailUrl: itm.thumbnailUrl}});
      await this.agodtl.present();
      const {data} = await this.agodtl.onDidDismiss();
      if ( data.selected === true ) {
        this.accept();
      } else {
        this.logForm();
      }
      // agodtl.present();
  }
  async accept() {
    console.log('agoitem component accept');
    this.detailAccepted = true;
    console.log(this.selectedItem);
    this.modalCtrl.dismiss({data: this.selectedItem});
  }
  logForm() {
    console.log(this.agoitemgroup.value);
  }
  cancel() {
        //  this.modalCtrl.dismiss();
    console.log('agoitem got cancel from agodetail');
    this.modalCtrl.dismiss({data: 'cancelled'});
  }
}
