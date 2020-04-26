
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { mlBounds } from '../libs/mlBounds.interface';
import { MapLocOptions, MapLocCoords, IMapShare } from './positionupdate.interface';
import { MapinstanceService } from './mapinstance.service';
import { Utils } from '../libs/utils';
import {} from 'googlemaps';

// declare var google;

@Injectable({
  providedIn: 'root'
})
export class SearchplacesService {
    private searchString: string;
    private configDetails: IMapShare;

    constructor(public mapInstanceService: MapinstanceService) {
        console.log('Hello SearchplacesProvider Provider');
    }

    getParameterByName(name: string) {
        // console.log('get paramater ' + name + ' from ' + this.details.search);
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
            results = regex.exec(this.searchString);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    getBoundsFromUrl(searchString: string) {
        this.searchString = searchString;
        const llx = this.getParameterByName('llx'),
            lly = this.getParameterByName('lly'),
            urx = this.getParameterByName('urx'),
            ury = this.getParameterByName('ury');
        return {llx, lly, urx, ury};
    }
    query() {
        return this.getParameterByName('gmquery');
    }
    lon(): number {
        const s = this.getParameterByName('lon');
        return  Number(s);
    }
    lat(): number {
        return Number(this.getParameterByName('lat'));
    }
    zoom(): number {
        return Number(this.getParameterByName('zoom'));
    }

    async searchForPlaces(opts: IMapShare, cb: any) {
        // pos = {center: cntr, zoom: zoom, query: gmQuery, places: null};
        const gmap = this.mapInstanceService.getHiddenMap();

        const googlecntr = new google.maps.LatLng(opts.mapLocOpts.center.lat, opts.mapLocOpts.center.lng);

        const cfg = this.mapInstanceService.getRecentConfig();
        const bnds = cfg ? cfg.getBounds() : null;
        // const bnds = opts.mlBounds;
        const gmquery = opts.mapLocOpts.query;

        const sw = new google.maps.LatLng(bnds.lly, bnds.llx);
        const ne = new google.maps.LatLng(bnds.ury, bnds.urx);
        const queryPlaces = {
          bounds: new google.maps.LatLngBounds(sw, ne),
          location: googlecntr,
          query: gmquery
        };
        const service = new google.maps.places.PlacesService(gmap);
        await service.textSearch(queryPlaces, (p) => {
            if (p.length !== 0) {
                return p;
            } else {
                console.log('no places returned from PlacesServices for ${query}');
                return null;
            }

        });
    }
}
