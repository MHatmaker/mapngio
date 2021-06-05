import { Component, Output, EventEmitter, AfterViewInit, Renderer2, NgZone  } from '@angular/core';

import * as L from 'leaflet';
// import { Geolocation } from '@ionic-native/geolocation';
import { MapinstanceService} from '../../services/mapinstance.service';
import { MLConfig } from '../../libs/MLConfig';
import { MlboundsService } from '../../services/mlbounds.service';
import { StartupLeaflet } from '../../libs/StartupLeaflet';
// import { PlacesSearch } from '../PlacesSearch/places.component';

interface ILeafletParams {
    zoomControl: boolean;
    center: [number, number];
    zoom: number;
    minZoom: number;
    maxZoom: number;
}

@Component({
  selector: 'app-leafletmap',
  templateUrl: './leafletmap.component.html',
  styleUrls: ['./leafletmap.component.scss'],
})
export class LeafletMapComponent implements AfterViewInit {
  @Output()
  viewCreated = new EventEmitter();
  public mapNumber: number;
  private mlconfig: MLConfig;
  private mlconfigSet = false;
  private lmap: L.Map;
  private glat: number;
  private glng: number;

  private params: ILeafletParams = {
       zoomControl: true,
       center: [32.9866, -96.9271],  // I live in Carrollton, TX
       zoom: 15,
       minZoom: 4,
       maxZoom: 19
     };

  constructor(
    private mapInstanceService: MapinstanceService, private rndr: Renderer2) {
    // public geolocation: Geolocation) {
      this.mapNumber = this.mapInstanceService.getNextSlideNumber();
  }

  ngAfterViewInit() {
    /*
    this.geolocation.getCurrentPosition().then((position) => {

        // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.glat = position.coords.latitude;
      this.glng = position.coords.longitude;
      this.params.center = [this.glat, this.glng];
      this.lmap =  L.map('leaflet-map-component' + this.mapNumber, this.params);
      const mapElement = document.getElementById('leaflet-map-component' + this.mapNumber);
      this.rndr.setAttribute(mapElement, 'style', 'height: 550px; position: relative; overflow: hidden;');
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}).addTo(this.lmap);
      const mrkr = L.marker(this.params.center).addTo(this.lmap)
              .bindPopup(`You are at ${this.glng}, ${this.glat} `).openPopup();

      this.lmap.on('click', (e: L.LeafletMouseEvent) => {
          const lat = e.latlng.lat,
              lng = e.latlng.lng,
              marker = L.marker(e.latlng).addTo(this.lmap)
              .bindPopup(`You clicked at ${lng}, ${lat}`).openPopup();
      });
      this.lmap.on('moveend', (e) => {
          this.boundsChanged(e);
      });
    });
    */
  }

  boundsChanged(e) {
      const lfltBounds = this.lmap.getBounds();
      // const ne: L.LatLng = null,
      // sw: L.LatLng = null;
      console.log(lfltBounds);
      if (!this.mlconfigSet) {
          this.mlconfigSet = true;
          const ndx = this.mapInstanceService.getNextSlideNumber();
          this.mlconfig = this.mapInstanceService.getConfigForMap(ndx - 1);
          this.mlconfig.setRawMap(this.lmap);
      }
      if (lfltBounds) {
          const ne = lfltBounds.getNorthEast();
          const sw = lfltBounds.getSouthWest();
          const bnds = new MlboundsService(sw.lng, sw.lat, ne.lng, ne.lat);
          this.mlconfig.setBounds(bnds);
      }

  }
}
