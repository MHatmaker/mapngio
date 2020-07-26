import { Injectable } from '@angular/core';

export interface IPosition {
    lon?: number;
    lat?: number;
    zoom?: number;
}

console.log('loading MLPosition');

@Injectable({
  providedIn: 'root'
})
  export class PositionService implements IPosition {

      constructor( public lon?: number,  public lat?: number,  public zoom?: number) {
      }
}
