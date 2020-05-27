import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MapopenerService } from '../../services/mapopener.service';
import { MapLocOptions } from '../../services/positionupdate.interface';
import { CanvasService } from '../../services/canvas.service';
import { PusherclientService } from '../../services/pusherclient.service';
import { PusherEventHandler } from '../../libs/PusherEventHandler';
import { MapinstanceService } from '../../services/mapinstance.service';

// declare var google;

@Component({
  selector: 'hiddenmap',
  templateUrl: 'hiddenmap.component.html',
  styleUrls: ['hiddenmap.component.scss']
})

export class HiddenmapComponent {
  @ViewChild('hiddenmap',  {static: false}) mapElement: ElementRef;
  map: google.maps.Map;
  pusherEventHandler: PusherEventHandler;
  private hiddenMapCreated = false;

  constructor(
    private mapOpener: MapopenerService, private canvasService: CanvasService,
    private pusherClientService: PusherclientService,
    private mapInstanceService: MapinstanceService) {
    console.log('Hello HiddenmapComponent Component');
    mapOpener.openMap.subscribe(
        (data: MapLocOptions) => {
          if (this.hiddenMapCreated === false) {
            this.addHiddenCanvas();
          }
    });
    mapOpener.addHiddenCanvas.subscribe(() => {
        this.addHiddenCanvas();
    });
  }

  addHiddenCanvas() {
    const mapOptions = this.canvasService.getInitialLocation();

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    const bnds = this.map.getBounds();
    console.log('hidden canvas bounds');
    console.log(bnds);
    this.hiddenMapCreated = true;
    console.log('Add pusher event handler for hidden map');
    this.mapInstanceService.setHiddenMap(this.map);

    this.pusherEventHandler = new PusherEventHandler(-1);
    this.pusherEventHandler.addEvent('client-MapXtntEvent', (xj) => this.onPan(xj));
    this.pusherEventHandler.addEvent('client-MapClickEvent', (pt) => {});
    this.pusherClientService.createHiddenPusherClient(this.pusherEventHandler.getEventDct());
  }
  onPan(xj) {
    const cntr = new google.maps.LatLng(xj.lat, xj.lon);
    this.map.setCenter(cntr);
    this.map.setZoom(xj.zoom);
  }

}
