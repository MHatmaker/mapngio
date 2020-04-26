import { Component, AfterContentInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-gmpopover',
  templateUrl: './gmpopover.component.html',
  styleUrls: ['./gmpopover.component.scss'],
})
export class GmpopoverComponent implements AfterContentInit {

  dockBtnId: string;
  shareBtnId: string;
  content: string;
  title: string;
  minimized = false;

  constructor(public popoverCtrl: PopoverController, public navParams: NavParams) {
    console.log(`Hello GmpopoverComponent Component for ${navParams.get('title')}`);
    this.title = navParams.get('title');
    this.content = navParams.get('content');
    this.shareBtnId = 'shareBtnId' + this.title;
    this.dockBtnId =  'dockBtnId' + this.title;
  }

  ngAfterContentInit() {
    const popconE = document.getElementsByClassName('popover-content')[0];
    const popconH = popconE as HTMLElement;
    popconH.style.bottom = '0';
    popconH.style.top = 'auto';
    popconH.style.transform = 'translateY(250px)';
  }

  shareClick(evt: Event) {
    this.popoverCtrl.dismiss({actions: 'share'});
  }
  dockPopup(evt: Event) {
    console.log(`got dockPopup event from ${this.title}`);
    // this.popoverCtrl.dismiss({'action': 'undock'});
    this.minimized = ! this.minimized;
  }
  closePopup(evt: Event) {
    this.popoverCtrl.dismiss({action: 'close'});
  }
}
