
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';

import { InfopopService } from '../../services/infopop.service';


@Component({
  selector: 'infopop',
  templateUrl: 'infopop.component.html',
  styleUrls: ['infopop.component.scss']
})
export class InfopopComponent implements OnDestroy, OnInit {

    private popoverId: string;
    private element: Element;
    private parentElem: Element;
    private minimized = false;
    public title: string;
    public content: string;
    public show: boolean;
    private popped: boolean;
    public mrkrlabel: string;
    public worldCoordinates: {'lat': number, 'lng': number};

    constructor(private infopopsvc: InfopopService, private el: ElementRef) {
        this.element = el.nativeElement;
        this.popped = true;
        this.worldCoordinates = {lat: 99, lng: 99};
    }


    ngOnInit(): void {
        const modal = this;
        console.log('Component Infopop method: ngOnInit');
        // this.popoverId = 'temporaryId';

        // ensure id attribute exists
        // if (!this.popoverId) {
        //     console.error('modal must have an id');
        //     return;
        // }

        // move element to bottom of page (just before </body>) so it can be displayed above everything else

        // this.parentElem = document.getElementById(this.popoverId);
        // this.parentElem.appendChild(this.element);

        // close modal on background click
        this.element.addEventListener('click',  (e: any) => {
            const target = e.target;
            // if (!target.closest('.modal-body').length) {
            //     modal.close();
            // }
        });

        // add self (this modal instance) to the modal service so it's accessible from controllers
        console.log('add this popup to infopopsvc');
// this.popoverId = uuid();
        console.log(this);
        this.infopopsvc.add(this);
    }


    getId() {
        return this.popoverId;
    }
    setId(id: string ) {
      this.popoverId = id;
    }
    setShareShow(showHide: boolean) {
      this.show = showHide;
    }
    setCoordinates(latlng: {lng: number, lat: number}) {
      this.worldCoordinates.lng = latlng.lng;
      this.worldCoordinates.lat = latlng.lat;
    }
    getCoordinates(): {'lng': number, 'lat': number} {
      return this.worldCoordinates;
    }

    // remove self from modal service when directive is destroyed
    ngOnDestroy(): void {
        this.infopopsvc.remove(this.popoverId);
        this.element.remove();
    }

    // open modal
    open(content: string, title: string): void {
        // this.element.show();
        this.content = content;
        this.title = title;
        this.element.parentElement.classList.add('modal-open');
    }

    // close modal
    close(): void {
        // this.element.hide();
        // this.element.parentElement.classList.remove('modal-open');
        this.popped = false;
    }
  shareClick(evt: Event) {
    this.infopopsvc.share(this.popoverId);
    // this.viewCtrl.dismiss({"action": "share"});
  }
  dockPopup(evt: Event) {
    console.log(`got dockPopup event from ${this.title}`);
    this.infopopsvc.undock(this.popoverId);
    // this.viewCtrl.dismiss({"action": "undock"});
    this.minimized = ! this.minimized;
  }
  closePopup(evt: Event) {
    this.infopopsvc.close(this.popoverId);
    // this.viewCtrl.dismiss({"action": "close"});
  }
}

/*
  http://jasonwatmore.com/post/2017/01/24/angular-2-custom-modal-window-dialog-box
  https://stackoverflow.com/questions/40524197/how-to-position-a-popover-in-ionic-2
*/
