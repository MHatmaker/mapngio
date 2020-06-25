import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Utils } from '../libs/utils';
import { loadModules } from 'esri-loader';
import { request } from '@esri/arcgis-rest-request';
import { IItem, ISearchResult, searchItems } from '@esri/arcgis-rest-portal';
import { ImlBounds, MlboundsService } from './mlbounds.service';

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
export class AgoItem implements IAgoItem {

    constructor(
      public id: string,  public title: string,  public snippet: string,
      public thumbnailUrl: string, public itemUrl: string, public defaultExtent: ImlBounds) {
    }
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

  simplifyGroupResults(d) {
    const items: Array<IAgoGroupItem> = new Array<IAgoGroupItem>();
    d.forEach((itm) => {
      items.push(new AgoGroupItem(itm.id, itm.title, itm.snippet, itm.thumbnailUrl));
    });
    return items;
  }
  simplifyItemResults(data: ISearchResult<IItem>) {
    const items: Array<IAgoItem> = new Array<AgoItem>();
    // d.forEach((itm: AgoItem) => {

    for (let i = 0; i < data.total; i++) {
      const itm = data.results[i];
      if (itm && itm.type === 'Web Map') {
        const xtnt = itm.extent;
        const bnds = new MlboundsService(xtnt[0][0], xtnt[0][1], xtnt[1][0], xtnt[1][1]);
        console.log(`item name: ${itm.title}, type: ${itm.type}, isLayer: ${itm.isLayer}`);
        const thumbUrl = 'https://darcadian.maps.arcgis.com/sharing/rest/content/items/' + itm.id + '/info/' + itm.thumbnail;
        console.log('item url ' + itm.url);
        console.log('thumbnailUrl ' + thumbUrl);
        items.push(new AgoItem(itm.id, itm.title, itm.snippet, thumbUrl, itm.url, bnds));
      }
    }
    return items;
  }

  async findArcGISGroup(searchTermGrp) {
      const options = {
        url: 'https://js.arcgis.com/4.8/'
      };
      const [ portal, PortalQueryParams ] = await loadModules(
        ['esri/portal/Portal', 'esri/portal/PortalQueryParams'], options);

      // utils.  showLoading();
      const
          portalQueryParams = {
              query:  searchTermGrp,
              num: 20  // find 40 items - max is 100
          };
      console.log('findArcGISGroup');
      const data = await this.portalForSearch.queryGroups(portalQueryParams);
      return this.simplifyGroupResults(data.results);
  }

  async findArcGISItem(searchTermItem: string) {
    // const url: string = 'https://www.arcgis.com/sharing/rest/search?q=' + searchTermItem + '&f=pjson';
    // const data = this.portalForSearch.
    // const fetchedItems = await this.httpClient.get<ISearchResult<IItem>>(url);

    // searchItems(searchTermItem)
    // .then(fetchedItems => {
    //   const simp = this.simplifyItemResults(fetchedItems);
    //   return simp;
    // });
    const fetchedItems = await searchItems(searchTermItem);
    const simp = this.simplifyItemResults(fetchedItems);
    return simp;

    // console.log(fetchedItems);
    // const simp = this.simplifyItemResults(fetchedItems);
    // console.log(simp);
        /*
    let unpacked = await fetchedItems.subscribe(
      data => {
        this.items = data;
      },
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => {
        console.log('done loading items');
        console.log(this.items);
        let simp = this.simplifyItemResults(this.items.results);
        console.log(simp);
        return simp;
      }
    );*/
    // console.log(unpacked);
    // console.log(fetchedItems);
    // return fetchedItems;
    // return null;
  }

}
