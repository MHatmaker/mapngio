
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AgoqueryService, AgoGroupItem, IAgoGroupItem } from '../../services/agoquery.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-agogroup',
  templateUrl: './agogroup.component.html',
  styleUrls: ['./agogroup.component.scss'],
})


export class AgogroupComponent {

  searchTermGrp: string;
  private agogroupgroup: FormGroup;
  private agoGroups: any;

  constructor(
    public viewCtrl: ModalController, private formBuilder: FormBuilder,
    private agoqp: AgoqueryService) {
    console.log('Hello AgogroupComponent Component');
    this.searchTermGrp = 'search terms';
    this.agogroupgroup = this.formBuilder.group({
      searchTermGrp: 'search terms',
      agoGroups : Array<AgoGroupItem[]>()
    });
  }
  async groupFinderSubmit() {
      const grp = this.agogroupgroup.getRawValue();
      this.agoGroups = await this.agoqp.findArcGISGroup(grp.searchTermGrp);

      console.log(this.agoGroups);
  }
  selectAgoItem(itm) {
      console.log(itm.title);
  }
  accept() {
      this.viewCtrl.dismiss();
  }
  logForm() {
    console.log(this.agogroupgroup.value);
  }
  cancel() {
      this.viewCtrl.dismiss();
  }
}
