

import { Component, ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Destination, DestinationsService } from '../../services/destinations.service';

@Component({
  selector: 'destselection',
  templateUrl: 'destselection.component.html',
  styleUrls: ['./destselection.component.scss']
})
export class DestselectionComponent implements OnInit {
  public selectedDestination: Destination;
  public destinations: Array<Destination> = [];
  public useDestination: string;
  // @ViewChild('useDestination', { read: ElementRef }) useDestination : ElementRef;

  constructor(
    public viewCtrl: ModalController, private destinationsProvider: DestinationsService,
    private zone: NgZone) {
    console.log('Hello DestselectionComponent Component');
  }

  ngOnInit() {
    this.destinations = this.destinationsProvider.getDestinations();
    this.selectedDestination = this.destinationsProvider.previousDestination();
    // this.useDestination.nativeElement.innerText = this.selectedDestination.title;
    this.useDestination = this.selectedDestination.title;
    // this.destinationsProvider.clearChecks(this.selectedDestination);
  }

  checkDestination(item) {
      this.selectedDestination = item;
      // this.useDestination.nativeElement.innerText = this.selectedDestination.description;
      this.zone.run(() => {
          // this.destinationsProvider.clearChecks(item);
          this.useDestination = this.selectedDestination.description;
      });
  }

  accept() {
      this.destinationsProvider.preserveDestination(this.selectedDestination);
      this.viewCtrl.dismiss({destination : this.selectedDestination});
      // this.viewCtrl.dismiss({destination : this.selectedDestination.title});
  }
  logForm() {
  }
  cancel() {
      this.viewCtrl.dismiss({destination : 'cancel'});
  }
}
