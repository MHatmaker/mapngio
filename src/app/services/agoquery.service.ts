import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Utils } from '../libs/utils';
import { loadModules } from 'esri-loader';
import { ImlBounds } from './mlbounds.service';

export interface IAgoGroupItem {
  id: string;
  title: string;
  snippet: string;
  thumbnailUrl: string;
}
export interface IAgoItem {
  id: string;
  title: string;
  snippet: string;
  thumbnailUrl: string;
  itemUrl: string;
  defaultExtent: ImlBounds;
}

@Injectable()
export class AgoGroupItem implements IAgoGroupItem {

    constructor( public id: string,  public title: string,  public snippet: string, public thumbnailUrl: string) {
    }
}

@Injectable({
  providedIn: 'root'
})
export class AgoqueryService {

    private portalForSearch: any;

    constructor(public httpClient: HttpClient, private utils: Utils) {
      // this.loadPortal();
    }
    async loadPortal() {
        const options = {
          url: 'https://js.arcgis.com/4.8/'
        };
        const [ portal ] = await loadModules(
          ['esri/portal/Portal'], options);

        this.utils.showLoading();
        console.log('findArcGISGroup');
        this.portalForSearch = new portal();
        this.portalForSearch.authMode = 'immediate';
        this.portalForSearch.load().then( () => {
          console.log('portal loaded');
        });
      }
}
