import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

interface Location {
  lat: number;
  lon: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private locs: Array<Location>;

  constructor() { }

  getInitialLocations(): Array<Location> {
    this.locs = new Array<Location>();
    this.locs.push({lat: 41.890283, lon: -87.625842, name: 'Lofty Thoughts',
    description: 'Creativity is inspired by collapsing ceilings and rubble walls.'});
    this.locs.push({lat: 41.888941, lon: -87.620692, name: 'Drafty Sweatbox',
    description:  'Climate control as nature intended.'});
    this.locs.push({lat: 41.884979, lon: -87.620950, name: 'Blank Wall Vistas',
    description:  'Panorama views are over-rated if you prefer exposed brick.'});
    return this.locs;
  }
}
