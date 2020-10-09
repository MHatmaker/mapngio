import { Component, AfterViewInit, AfterContentInit, forwardRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ModalController } from '@ionic/angular';
import { PusherclientService } from '../../services/pusherclient.service';

@Component({
  selector: 'app-tourguide',
  templateUrl: './tourguide.component.html',
  styleUrls: ['./tourguide.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TourguideComponent),
      multi: true
    }
  ]
})
export class TourguideComponent implements AfterContentInit, ControlValueAccessor {
  // public tourists: IterableIterator<string>;
  private touristgroup: FormGroup;

  constructor(
    private pushsvc: PusherclientService,
    private formBuilder: FormBuilder,
    public modalCtrl: ModalController, private ref: ChangeDetectorRef) {
    this.touristgroup = this.formBuilder.group({
      tourists: Array<string> ()
    });
  }

  ngAfterContentInit() {
    this.pushsvc.touristsUpdated.subscribe((tourClients: IterableIterator<string>) => {
      console.log('got touristsUpdated Event');
      // console.log(this.tourists);
      console.log(tourClients);
      this.ref.detectChanges();
      this.touristgroup.setValue({tourists: tourClients});
      // this.tourists = tourClients;
      // console.log(this.tourists);
      this.ref.detectChanges();
    });
    // this.ref.detectChanges();
    this.pushsvc.getTouristList();
    // this.ref.detectChanges();
  }
  writeValue(): void {
      // this.selectedItems = items || [];
      // this.onChange(this.selectedItems);
    }

    registerOnChange(fn: any): void {
      // this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
      // this.onTouch = fn;
    }
  selectTourGuide(t: string) {
    console.log('TourGuide selected is ' + t);
    this.pushsvc.updateCurrentTourGuide(t);
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
