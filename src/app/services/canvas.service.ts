import {
    Injectable,
    Injector,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    ApplicationRef,
    ViewContainerRef,
    EventEmitter
    // ComponentRef
} from '@angular/core';
import { MapinstanceService } from './mapinstance.service';
import { SlideshareService } from './/slideshare.service';
// import { SlideviewService } from './/slideview.service';
import { IPosition } from './position.service';
import { IConfigParams, EMapSource } from './/configparams.service';
import { MLConfig } from '../libs/MLConfig';
import { MLInjector } from '../libs/MLInjector';
// import { MultiCanvasEsriComponent } from '../components/multicanvas/multicanvasesri.component';
// import { MultiCanvasGoogleComponent } from '../components/multicanvas/multicanvasgoogle.component';
// import { MultiCanvasLeaflet } from '../components/multicanvas/multicanvasleaflet.component';
import { PusherConfig } from '../libs/PusherConfig';
// import { Geolocation } from '@ionic-native/geolocation';
import { Plugins } from '@capacitor/core';
import { MapLocOptions, IMapShare } from './positionupdate.interface';
import { MapopenerService } from './mapopener.service';
// import { MlboundsService, ImlBounds } from './mlbounds.service';

const { Geolocation } = Plugins;

// import {MultiCanvasGoogleComponent} from '../MultiCanvas/multicanvasgoogle.component';
interface ICoords {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
    private ndx: number;
    private canvases: Array<any> = new Array<any>();
    private outerMapNumber = 0;
    private selectedMapType: string;
    private initialLoc: MapLocOptions = {center: {lat: -1, lng: -1}, zoom: 15, places: null, query: ''};
    private currentLoc: MapLocOptions = {center: {lat: -1, lng: -1}, zoom: 15, places: null, query: ''};
    private glongitude: number;
    private glatitude: number;
    private isApp = true;
    setCurrent = new EventEmitter<number>();

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector,
        private mapInstanceService: MapinstanceService,
        private slideshareService: SlideshareService,
        // private slideViewService: SlideviewService,
        // private geoLocation: Geolocation,
        private mapOpener: MapopenerService,
        private pusherConfig: PusherConfig
      ) {
        // this.awaitInitialLocation();
    // this.geoLocation.getCurrentPosition().then((position) => {
    //
    //     // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //     console.log(`geoLocate current position ${position.coords.longitude}, ${position.coords.latitude}`);
    //     let glat = position.coords.latitude;
    //     let glng = position.coords.longitude;
    //     this.glatitude = glat;
    //     this.glongitude = glng;
    //     let latLng = new google.maps.LatLng(glat, glng);
    //     this.initialLoc = {
    //       center: {'lng': glng, 'lat': glat},
    //       zoom: 15,
    //       places: null,
    //       query: ""
    //       //mapTypeId: google.maps.MapTypeId.ROADMAP
    //     };
    //   }).catch( (err) => {
    //         console.log(`geoLocation getCurrentPosition error ${err}`);
    //   });
    }

    geoSuccess(position: any): any  {
        this.initialLoc.center.lat = position.coords.latitude;
        this.initialLoc.center.lng = position.coords.longitude;
    }
    setPlatform(pltfrm: boolean) {
      this.isApp = pltfrm;
    }
    isMobileApp(): boolean {
      return this.isApp;
    }

    public async getCurrentLocationBrowser(): Promise<{coords: ICoords}> {

      const options = {timeout: 10000, enableHighAccuracy: false};
      return await new Promise<{coords: ICoords}>(async (resolve, reject) => {
        await navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    }

    public async getCurrentLocation(isInitial: boolean = true) {
      console.log('getCurrentLocation');
      // const options = {timeout: 10000, enableHighAccuracy: false};
      const position = await Geolocation.getCurrentPosition();
      // this.geoLocation.getCurrentPosition(options).then((position) => {
      if (isInitial) {
          this.initialLoc.center.lat = position.coords.latitude;
          this.initialLoc.center.lng = position.coords.longitude;
      } else {

      const glat = position.coords.latitude;
      const glng = position.coords.longitude;
      // const latLng = new google.maps.LatLng(glat, glng);
      this.currentLoc = {
        center: {lng: glng, lat: glat},
        zoom: 15,
        places: null,
        query: ''
        // mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      const maphoster = this.mapInstanceService.getMapHosterInstanceForCurrentSlide();
      maphoster.setCurrentLocation(this.currentLoc);
    }
    // });
    }


    awaitInitialLocation = async () => {
      if (this.isApp) {
          await this.getCurrentLocation(true);
          this.initialLoc = this.currentLoc;
      } else {

          const {coords} = await this.getCurrentLocationBrowser();
          console.log(coords);
          const {latitude, longitude} = coords;
          console.log(coords);
          this.initialLoc.center.lng = longitude;
          this.initialLoc.center.lat = latitude;
          // this.initialLoc = this.currentLoc;
          console.log(`lng ${this.initialLoc.center.lng}, lat ${this.initialLoc.center.lat}`);
      }
      // let maphoster = this.mapInstanceService.getMapHosterInstanceForCurrentSlide();
      // maphoster.setCurrentLocation(this.currentLoc);
    }
    awaitCurrentLocation = async () => {
        if (this.isApp) {
          await this.getCurrentLocation();
          console.log(`lng ${this.initialLoc.center.lng}, lat ${this.initialLoc.center.lat}`);
          // this.initialLoc = this.currentLoc;
      } else {
        try {
          console.log('call getCurrentLocationBrowser');
          const {coords} = await this.getCurrentLocationBrowser();
          console.log(coords);
          const {latitude, longitude} = coords;
          console.log(coords);
          this.initialLoc.center.lng = longitude;
          this.initialLoc.center.lat = latitude;
          // this.initialLoc = this.currentLoc;
          console.log(`lng ${this.initialLoc.center.lng}, lat ${this.initialLoc.center.lat}`);
        } catch (err) {
          console.log('timeout on geoLocation');
          console.error(err);
        }
      }
      // let maphoster = this.mapInstanceService.getMapHosterInstanceForCurrentSlide();
      // maphoster.setCurrentLocation(this.currentLoc);
    }

    getIndex() {
        return this.ndx;
    }
    getInitialLocation(): MapLocOptions {
        return this.initialLoc;
    }

  setInitialLocation(maplocOpts: MapLocOptions) {
    this.initialLoc = maplocOpts;
    // this.initialLoc.center = maplocOpts.center;
    // this.initialLoc.zoom = 15;
    // this.initialLoc.query = maplocOpts.query;
    // this.initialLoc.places = maplocOpts.places;
  }

  async addInitialCanvas(userName: string) {
        // await this.awaitInitialLocation();
        if (userName === '') {
          userName = this.pusherConfig.getUserName();
        }

        // let opts: MapLocOptions = this.initialLoc;
        const shr: IMapShare = {mapLocOpts: this.initialLoc, userName, mlBounds: null,
            source: EMapSource.urlgoogle, webmapId: 'nowebmap'};
        console.log(`geolocation center at ${this.glongitude}, ${this.glatitude}`);
        this.mapOpener.openMap.emit(shr);
  }

  addCanvas(
    mapType: string,
    mapTypeToCreate: any, source: EMapSource, entry: ViewContainerRef, mlcfg: MLConfig,
    maploc: MapLocOptions): HTMLElement {
      console.log('in canvasService.addCanvas');
      console.log(`mapType: ${mapType}`);
      console.log(mapTypeToCreate);
      const currIndex: number = this.mapInstanceService.getNextSlideNumber();
      let
          mlConfig: MLConfig = null;
      if (mlcfg) {
          mlConfig = mlcfg;
      } else {
          // this might not be used
          if (this.mapInstanceService.hasConfigInstanceForMap(currIndex) === false) {
              console.log(`hasConfigInstanceForMap for index ${currIndex} is false`);
              const ipos = {lon: 37.422858, lat: -122.085065, zoom: 15} as IPosition,
                  cfgparams = {mapId: this.outerMapNumber, mapType: this.selectedMapType,
                        webmapId: 'nowebmap', mlposition: ipos, source} as IConfigParams,
                  mlconfig = new MLConfig(cfgparams);
              mlconfig.setHardInitialized(true);
              // newpos = new MLPosition(-1, -1, -1);
              // icfg = <IConfigParams>{mapId: -1, mapType: 'unknown', webmapId: '', mlposition: newpos}
              // mlConfig = new MLConfig(icfg);
              console.log('addCanvas with index ' + currIndex);
              console.log(mlConfig);
              mlconfig.setConfigParams(this.mapInstanceService.getConfigInstanceForMap(
                  currIndex === 0 ? currIndex : currIndex - 1).getConfigParams());
              this.mapInstanceService.setConfigInstanceForMap(currIndex, mlconfig); // angular.copy(mlConfig));
          } else {
              console.log(`getConfigForMap for current index ${currIndex}`);
              const mlcfg0 = this.mapInstanceService.getConfigForMap(currIndex > 0 ? currIndex - 1 : 0);
              const ipos = mlcfg0.getPosition();
              mlcfg0.setPosition(ipos);
          }
      }

      this.ndx = currIndex;
      const appendedElem = this.appendNewCanvasToContainer(mapTypeToCreate, entry);

      console.log(`now incrementMapNumber from index ${currIndex}`);
      this.mapInstanceService.incrementMapNumber();
      this.mapInstanceService.setCurrentSlide(currIndex);
      this.slideshareService.slideData.emit({
                  mapListElement: appendedElem,
                  slideNumber: currIndex,
                  mapName: 'Map ' + currIndex
              });
      return;
  }


    appendNewCanvasToContainer(component: any, entry: ViewContainerRef) {
        this.canvases.push(component);
        const mapParent = document.getElementsByClassName('mapcontent')[0];
        // Create a component reference from the component
        const componentRef = this.componentFactoryResolver
          .resolveComponentFactory(component)
          .create(MLInjector.injector);
        // const r = this.componentFactoryResolver;
        // const fac = r.resolveComponentFactory(component);
        // // const compRef = fac.create(MLInjector.injector);
        // const compRef = entry.createComponent(fac);

        // Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(componentRef.hostView);

        // Get DOM element from component
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
          .rootNodes[0] as HTMLElement;

        // Append DOM element to the body
        mapParent.appendChild(domElem);
        return;
    }
    /*
    makeCanvasSlideListItem (ndx) {
        var newCanvasItem = document.createElement('li');
        newCanvasItem.id = "slide" + ndx;
        return newCanvasItem;
    }
    loadCanvasSlideListItem (elem, ndx) {
        this.canvases.push(new MultiCanvas.Canvas(elem, ndx));
        this.canvases[this.canvases.length - 1].init();
    }
    */
    getCanvasSlideListItem(ndx: number) {
        return this.canvases[ndx];
    }


}
