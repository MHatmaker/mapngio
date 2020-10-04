import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PusherclientService } from '../../services/pusherclient.service';

@Component({
  selector: 'app-tourguide',
  templateUrl: './tourguide.component.html',
  styleUrls: ['./tourguide.component.scss'],
})
export class TourguideComponent implements AfterViewInit {
  public tourists: IterableIterator<string>;
  private touristgroup: FormGroup;

  constructor(
    private pushsvc: PusherclientService,
    private formBuilder: FormBuilder,
    public modalCtrl: ModalController, private ref: ChangeDetectorRef) {
    this.touristgroup = this.formBuilder.group({
      tourists: Array<string> ()
    });
    pushsvc.touristsUpdated.subscribe((tourClients: IterableIterator<string>) => {
      console.log('got touristsUpdated Event');
      this.tourists = tourClients;
      this.ref.detectChanges();
    });
  }

  ngAfterViewInit() {
    // this.ref.detectChanges();
    this.tourists = this.pushsvc.getTouristList();
    // this.ref.detectChanges();
  }

  selectTourGuide(t: string) {
    console.log('TourGuide selected is ' + t);
  }

  async accept() {
    console.log('agoitem component accept');
    this.modalCtrl.dismiss();
  }
  logForm() {
    console.log(this.touristgroup.value);
  }
  cancel() {
        //  this.modalCtrl.dismiss();
    console.log('agoitem got cancel from agodetail');
    this.modalCtrl.dismiss();
  }
}
