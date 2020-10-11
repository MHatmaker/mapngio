import { Component, AfterContentInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { ModalController } from '@ionic/angular';
import { PusherclientService } from '../../services/pusherclient.service';

@Component({
  selector: 'app-tourguide',
  templateUrl: './tourguide.component.html',
  styleUrls: ['./tourguide.component.scss']
})
export class TourguideComponent implements AfterContentInit, ControlValueAccessor {
  public tourists: IterableIterator<string>;
  private selected: string;

  constructor(
    private pushsvc: PusherclientService,
    public modalCtrl: ModalController) {
  }

  ngAfterContentInit() {
    this.pushsvc.touristsUpdated.subscribe((tourClients: IterableIterator<string>) => {
      console.log('got touristsUpdated Event');
      console.log(tourClients);
      this.tourists = tourClients;
    });
    this.pushsvc.getTouristList();
  }
  writeValue(): void {
      // this.selectedItems = items || [];
      // this.onChange(this.selectedItems);
    console.log('writeValue');
  }

  registerOnChange(fn: any): void {
    // this.onChange = fn;
    console.log('registerOnChange');
    console.log(fn);
  }

  registerOnTouched(fn: any): void {
    // this.onTouch = fn;
    console.log('registerOnTouched');
    console.log(fn);
  }
  selectTourGuide(t: string) {
    console.log('TourGuide selected is ' + t);
    this.selected = t;
    // this.pushsvc.updateCurrentTourGuide(t);
  }

  accept() {
    console.log('TourguideComponent component accept');
    this.modalCtrl.dismiss({tourguide: this.selected});
  }
  cancel() {
        //  this.modalCtrl.dismiss();
    console.log('agoitem got cancel from TourguideComponent');
    this.modalCtrl.dismiss();
  }
}
