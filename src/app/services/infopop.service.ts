// import { HttpClient } from '@angular/common/http';
import { Injectable,
    EventEmitter,
    Injector,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    ApplicationRef } from '@angular/core';
import * as _ from 'underscore';
// import { v4 as uuid } from 'uuid';
import { MapinstanceService } from './mapinstance.service';
import { ImlPoint, MlpointService } from './mlbounds.service';
import { InfopopComponent } from '../components/infopop/infopop.component';

class PopupItem {
  mapNumber: number;
  pop: any;
}

@Injectable({
  providedIn: 'root'
})
export class InfopopService {
  public dockPopEmitter = new EventEmitter<{'action': string, 'title': string, 'labelShort': string,
    position: {'x': number, 'y': number}, 'markerElement' : google.maps.Marker}>();
  private latestId: string;
      private modals: any[] = [];
      private modalMap: Map<string, PopupItem> = new Map<string, PopupItem>();
      private currentContent: string;
      private currentTitle: string;
      private mrkrlabel: string;
      private mapNumber: number;
      private geopos: {'lng': number, 'lat': number};
      private pos: ImlPoint;
      private popupId: string;
      public show: boolean;
      private domElem: HTMLElement;
      private markerElement: google.maps.Marker;

    constructor(
        public mapInstanceService: MapinstanceService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector) {
      console.log('Hello InfopopProvider Provider');
    }

    create(
        markerElement: google.maps.Marker,
        mapNumber: number, component: any,
        content: string, title: string, lbl: string, popupId: string, showHide: boolean = true) {

        const  parentElem = document.getElementById('google-map-component' + mapNumber);
        // console.log(`infpop.create for Id ${popupId}, title ${title}`);
        console.log(parentElem);
        this.markerElement = markerElement;
        this.currentContent = content;
        this.currentTitle = title;
        this.mrkrlabel = lbl;
        this.mapNumber = mapNumber;
        // cache popupId to be fetched in add method after element is generated
        this.popupId = popupId;
        this.show = showHide;

        this.geopos = {lng: markerElement.getPosition().lng(), lat: markerElement.getPosition().lat()};
        const gll = markerElement.getPosition();
        const gpos = this.project(new google.maps.Point(gll.lng(), gll.lat()));
        this.pos = new MlpointService(gpos.x, gpos.y);

        const componentRef = this.componentFactoryResolver
          .resolveComponentFactory<InfopopComponent>(component)
          .create(this.injector);

        componentRef.instance.title = title;  // open(content, title);
        componentRef.instance.content = content;
        componentRef.instance.mrkrlabel = lbl;
        // Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(componentRef.hostView);

        // Get DOM element from component
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
          .rootNodes[0] as HTMLElement;

        // Append DOM element to the body
        parentElem.appendChild(domElem);
        this.domElem = domElem;
        return domElem;
      }

      add(modal: any) {
          // modal has been added to dom in infopop component
          // add modal to array of active modals
          this.modals.push(modal);
          this.latestId = this.popupId; // modal.getId();
          modal.setId(this.latestId);
          modal.markerElement = this.markerElement;
          modal.title = this.currentTitle;
          modal.content = this.currentContent;
          modal.mrkrlabel = this.mrkrlabel;
          modal.setShareShow(this.show);
          modal.setCoordinates(this.geopos);
          // this.modalMap[this.latestId] = {mapNumber: this.mapNumber, pop: modal};
          this.modalMap.set(this.latestId, {mapNumber: this.mapNumber, pop: modal});
      }
      getLatestId(): string {
        return this.latestId;
      }

      hasModal(popupId: string, mapNum: number): boolean {
          const firstTest = this.modalMap.has(popupId);
          // if (firstTest === true) {
          //     return this.modalMap.get(popupId).mapNumber === mapNum ? true: false;
          // }
          // return false;
          return firstTest;
      }

      remove(id: string) {
          // remove modal from array of active modals
          // const modalToRemove = _.findWhere(this.modals, { id: id });
          // this.modals = _.without(this.modals, modalToRemove);
          if (this.modalMap.has(id)) {
            const popItem = this.modalMap.get(id);
            const mapNo = popItem.mapNumber;
            const elemToRemove = popItem.pop.element;
            // const mapNo = this.modalMap.get(id).mapNumber;
            const parentElem = document.getElementById('google-map-component' + mapNo);
            // const elemToRemove = this.modalMap.get(id).pop.element;
            parentElem.removeChild(elemToRemove);
            this.modalMap.delete(id);
          }
      }

      open(content: string, title: string, ngUid: string) {
          // open modal specified by id
          console.log('We are supposed to open a modal here in infopop provider');
          // const modal = _.findWhere(this.modals, { id: ngUid });
          // const modal = this.modalMap.get(ngUid);
          // modal.open(content, title);
      }

      close(ngUid: string, removeMarker: boolean) {
          // close modal specified by id
          if (removeMarker) {
            this.dockPopEmitter.emit({action: 'close', title: ngUid, labelShort: '',
            position: {x: this.pos.lng(), y: this.pos.lat()}, markerElement: this.markerElement});
          }
          // const modal = _.find(this.modals, { ngUid: ngUid });
          const modal = this.modalMap.get(ngUid); // [ngUid];
          if (modal) {
            modal.pop.close();
          }
          this.remove(ngUid);
          // this.modalMap.delete(ngUid);
      }
      share(id: string) {
          // console.log(`infopop emitting share action with title (id): ${id}`);
          const modal = this.modalMap.get(id);
          this.dockPopEmitter.emit({
            action: 'share',
            title: id,
            labelShort: modal.pop.mrkrlabel,
            position: {x: this.pos.lng(), y: this.pos.lat()}, markerElement: this.markerElement});
      }
      undock(id: string) {
          const modal = this.modalMap.get(id);
          const coords = modal.pop.getCoordinates();
          // const latlng = new google.maps.LatLng(coords.lng, coords.lat);
          // const pos = this.project(latlng);
          const pos = {x: coords.lng, y: coords.lat};
          this.dockPopEmitter.emit({action: 'undock', title: id, labelShort: '', position: pos,
            markerElement: modal.pop.markerElement});
      }
      contains(id: string): boolean {
        return _.contains(this.modals, id);
      }
      subset(id: string): any[] {
        const modalToSkip = _.findWhere(this.modals, {id});
        return _.without(this.modals, modalToSkip);
      }
  // The mapping between latitude, longitude and pixels is defined by the web
      // mercator projection.
      project(latLng: google.maps.Point): google.maps.Point {
        let siny = Math.sin(latLng.y * Math.PI / 180);
        const TILE_SIZE = 256;

        // Truncating to 0.9999 effectively limits latitude to 89.189. This is
        // about a third of a tile past the edge of the world tile.
        siny = Math.min(Math.max(siny, -0.9999), 0.9999);

        return new google.maps.Point(
            TILE_SIZE * (0.5 + latLng.x / 360),
            TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
        }
}
