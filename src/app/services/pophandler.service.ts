
import { Injectable } from '@angular/core';
import { MarkerInfoPopup } from '../libs/MarkerInfoPopup';
import { Popover } from 'ionic-angular';
import { GmpopoverService } from './gmpopover.service';

@Injectable({
  providedIn: 'root'
})
export class PophandlerService {

  markerInfoPopups: {}; // Map<string, MarkerInfoPopup> = new Map<string, MarkerInfoPopup>();
  curpop: MarkerInfoPopup = null;

  constructor() {
    console.log('Hello PophandlerProvider Provider');
    this.markerInfoPopups = {};
  }

  addPopup(title: string, pop: MarkerInfoPopup) {
    // if(this.curpop) {
    //   this.curpop.infoWindow.close();
    // }
    // this.markerInfoPopups.forEach((pop : MarkerInfoPopup, title : string) => {
    // console.log(`addPopup for ${title}`);
    // for(const key of Object.keys(this.markerInfoPopups)) {
    //   this.markerInfoPopups[key].infoWindow.close();
    // };
    this.markerInfoPopups[title] = pop;
    // this.curpop = pop;
  }

  closePopupsExceptOne(testTitle: string) {
    console.log(`close all popups except ${testTitle}`);
    for (const key of Object.keys(this.markerInfoPopups)) {
      if (key !== testTitle) {
        this.markerInfoPopups[key].closePopover(key);
        // console.log(`closed ${key}`);
      }
    }
  }
  closeAllPopups() {
    console.log('closeAllPopups()');

    // for(const key of Object.keys(this.markerInfoPopups)){
    //   this.markerInfoPopups[key].infoWindow.close();
      // console.log(`closed popup for {key}`);
    // }
  }

}
