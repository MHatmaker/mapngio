import { Component, ElementRef, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { EsrimapService } from '../../services/esrimap.service';

import { SpatialReference } from '@arcgis/core/geometry';
import Point from '@arcgis/core/geometry/Point';
import { Geolocation } from '@ionic-native/geolocation/ngx';
// import * as proj4 from 'proj4';
import { MapinstanceService} from '../../services/mapinstance.service';
import { MLConfig } from '../../libs/MLConfig';
import { ImlBounds, MlboundsService } from '../../services/mlbounds.service';
// import { SpatialReference } from 'esri/geometry';
// import { Geometry } from 'esri/geometry';
// import * as Geometry from 'esri/geometry';
// import { Point } from 'esri/geometry';
import { Utils } from '../../libs/utils';
import { StartupArcGIS } from '../../libs/StartupArcGIS';

// import * as Locator from 'esri/tasks/Locator';
// import { webMercatorToGeographic, xyToLngLat, lngLatToXY } from 'esri/geometry/support/webMercatorUtils';

declare var proj4;

@Component({
  selector: 'maplinkr-esrimap',
  templateUrl: './esrimap.component.html',
  styleUrls: ['./esrimap.component.scss']
})
export class EsriMapComponent implements OnInit {

  @Output()
  viewCreated = new EventEmitter();
  // @ViewChild('map') mapEl: ElementRef;
  //     mapView:any = null;
  private mapView: any;
  private glat: number;
  private glng: number;
  public mapNumber: number;
  private amap: any;
  private fixedLLG = null;
  private geoLocator: __esri.Locator;
  private screenPt: null;
  private startup: StartupArcGIS;
  private mlconfig: MLConfig;
  // private mlProj4: any;

  constructor(
    private mapService: EsrimapService, private geolocation: Geolocation,
    private mapInstanceService: MapinstanceService,
    private elementRef: ElementRef, private utils: Utils) {
  }

  ngOnInit() {
    const mapOptions = {
      center: new Point({
        x: -87.620692,
        y: 41.888941,
        spatialReference: new SpatialReference({ wkid: 4326 })
      }),
      zoom: 15
    };
    this.mapNumber = this.mapInstanceService.getNextSlideNumber();
    this.startup = new StartupArcGIS();
    this.startup.configure(this.mapNumber, mapOptions, this.elementRef.nativeElement.firstChild);


}}
