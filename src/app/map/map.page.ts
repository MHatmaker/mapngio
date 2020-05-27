import { Component, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
// import { IonicPage, ModalController, AlertController, AlertOptions } from '@ionic/angular';
import { IPosition, PositionService } from '../services/position.service';
// import { IonicPage, AlertOptions } from 'ionic-angular';
import { IConfigParams, EMapSource } from '../services/configparams.service';
import { MLConfig } from '../libs/MLConfig';
import { HostConfig } from '../libs/HostConfig';
import { PusherConfig } from '..//libs/PusherConfig';
import { PusherEventHandler } from '../libs/PusherEventHandler';
import { PusherclientService } from '../services/pusherclient.service';
import { MapinstanceService} from '../services/mapinstance.service';
import { CarouselComponent} from '../components/carousel/carousel.component';

import { MultiCanvasEsri } from '../components/multicanvas/multicanvasesri.component';
import { MultiCanvasGoogle } from '../components/multicanvas/multicanvasgoogle.component';
import { MultiCanvasLeaflet } from '../components/multicanvas/multicanvasleaflet.component';
import { CanvasService } from '../services/canvas.service';
// import { ISlideData } from '../services/slidedata.interface';
import { SlideshareService } from '../services/slideshare.service';
import { SlideviewService } from '../services/slideview.service';
import { MenuOptionModel } from '../components/side-menu-content/models/menu-option-model';
import { PageService } from '../services/page.service';
import { NewsComponent } from '../components/news/news.component';
import { LinkrhelpComponent } from '../components/linkrhelp/linkrhelp.component';
import { SharinghelpComponent } from '../components/sharinghelp/sharinghelp.component';
import { LocateselfComponent } from '../components/locateself/locateself.component';
import { PushersetupComponent } from '../components/pushersetup/pushersetup.component';
import { MsgsetupComponent } from '../components/msgsetup/msgsetup.component';
import { AgogroupComponent } from '../components/agogroup/agogroup.component';
import { AgoitemComponent } from '../components/agoitem/agoitem.component';
import { HiddenmapComponent } from '../components/hiddenmap/hiddenmap.component';
import { MapopenerService } from '../services/mapopener.service';
import { MapLocOptions, MapLocCoords, IMapShare } from '../services/positionupdate.interface';
import { MlboundsService } from '../services/mlbounds.service';
import { SearchplacesService } from '../services/searchplaces.service';
// import { AppModule } from '../app.module';
// import { MLInjector } from '../libs/MLInjector';


@Component({
  selector: 'app-map',
  templateUrl: '../map/map.page.html',
  styleUrls: ['../map/map.page.scss'],
})
export class MapPage implements AfterViewInit {

      @ViewChild('mapcontainer', { static: false, read: ViewContainerRef }) entry: ViewContainerRef;
      private outerMapNumber = 0;
      private mlconfig: MLConfig;
      private menuActions = {};
      private pusherEventHandler: PusherEventHandler;
      private mapHosterDict: Map<string, any> = new Map<string, any>([
          ['google', MultiCanvasGoogle],
          ['arcgis', MultiCanvasEsri],
          ['leaflet', MultiCanvasLeaflet]
      ]);

    constructor(
      private mapInstanceService: MapinstanceService, private canvasService: CanvasService,
      private slideshareService: SlideshareService, pageService: PageService,
      private slideViewService: SlideviewService, private modalCtrl: ModalController,
      private agoAlert: AlertController,
      private mapOpener: MapopenerService, private hostConfig: HostConfig, private pusherConfig: PusherConfig,
      private pusherClientService: PusherclientService) {
      // If we navigated to this page, we will have an item available as a nav param
      // this.selectedMapType = navParams.subItems.length === 0 ?  'google': navParams.subItems[0].displayName; //get('title');
      this.setupMenuActions(modalCtrl);

      pageService.menuOption.subscribe(
        (data: MenuOptionModel) => {
          console.log(data);
          if (this.mapHosterDict.has(data.displayName)) {
              this.onsetMap(data);
          } else {
              this.menuActions[data.displayName]();
          }
        });
      mapOpener.openMap.subscribe(
          (data: IMapShare) => {
            console.log('mapOpener.openMap subscriber entered');
            console.log(`source is ${data.source}`);
            if (data.source === EMapSource.urlgoogle) {
                this.addCanvasGoogle(data);
            } else if (data.source === EMapSource.placesgoogle) {
                this.addCanvasGoogle(data);
            } else if (data.source === EMapSource.sharegoogle) {
                this.onNewMapPosition(data);
            } else if (data.source === EMapSource.srcagonline) {
                this.onNewMapPosition(data);
            } else if (data.source === EMapSource.urlagonline) {
                this.openArcGISMapOnStartup();
            } else {
                console.log('invalid EMapSource');
            }
      });
      if (this.hostConfig.getWebmapId(true) === '') {
          console.log('does not appear to be a webmap');
          this.showLocate(true);
      }

    }

    setupMenuActions(modalCtrl: ModalController) {
      this.menuActions = {
          'Latest News': async () => {
            const modal = await modalCtrl.create({component: NewsComponent});
            modal.present();
          },
          'Using MapLinkr': () => {
              this.showUsing();
          },
          'Locate Self': () => {
              this.showLocate(false);
          },
          'Search Group': async () => {
            const modal = await modalCtrl.create({component: AgogroupComponent});
            modal.present();
          },
          'Search Map': () => {
            this.searchMap();
          },
          'Sharing Instructions': () => {
              this.showSharingHelp();
          },
          'Share Map': async () => {
            const modal = await modalCtrl.create({component: MsgsetupComponent});
            modal.present();
            const { data } = await modal.onDidDismiss();
            if (data.mode === 'usepush') {
                // const pusherClientService = AppModule.injector.get(PusherclientService);
                // publish stringifyed IMapShare
                this.pusherClientService.publishPosition(data);
                // this.onNewMapPosition(data);
          }

          },
          'Pusher Setup': async () => {
            const modal = await modalCtrl.create({component: PushersetupComponent});
            modal.present();
          },
          'Remove Map': () => {
            this.removeCanvas(this.mapInstanceService.getCurrentSlide());
          }
      };
    }

    async searchMap() {
        const modal = await this.modalCtrl.create({component: AgoitemComponent});
        const { data } = await modal.onDidDismiss();
        // modal.onDidDismiss(async (data) => {
        console.log('Ago dialog dismissed processing');
        console.log(data);
        if (data !== 'cancelled') {
            const xtnt: MlboundsService = data.defaultExtent;
            // new MLBounds(data.extent[0][0], data.extent[0][1], data.extent[1][0], data.extent[1][1]);
            const xcntr = await xtnt.getCenter();
            const cntr: IPosition = new PositionService(xcntr.x, xcntr.y, 15);
            const mplocCoords: MapLocCoords = {lat: xcntr.x, lng: xcntr.y};
            const mploc: MapLocOptions = {center: mplocCoords, zoom: 15, places: null, query: null};
            const mlcfg = new MLConfig({mapId: -1, mapType: 'arcgis', webmapId: data.id,
              mlposition: cntr, source: EMapSource.srcagonline, bounds: xtnt});
            mlcfg.setBounds(xtnt); // this is'nt the first map oened in this session
            if (! this.mapInstanceService.getHiddenMap() ) {
                this.mapOpener.addHiddenCanvas.emit();
            }
            const opts: IMapShare = {mapLocOpts: mploc, userName: this.hostConfig.getUserName(), mlBounds: xtnt,
                source: EMapSource.srcagonline, webmapId: data.id};
            this.addCanvasArcGIS(opts, mlcfg, data.id);
        }
        modal.present();
    }

    ngAfterViewInit() {
      this.pusherEventHandler = new PusherEventHandler(-101);
      if (this.hostConfig.getWebmapId(true) !== '')  {
            this.mapOpener.openMap.emit({
                mapLocOpts: null,
                userName: null,
                mlBounds: null,
                source: EMapSource.urlagonline,
                webmapId: ''
              });
        }
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad MapsPage');
    }
    async presentAlert() {
      const alert = await this.agoAlert.create({
        header: 'ArcGIS Online',
        subHeader: 'Webmap',
        message: 'Hold on for an AGO webmap',
        buttons: ['OK']
      });

      await alert.present();
    }
    async openArcGISMapOnStartup() {
      if (this.hostConfig.getWebmapId(true) !== '') {
            console.log('appears to be a webmap');
            await this.presentAlert();
            // const xtnt: MLBounds = data.defaultExtent;
            // new MLBounds(data.extent[0][0], data.extent[0][1], data.extent[1][0], data.extent[1][1]);
            const lng = +this.hostConfig.lon();
            const lat = +this.hostConfig.lat();
            const zm = +this.hostConfig.zoom();
            const cntr: IPosition = new PositionService(lng, lat, zm);
            const mplocCoords: MapLocCoords = {lat, lng};
            const mploc: MapLocOptions = {center: mplocCoords, zoom: 15, places: null, query: null};
            const wmId = this.hostConfig.getWebmapId(true);
            const mlcfg = new MLConfig({mapId: -1, mapType: 'arcgis', webmapId: wmId,
              mlposition: cntr, source: EMapSource.urlagonline, bounds: null});
            this.mapInstanceService.setConfigInstanceForMap(0, mlcfg);
            // mlcfg.setBounds(xtnt);// this is'nt the first map oened in this session
            if (! this.mapInstanceService.getHiddenMap() ) {
                this.mapOpener.addHiddenCanvas.emit(null);
            }
            const opts: IMapShare = {mapLocOpts: mploc, userName: this.hostConfig.getUserName(), mlBounds: null,
                source: EMapSource.srcagonline, webmapId: wmId};
            this.addCanvasArcGIS(opts, mlcfg, wmId);
        }
    }
    async showUsing() {
      const modal = await this.modalCtrl.create({component: LinkrhelpComponent});
      modal.present();
      const { data } = await modal.onDidDismiss();
      console.log('showUsing returned');
      console.log(data.mode);
    }

    async showLocate(showModal: boolean) {
        console.log('show locate');

        if (showModal) {
          const modal = await this.modalCtrl.create({component: LocateselfComponent});
          modal.present();
          const { data } = await modal.onDidDismiss();
          console.log('showLocate returned');
          console.log(data);
          if (data === 'showme') {
            this.canvasService.addInitialCanvas(this.pusherConfig.getUserName());
          } else if (data === 'usequery') {
            console.log('must be a request for Ago Online item on startup');
            this.hostConfig.showConfig('showConfig for ago url startup');
          } else {
            const modal0 = await this.modalCtrl.create({component: PushersetupComponent});
            await modal0.present();
            this.searchMap();
            return;
          }

        } else {
          this.canvasService.getCurrentLocation(false);
        }
    }
    public async showSharingHelp() {
      const modal = await this.modalCtrl.create({component: SharinghelpComponent});
      await modal.present();
      const { data } = await modal.onDidDismiss();
      // modal.onDidDismiss((mode, data) => {
      console.log('showUsing returned');
      console.log(data.mode);
      }

    onsetMap(menuOption: MenuOptionModel) {
        const srcdct = {
            google: EMapSource.srcgoogle,
            arcgis: EMapSource.srcagonline,
            leaflet: EMapSource.srcleaflet
        };
        const opts: IMapShare = {mapLocOpts: null, userName: this.hostConfig.getUserName(), mlBounds: null,
            source: EMapSource.srcagonline, webmapId: 'nowebmap'};
        if (menuOption.displayName === 'google') {
            this.addCanvasGoogle(opts);
        }
        // this.addCanvas( menuOption.displayName, srcdct[menuOption.displayName], null, null, 'nowebmap');
    }

    onNewMapPosition(opts: IMapShare) {

        const nextWindowName = this.hostConfig.getNextWindowName();
        console.log(`is Initial User ? ${this.hostConfig.getInitialUserStatus()}`);
        console.log(`onNewMapPosition - Open new window with name ${nextWindowName}, query: ${opts.mapLocOpts.query},
              source: ${opts.source}`);
        const referrerName = opts.userName;
        // this isn't a shared map if it is coming from us and we aleady have it open
        if (this.hostConfig.getUserName() !== referrerName) {
            if (opts.source === EMapSource.sharegoogle) {
                    this.addCanvasGoogle(opts);
            } else if (opts.source === EMapSource.srcagonline) {
                  console.log(`addCanvas with arcgis, source: ${opts.source}`);
                  const ipos = opts.mapLocOpts.center;
                  const zm = opts.mapLocOpts.zoom;
                  const cntr: IPosition = new PositionService(ipos.lng, ipos.lat, zm);
                  const mlcfg = new MLConfig({mapId: -1, mapType: 'arcgis', webmapId: opts.webmapId,
                    mlposition: cntr, source: EMapSource.srcagonline, bounds: opts.mlBounds});

                  this.addCanvasArcGIS(opts, mlcfg, opts.webmapId);
            }
        }
    }

    async addCanvasGoogle(opts: IMapShare) {
      let ipos: IPosition = null,
      mlConfig: MLConfig;
      const currIndex: number = this.mapInstanceService.getNextSlideNumber();
      const cfg = this.mapInstanceService.getRecentConfig(); // is this  the first map opened on startup
      if (cfg === null) {
          if (opts.source === EMapSource.urlgoogle) { // someone sent us a url in email or message
              console.log('get maploc from maploc argument in url');
              console.log(opts.mapLocOpts);

              console.log(`mapLocOpts: lng: ${opts.mapLocOpts.center.lng}, lat: ${opts.mapLocOpts.center.lat}`);
              ipos = new PositionService(opts.mapLocOpts.center.lng, opts.mapLocOpts.center.lat, opts.mapLocOpts.zoom);
              console.log('ipos');
              console.log(ipos);
              console.log(opts.mapLocOpts);
              const urlquery = this.hostConfig.getQuery(); // was read from location.search on app initialization
              console.log(`urlquery is ${urlquery}`);
              // alert (urlquery);
              if (urlquery && urlquery !== '') {
                  if (! this.mapInstanceService.getHiddenMap() ) {
                      const startupQuery = this.hostConfig.assembleStartupQuery();
                      const mapLocOpts = startupQuery.mapLocOpts;
                      ipos = {lon: mapLocOpts.center.lng, lat: mapLocOpts.center.lat,
                          zoom: mapLocOpts.zoom} as IPosition;
                  }
              }
          } else {
              // This should have happened on the first map instance in canvasService ctor
              console.log('get maploc from initial location from gps');
              await this.canvasService.awaitInitialLocation();
              opts.mapLocOpts = this.canvasService.getInitialLocation();
              console.log(opts.mapLocOpts);
              ipos = {lon: opts.mapLocOpts.center.lng, lat: opts.mapLocOpts.center.lat,
                  zoom: opts.mapLocOpts.zoom} as IPosition;
          }
          const cfgparams = {mapId: this.outerMapNumber, mapType: 'google',
              webmapId: null, mlposition: ipos, source: opts.source, bounds: opts.mlBounds} as IConfigParams;
          console.log(cfgparams);
          mlConfig = new MLConfig(cfgparams);
        } else { // this is'nt the first map oened in this session
            if (! this.mapInstanceService.getHiddenMap() ) {
                this.mapOpener.openMap.emit(null);
            }
            if (opts.source === EMapSource.placesgoogle || opts.source === EMapSource.sharegoogle) {
                ipos = {lon: opts.mapLocOpts.center.lng, lat: opts.mapLocOpts.center.lat,
                        zoom: opts.mapLocOpts.zoom} as IPosition;
            } else {
                console.log('create maploc at initial position');
                const initialMaploc = this.canvasService.getInitialLocation();
                opts.mapLocOpts = initialMaploc;
                ipos = {lon: initialMaploc.center.lng, lat: initialMaploc.center.lat,
                    zoom: initialMaploc.zoom} as IPosition;
            }

            const cfgparams = {mapId: this.outerMapNumber, mapType: 'google',
                webmapId: null, mlposition: ipos, source: opts.source, bounds: cfg.getBounds()} as IConfigParams;
            console.log(cfgparams);
            mlConfig = new MLConfig(cfgparams);
        }

      mlConfig.setUserName(this.pusherConfig.getUserName());
      console.log('setInitialPlaces with places:');
      console.log(opts.mapLocOpts.places);
      mlConfig.setInitialPlaces(opts.mapLocOpts.places);
      console.log(`setQuery with ${opts.mapLocOpts.query}`);
      mlConfig.setQuery(opts.mapLocOpts.query);
      if (opts.source === EMapSource.urlgoogle) {
          mlConfig.setSearch(this.hostConfig.getSearch());
          mlConfig.setQuery(this.hostConfig.getQuery());
      }

      if (currIndex === 0) {
          this.mapInstanceService.setConfigInstanceForMap(0, mlConfig);
      } else {
          if (opts.source === EMapSource.sharegoogle || opts.source === EMapSource.placesgoogle) {
              console.log('get config from shared config');
              this.mapInstanceService.setConfigInstanceForMap(currIndex, mlConfig);
          } else {
              console.log('get config from map in previous slide');
              mlConfig.setConfigParams(this.mapInstanceService.getRecentConfig().getConfigParams());
              // mlConfig.setConfigParams(this.mapInstanceService.getConfigInstanceForMap(
              //     currIndex - 1).getConfigParams());
              mlConfig.setSource(opts.source);
              this.mapInstanceService.setConfigInstanceForMap(currIndex, mlConfig);
          }
      }
      const mapTypeToCreate = this.mapHosterDict.get('google');

      this.canvasService.addCanvas(
        'google', mapTypeToCreate, opts.source, this.entry, mlConfig, opts.mapLocOpts);
    }

    async addCanvasArcGIS(opts: IMapShare, mlcfg: MLConfig, ago: string) {
        console.log('in map.component.addCanvasArcGIS');
        const currIndex: number = this.mapInstanceService.getNextSlideNumber(),
            userName = this.pusherConfig.getUserName();
        let mlConfig: MLConfig = mlcfg;
        if (mlcfg) {
            mlConfig = mlcfg;
            mlConfig.setMapId(currIndex);
            mlConfig.setUserName(userName);
            // mlConfig.setHardInitialized(true);
            mlConfig.setInitialPlaces(opts.mapLocOpts.places);
            mlConfig.setQuery(opts.mapLocOpts.query);
            if ( opts.source === EMapSource.srcagonline) {
                mlConfig.setSearch(this.hostConfig.getSearch());
                mlConfig.setQuery(this.hostConfig.getQuery());
            }
            this.mapInstanceService.setConfigInstanceForMap(currIndex, mlConfig);
        }

        const mapTypeToCreate = this.mapHosterDict.get('arcgis');
        this.canvasService.addCanvas('arcgis', mapTypeToCreate,
        opts.source, this.entry, mlConfig, opts.mapLocOpts); // mlcfg, resolve); //appendNewCanvasToContainer(mapTypeToCreate, currIndex);

    }
    async addCanvas(mapType: string, opts: IMapShare, mlcfg: MLConfig, ago: string) {
        console.log('in map.component.addCanvas');
        const currIndex: number = this.mapInstanceService.getNextSlideNumber(),
            agoId: string = ago,
            userName = this.pusherConfig.getUserName();
        let ipos: IPosition = null,
            mlConfig: MLConfig = null;
        console.log(`addCanvas set userName to ${userName}`);
        if (mlcfg) {
            mlConfig = mlcfg;
            mlConfig.setMapId(currIndex);
            mlConfig.setUserName(userName);
            // mlConfig.setHardInitialized(true);
            mlConfig.setInitialPlaces(opts.mapLocOpts.places);
            this.mapInstanceService.setConfigInstanceForMap(currIndex, mlConfig);
        } else {
            const cfg = this.mapInstanceService.getRecentConfig();
            if (cfg === null) {
            // if (this.mapInstanceService.hasConfigInstanceForMap(currIndex) ==== false) {
                // starting up from url with or without query or mobile app startup
                if (opts.mapLocOpts) {
                    console.log('get maploc from maploc argument in url');
                    console.log(opts.mapLocOpts);

                    console.log(`mapLocOpts: lng: ${opts.mapLocOpts.center.lng}, lat: ${opts.mapLocOpts.center.lat}`);
                    ipos = new PositionService(opts.mapLocOpts.center.lng, opts.mapLocOpts.center.lat, opts.mapLocOpts.zoom);
                    console.log('ipos');
                    console.log(ipos);
                    console.log(opts.mapLocOpts);
                } else {
                    // This should have happend on the first map instance in canvasService ctor
                    console.log('get maploc from initial location');
                    await this.canvasService.awaitInitialLocation();
                    opts.mapLocOpts = this.canvasService.getInitialLocation();
                    console.log(opts.mapLocOpts);
                    ipos = {lon: opts.mapLocOpts.center.lng, lat: opts.mapLocOpts.center.lat,
                    zoom: opts.mapLocOpts.zoom} as IPosition;
                }
              } else {
                // there is already at least one map open in the slide viewer
                if (opts.source !== EMapSource.sharegoogle) {
                    const gmquery = this.hostConfig.getQuery();
                    console.log(`gmquery is ${gmquery}`);
                    // alert (gmquery);
                    if (gmquery && gmquery !== '') {
                        if (! this.mapInstanceService.getHiddenMap() ) {
                            const startupQuery = this.hostConfig.assembleStartupQuery();
                            const mapLocOpts = startupQuery.mapLocOpts;
                            ipos = {lon: mapLocOpts.center.lng, lat: mapLocOpts.center.lat,
                                zoom: mapLocOpts.zoom} as IPosition;
                        }
                      } else {
                        if (opts.source === EMapSource.placesgoogle) {
                          ipos = {lon: opts.mapLocOpts.center.lng, lat: opts.mapLocOpts.center.lat,
                                    zoom: opts.mapLocOpts.zoom} as IPosition;
                        } else {
                          console.log('create maploc at initial position');
                          const initialMaploc = this.canvasService.getInitialLocation();
                          opts.mapLocOpts = initialMaploc;
                          ipos = {lon: initialMaploc.center.lng, lat: initialMaploc.center.lat,
                            zoom: initialMaploc.zoom} as IPosition;
                        }
                    }
                }
              }

            const cfgparams = {mapId: this.outerMapNumber, mapType,
                webmapId: agoId, mlposition: ipos, source: opts.source, bounds: cfg ? cfg.getBounds() : null} as IConfigParams;
            console.log(cfgparams);
            mlConfig = new MLConfig(cfgparams);
            mlConfig.setUserName(userName);
            // mlConfig.setBounds(opts.mlBounds);

            console.log('created new MLConfig with cfgparams:');
            console.log(cfgparams);
            mlConfig.setHardInitialized(true);
            console.log('setInitialPlaces with places:');
            console.log(opts.mapLocOpts.places);
            mlConfig.setInitialPlaces(opts.mapLocOpts.places);
            console.log(`setQuery with ${opts.mapLocOpts.query}`);
            mlConfig.setQuery(opts.mapLocOpts.query);
            if ( opts.source === EMapSource.urlgoogle || opts.source === EMapSource.srcagonline) {
                mlConfig.setSearch(this.hostConfig.getSearch());
                mlConfig.setQuery(this.hostConfig.getQuery());
            }
            // newpos = new MLPosition(-1, -1, -1);
            // icfg = <IConfigParams>{mapId: -1, mapType: 'unknown', webmapId: '', mlposition: newpos}
            // mlConfig = new MLConfig(icfg);
            console.log(`addCanvas with index ${currIndex} using mlConfig:`);
            console.log(mlConfig);
            if (currIndex === 0) {
                this.mapInstanceService.setConfigInstanceForMap(0, mlConfig);
            } else {
                if (opts.source === EMapSource.sharegoogle || opts.source === EMapSource.srcagonline ||
                  opts.source === EMapSource.placesgoogle) {
                    console.log('get config from shared config');
                    this.mapInstanceService.setConfigInstanceForMap(currIndex, mlConfig);
                } else {
                    console.log('get config from map in previous slide');
                    mlConfig.setConfigParams(this.mapInstanceService.getRecentConfig().getConfigParams());
                    // mlConfig.setConfigParams(this.mapInstanceService.getConfigInstanceForMap(
                    //     currIndex - 1).getConfigParams());
                    mlConfig.setSource(opts.source);
                    this.mapInstanceService.setConfigInstanceForMap(currIndex, mlConfig);
                }
            }

        }
        const mapTypeToCreate = this.mapHosterDict.get(mapType);

        const appendedElem = this.canvasService.addCanvas(mapType, mapTypeToCreate, opts.source,
          this.entry, mlConfig, opts.mapLocOpts); // mlcfg, resolve); //appendNewCanvasToContainer(mapTypeToCreate, currIndex);

    }

    removeCanvas(clickedItem) {
      console.log('removeCanvas');
      console.log(clickedItem);
      // MapInstanceService.removeInstance(CarouselCtrl.getCurrentSlideNumber());
      this.slideshareService.slideRemove.emit();
    }
  }
