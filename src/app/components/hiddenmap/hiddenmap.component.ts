import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MapopenerService } from '../../services/mapopener.service';
import { MapLocOptions } from '../../services/positionupdate.interface';
import { CanvasService } from '../../services/canvas.service';
import { PusherclientService } from '../../services/pusherclient.service';
import { PusherEventHandler } from '../../libs/PusherEventHandler';
import { MapinstanceService } from '../../services/mapinstance.service';
import { HostConfig } from '../../libs/HostConfig';

// declare var google;

@Component({
  selector: 'hiddenmap',
  templateUrl: 'hiddenmap.component.html',
  styleUrls: ['hiddenmap.component.scss']
})

export class HiddenmapComponent implements AfterViewInit {
  @ViewChild('hiddenmap',  {static: false}) mapElement: ElementRef;
  @Input() hasPusherKeys: any;
  map: google.maps.Map;
  pusherEventHandler: PusherEventHandler;
  private hiddenMapCreated = false;

  constructor(
    private mapOpener: MapopenerService, private canvasService: CanvasService,
    private pusherClientService: PusherclientService,
    private mapInstanceService: MapinstanceService,
    private hostConfig: HostConfig) {
    console.log('Hello HiddenmapComponent Component');
    // this.queryForPusherKeys();
  }

  ngAfterViewInit() {
    this.addHiddenCanvas();
    // this.mapOpener.openMap.subscribe(
    //     (data: MapLocOptions) => {
    //       if (this.hiddenMapCreated === false) {
    //         this.addHiddenCanvas();
    //       }
    // });
    // this.mapOpener.addHiddenCanvas.subscribe(() => {
    //     this.addHiddenCanvas();
    // });
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

    this.hostConfig.getPusherKeys().then(() => {
      this.pusherClientService.createHiddenPusherClient(this.pusherEventHandler.getEventDct());
    });
  }
  onPan(xj) {
    if (xj.hasOwnProperty('x')) {
        xj.lat = xj.y;
        xj.lon = xj.x;
        xj.zoom = xj.z;
    } else if (xj.hasOwnProperty('__zone_symbol__value')) {
       const fv = xj.__zone_symbol__value;
       xj.lat = fv.y;
       xj.lon = fv.x;
       xj.zoom = fv.z;
    }
    const cntr = new google.maps.LatLng(xj.lat, xj.lon);
    this.map.setCenter(cntr);
    this.map.setZoom(xj.zoom);
  }

  async queryForPusherKeys() {
    console.log('ready to await in queryForPusherKeys');
    const ret = await this.hostConfig.getPusherKeys();
    console.log('finished await in queryForPusherKeys');
    return ret;
  }
}
