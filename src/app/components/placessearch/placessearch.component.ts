
// import {} from 'google';
import { Component, NgZone, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapinstanceService } from '../../services/mapinstance.service';
import { DestselectionComponent } from '../destselection/destselection.component';
import { MapopenerService } from '../../services/mapopener.service';
// import { MaplocoptsProvider } from '../../providers/maplocopts/maplocopts';
import { MLConfig } from '../../libs/MLConfig';

import { MapLocOptions, MapLocCoords, IMapShare } from '../../services/positionupdate.interface';
import { EMapSource } from '../../services/configparams.service';
import { CanvasService } from '../../services/canvas.service';


@Component({
  selector: 'places-for-maplinkr',
  templateUrl: './placessearch.component.html',
  styleUrls: ['./placessearch.component.scss'],
})

export class PlacesSearchComponent implements AfterViewInit {
    @ViewChild('searchBox', {static: false})
    searchBoxRef: ElementRef;
    input: any;
    searchBox: any;

  constructor(
    private ngZone: NgZone, private mapInstanceService: MapinstanceService,
    private canvasService: CanvasService, private mapopener: MapopenerService, private modalCtrl: ModalController) {
  }

  ngAfterViewInit() {
      this.input = this.searchBoxRef.nativeElement;

      this.searchBox = new google.maps.places.SearchBox(this.input);
      console.log('listening on searchBox');
      this.searchBox.addListener('places_changed', () => {
          // const queryPlaces = {
          //   bounds: google.maps.LatLngBounds,
          //   location: google.maps.LatLng,
          //   query: String
          // };
          // console.log(this.searchBox);
          console.log(this.input.value);

          if (this.mapInstanceService.getNextSlideNumber() === 0) {
              this.setupInitialSlide();
          } else {
            const mph = this.mapInstanceService.getMapHosterInstanceForCurrentSlide();
            const gmap: google.maps.Map = this.mapInstanceService.getHiddenMap();

            const cfg = this.mapInstanceService.getRecentConfig();
            const bnds: google.maps.LatLngBounds = gmap.getBounds(); // cfg.getRawMap().getBounds(); //gmap.getBounds();
            const cntr = mph.getCenter();
            const googlecntr = new google.maps.LatLng(cntr.lat, cntr.lon);
            console.log('searchBox latest bounds');
            console.log(bnds);
            console.log('cntr ' + cntr.lat + ', ' + cntr.lon);

            const queryPlaces = {
              bounds: bnds,
              location: googlecntr,
              query: this.input.value
            };
            // queryPlaces.bounds = bnds;
            // queryPlaces.location = googlecntr;
            // queryPlaces.query = this.input.value;
            const service = new google.maps.places.PlacesService(gmap);
            try {
            service.textSearch(queryPlaces, async (plcs, status, pagination) => {
                console.log(status);
                if (plcs.length !== 0) {
                    // const plcs = p;
                    const modal = await this.modalCtrl.create({component: DestselectionComponent});
                    modal.present();
                    const {data} = await modal.onDidDismiss();
                    console.log(data.destination.title);
                    if (data.destination.title === 'New Tab' || data.destination.title === 'New Window') {
                        let opts: MapLocOptions = null;
                        const gmquery = this.input.value;
                        // opts = this.frameMarkers(queryPlaces, plcs, bnds);
                        const cntrobj: MapLocCoords = {lat: cntr.lat, lng: cntr.lon};
                        opts = { center:  cntrobj, zoom: gmap.getZoom(), places: plcs, query: gmquery};
                        const mlbnds = {
                          llx: bnds.getSouthWest().lng(),
                          lly: bnds.getSouthWest().lat(),
                          urx: bnds.getNorthEast().lng(),
                          ury: bnds.getNorthEast().lat()
                        };
                        const shr: IMapShare = {mapLocOpts: opts, userName: 'foo', mlBounds: mlbnds,
                            source: EMapSource.placesgoogle, webmapId: 'nowebmap'};
                        console.log('emit with shr');
                        console.log(shr);
                        this.mapopener.openMap.emit(shr);
                    } else {
                        mph.placeMarkers(plcs);
                    }

                  } else {
                    return;
                  }
                });
              } catch (error) {
                console.log(error);
              }
            }
      });

    }

    frameMarkers(queryPlaces, plcs, bnds) {
      let opts: MapLocOptions = null;
      const gmquery = this.input.value;
      const mph = this.mapInstanceService.getMapHosterInstanceForCurrentSlide();
      const gmap = this.mapInstanceService.getHiddenMap();
      if (queryPlaces.location) {
          const coords: any = queryPlaces.location;
          const cntr: MapLocCoords = { lng: coords.lng(), lat: coords.lat()};
          opts = { center:  cntr, zoom: gmap.getZoom(), places: plcs, query: gmquery};
        } else {
          bnds = new google.maps.LatLngBounds();
          // for (const i=0; i < plcs.length; i++) {
          for (const plc of plcs) {
            bnds.extend(plc.geometry.location);
          }
          const cntr2: google.maps.LatLng = bnds.getCenter();
          const cntr3: MapLocCoords = {lng: cntr2.lng(), lat: cntr2.lat()};
          opts = { center:  cntr3, zoom: gmap.getZoom(), places: plcs, query: gmquery};
      }
      return opts;
    }

    setupInitialSlide() {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: this.input.value}, (results, status) => {
        if (status === 'OK') {
          const loc = {lng: results[0].geometry.location.lng(), lat: results[0].geometry.location.lat()};
          const opts: MapLocOptions = { center:  loc, zoom: 15, places: null, query: this.input.value};
          this.canvasService.setInitialLocation(opts);
          this.canvasService.addInitialCanvas('');
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }

}
