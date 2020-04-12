
import { Injectable,
         EventEmitter } from '@angular/core';
import { MapLocOptions, MapLocCoords, IMapShare } from '../services/positionupdate.interface';
import { mlBounds } from '../libs/mlBounds.interface';
import { EMapSource } from './configparams.service';


@Injectable({
  providedIn: 'root'
})

export class MapopenerService implements IMapShare {
    openMap = new EventEmitter<IMapShare>();
    addHiddenCanvas = new EventEmitter<any>();
    center: MapLocCoords;
    zoom: number;
    places: any;
    query: string;
    mapLocOpts: MapLocOptions;
    userName: string;
    mlBounds: mlBounds;
    source: EMapSource;
    webmapId: string;

  constructor() {
  }
  getCenter(): MapLocCoords {
    return this.mapLocOpts.center;
  }
  getZoom(): number {
    return this.mapLocOpts.zoom;
  }

}
