import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MapLocCoords, MapLocOptions } from '../services/positionupdate.interface';


@Injectable({
  providedIn: 'root'
})
export class MaplocoptsService {
  private center: any;
  private zoom: number;


  constructor() { }

  getCenter(): MapLocCoords {
    return this.center;
  }
  getZoom(): number {
    return this.zoom;
  }
}
