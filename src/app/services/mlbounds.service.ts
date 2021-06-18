import { Injectable } from '@angular/core';
import Extent from '@arcgis/core/geometry/Extent';

export interface ImlBoundsParams {
    llx: number;
    lly: number;
    urx: number;
    ury: number;
}
export interface ImlPointParams {
  latp: number;
  lngp: number;
}
export interface ImlPoint extends ImlPointParams {
  lat(): number;
  lng(): number;
}

export interface ImlBounds extends ImlBoundsParams {
    getCenter(): Promise<{x: number, y: number}>;
    getEsriExtent(): Extent;
}

export interface XtntParams  {
    'src': string;
    'zoom': number;
    'lon': number;
    'lat': number;
    'scale': number;
    'action': string;
}

export class Xtnt {

  constructor(
    private src: string, private zoom: number, private lon: number,
    private lat: number, private scale: number= -1, private action: string = 'noaction') {
  }

  public getParams(): XtntParams {
    const xtn: XtntParams = {
      src: this.src,
      zoom: this.zoom,
      lon: this.lon,
      lat: this.lat,
      scale: this.scale,
      action: this.action
    };
    return xtn;
  }
}

console.log('loading MLBounds');

@Injectable({
  providedIn: 'root'
})
export class MlpointService implements ImlPoint {


    constructor( public lngp: number,  public latp: number) {
    }
    lat(): number {
      return this.latp;
    }
    lng(): number {
      return this.lngp;
    }
}
@Injectable({
  providedIn: 'root'
})
export class MlboundsService implements ImlBounds {
    constructor( public llx: number = -1,  public lly: number = -1,  public urx: number =  -1, public ury: number = -1) {
    }
    public async getCenter(): Promise<{x: number, y: number}> {
      const esriXtnt = new Extent({xmin: this.llx, ymin: this.lly, xmax: this.urx, ymax: this.ury});
      const esriCenter = esriXtnt.center;
      const x = esriCenter.x;
      const y = esriCenter.y;
      // let x = this.llx + 0.5 * (this.urx - this.llx);
      // let y = this.lly + 0.5 * (this.ury - this.lly);
      return {x, y};
    }
    public getEsriExtent(): Extent {
      const esriXtnt = new Extent({xmin: this.llx, ymin: this.lly, xmax: this.urx, ymax: this.ury,
        spatialReference: {
          wkid: 102100}
        });
      return esriXtnt;
    }
}
