
import { Component, Output, EventEmitter, OnInit, Renderer2, AfterViewInit, NgZone, ElementRef } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { MapinstanceService} from '../../services/mapinstance.service';
import { MLConfig } from '../../libs/MLConfig';
import { MapLocOptions, IMapShare } from '../../services/positionupdate.interface';
import { IPosition } from '../../services/position.service';
import { MlboundsService } from '../../services/mlbounds.service';
import { StartupGoogle } from '../../libs/StartupGoogle';
import { SlideviewService } from '../../services/slideview.service';
import { CanvasService } from '../../services/canvas.service';
import { InfopopService } from '../../services/infopop.service';

// import { PlacesSearch } from '../PlacesSearch/places.component';
// declare var google;

@Component({
  selector: 'maplinkr-googlemap',
  templateUrl: './googlemap.component.html'
  // styles: [ './googlemap.component.css']
})
export class GoogleMapComponent implements AfterViewInit, OnInit {
  @Output()
  viewCreated = new EventEmitter();
  private gmap: google.maps.Map;
  private mapNumber: number;
  private gmHeight = '540px';
  private glat: number;
  private glng: number;
  private zoom: number;
  private mlconfig: MLConfig;
  private mlconfigSet = false;
  private startup: StartupGoogle;
  nextState = 'normal';
  private gmarker: google.maps.Marker;
  private markerPosition: [number, number] = [0, 0];
  private ypos: number;
  private xpos: number;
  private numDeltas = 100;
  private i = 0;

  constructor(
      ngZone: NgZone, private mapInstanceService: MapinstanceService, private canvasService: CanvasService,
      public elementRef: ElementRef, private rndr: Renderer2,
      private slideViewService: SlideviewService,
      private infopopService: InfopopService) {

      console.log('GoogleMapComponent ctor');
      this.mapNumber = this.mapInstanceService.getNextSlideNumber();
      this.startup = new StartupGoogle(this.mapNumber,
          this.mapInstanceService.getConfigForMap(this.mapNumber));
      this.gmHeight = slideViewService.getMapColHeight() + 'px';
  }

  ngAfterViewInit() {

    // this.gmHeight = '380px';
    // let position: MapLocOptions = null;
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);

    const mapOptions: MapLocOptions = {
      center: {lat: latLng.lat(), lng: latLng.lng()},
      zoom: 15,
      // mapTypeId: google.maps.MapTypeId.ROADMAP,
      places: null,
      query: ''
    };
    // let mapElement = this.mapElement.nativeElement;
    // let mapElement = document.getElementById('google-map-component' + this.mapNumber);
    // this.gmHeight = '370px';

    console.log(this.elementRef.nativeElement);
    console.log(document.getElementById('google-map-component' + this.mapNumber));

    // this.geolocation.getCurrentPosition().then((position) => {
    // let position = this.canvasService.getInitialLocation();
    const mlcfg = this.mapInstanceService.getConfigForMap(this.mapNumber);
    if (this.mapNumber === 0) {
      const position = this.canvasService.getInitialLocation();
      this.glat = position.center.lat;
      this.glng = position.center.lng;
    } else {
      const position = mlcfg.getPosition();
      this.glat = position.lat;
      this.glng = position.lon;
    }


    // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    latLng = new google.maps.LatLng(this.glat, this.glng);
    mapOptions.center = {lng: this.glng, lat: this.glat};
    console.log(`geolocation center at ${this.glng}, ${this.glat}`);
    // this.rndr.setAttribute(mapElement, 'style', 'height: 550px; position: relative; overflow: hidden;');
    this.gmap = this.startup.configure('google-map-component' + this.mapNumber,
    this.elementRef.nativeElement.firstChild, mapOptions);

    const infopop = this.infopopService;    this.gmarker = new google.maps.Marker({
            position: latLng,
            map: this.gmap,
            title: 'moving marker'
        });
    const subscriber = infopop.dockPopEmitter.subscribe((retval: any) => {
      if (retval.action === 'undock') {
        this.transition(retval.position);
      }
    });

  }
  // The mapping between latitude, longitude and pixels is defined by the web
      // mercator projection.
   project(latLng): google.maps.Point {
    let siny = Math.sin(latLng.position.y * Math.PI / 180);
    const TILE_SIZE = 256;

    // Truncating to 0.9999 effectively limits latitude to 89.189. This is
    // about a third of a tile past the edge of the world tile.
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    return new google.maps.Point(
        TILE_SIZE * (0.5 + latLng.position.x / 360),
        TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.zoom = 14;
    //     let latLng = new google.maps.LatLng(this.glat, this.glng);
    // let mapOptions = {
    //   center: latLng,
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP,
    //   places: null,
    //   query: ''
    // };
    //     mapOptions.center = {lng: this.glng, lat: this.glat};
    //     console.log(`geolocation center at ${this.glng}, ${this.glat}`);
    //     this.startup.configure('google-map-component' + this.mapNumber, this.elementRef.nativeElement.firstChild, mapOptions);

  }
  onDomChange($event: Event): void {
      console.log('googlemap.component caught a domChange mutation event');
      console.log($event);
  }

  animateSquare(state: string) {
    this.nextState = state;
  }

  onBoundsChange = (evt) => {
      console.log('boundsChange');
      if (!this.mlconfigSet) {
          this.mlconfigSet = true;
          const ndx = this.mapInstanceService.getNextSlideNumber();
          this.mlconfig = this.mapInstanceService.getConfigForMap(ndx - 1);
          this.mlconfig.setRawMap(this.gmap);
      }
      this.glat = this.gmap.getCenter().lat();
      this.glng = this.gmap.getCenter().lng();
      const mp = this.gmap;

      this.mlconfig.setBounds(new MlboundsService(mp.getBounds().getSouthWest().lng(),
                               mp.getBounds().getSouthWest().lat(),
                               mp.getBounds().getNorthEast().lng(),
                               mp.getBounds().getNorthEast().lat()));
  }

  // markerDragEnd(m: marker, evt: MouseEvent) {
  //   console.log('dragEnd', m, evt);
  // }

  delayMarker() {
    return new Promise(resolve => setTimeout(resolve, 7));
  }

  async transition(position) {
    console.log(`transition starting to ${position.y}, ${position.x}`);
    const glat = this.gmap.getCenter().lat();
    const glng = this.gmap.getCenter().lng();
    const deltaLat = (position.y - glat) / this.numDeltas;
    const deltaLng = (position.x - glng) / this.numDeltas;
    console.log(`start moving by ${deltaLat}, ${deltaLng}`);
    this.gmarker.setVisible(true);

    const startOuter = async () => {
      console.log(`transition from ${glat}, ${glng}`);
      for (const nm of [1, 2, 3]) {
        let ypos = glat;
        let xpos = glng;

        const nums = Array.from(Array(100).keys());
        for (const num of nums) {
             await this.delayMarker();
             ypos += deltaLat;
             xpos += deltaLng;
             const latlng = new google.maps.LatLng(ypos, xpos);
             this.gmarker.setPosition(latlng);
         }
       }
     };

     startOuter().then(() => {
       console.log('finished outer');
       this.gmarker.setVisible(false);
     });
   }
}

// just an interface for type safety.
interface IMarker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
