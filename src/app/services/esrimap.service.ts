import { Injectable } from '@angular/core';
import { loadModules } from 'esri-loader';

@Injectable({
  providedIn: 'root'
})
export class EsrimapService {
  map: any;

  constructor() { }
  async  getGeo() {
  // Load the mapping API modules
      console.log('ESRIMapService getGeo async method');
      return loadModules([
        'esri/Map'
      ]).then(([Map]) => {
      console.log('ESRIMapService get new map');
      const map = new Map({
        basemap: 'topo-vector' as any
      });
    });
  }
  getMap(): any {
      return this.map;
  }
}
