import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlideviewService {

  constructor() { }

    mapcolheight = 550;

    setMapColHeight(h: number) {
        this.mapcolheight = h;
    }
    getMapColHeight() {
        return this.mapcolheight;
    }
}
