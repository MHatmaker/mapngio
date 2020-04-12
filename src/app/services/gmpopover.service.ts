
import { Injectable, EventEmitter } from '@angular/core';
import { GmpopoverComponent } from '../components/gmpopover/gmpopover.component';
import { PopoverController, Popover } from 'ionic-angular';
import { PophandlerService } from '../services/pophandler.service';


export class PopRect {
  constructor(public left: string, public top: string, public bottom: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class GmpopoverService {

  private popOver: Popover = null;
  private title: string;
  private popovers = new Map<string, Popover>();
  public dockPopEmitter = new EventEmitter<{'action': string, 'title': string}>();

  constructor(private popCtrl: PopoverController, private pophandler: PophandlerService) {
    console.log('Hello GmpopoverService');

  }
  open(content: string, title: string): {pop: Popover, poprt: PopRect} {
    this.title = title;
    // if(this.popOver) {
    //   console.log(`in RE-open  for ${title}, call dismiss on previous popovers`);
    //   this.popOver.dismiss({action: 'close', title: title});
    //   // this.popOver = null;
    // } else {
    console.log(`Create new popOver for ${title}`);
    this.popOver = this.popCtrl.create(GmpopoverComponent,
        {title, content}, {cssClass: 'popover-custom', enableBackdropDismiss: true});
    // }
    const ev = {
        target: {
          getBoundingClientRect: () => {
            return {
              // top: '200',
              bottom: '0',
              left: '20'
            };
          }
        }
      };
    this.popOver.present({ev});

    this.popOver.onDidDismiss((data: {action: string, title: string}) => {
        console.log(`popover onDidDismiss`);
        if (data) {
          console.log(`got title ${data.title}`);
          data.title = this.title;
        } else {
          console.log('onDidDismiss with background click');
          data = {title: this.title, action: 'undock'};
        }
        console.log(data);
        // if(this.popOver) {
        //     this.popOver = null;
        // }
        this.dockPopEmitter.emit(data);
    });
    const rect = new PopRect('20', '100', 'unset');
    return {pop: this.popOver, poprt: rect};
  }

  closePopover(title: string) {
    if (this.popovers[title]) {
      this.popovers[title].close();
    }
  }

  close() {
      console.log(`gmpopover.close() for ${this.title}`);
      if (this.popOver) {
        console.log(`forcing close for ${this.title}`);
        // this.popOver.dismiss({action: 'close', title: this.title});
        this.popOver = null;
        // this.dockPopEmitter.emit({'action': 'close', title: this.title});
      }
  }

}
