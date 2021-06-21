import { EventEmitter, ElementRef} from '@angular/core';
import { MLConfig } from './MLConfig';
import { ConfigparamsService, EMapSource } from '../services/configparams.service';
import { PusherConfig } from './PusherConfig';
// import { PusherClientService } from '../../../services/pusherclient.service';
// import { utils } from './utils';
import { Startup } from './Startup';
import { MapHosterArcGIS } from './MapHosterArcGIS';
import { Utils } from './utils';
import { MLInjector } from '../libs/MLInjector';
import { MapinstanceService } from '../services/mapinstance.service';
import { PusherclientService } from '../services/pusherclient.service';
import { CurrentmaptypeService } from '../services/currentmaptype.service';
import { MlboundsService } from '../services/mlbounds.service';

import { SpatialReference } from '@arcgis/core/geometry';
import Point from '@arcgis/core/geometry/Point';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import GeometryService from '@arcgis/core/tasks/GeometryService';
import Config from '@arcgis/core/config';
import TileInfo from '@arcgis/core/layers/support/TileInfo';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import Locator from '@arcgis/core/tasks/Locator';
import * as watchUtils from '@arcgis/core/core/watchUtils';
import SimpleMarkerSymbol from '@arcgis/core/symbols/MarkerSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import Graphic from '@arcgis/core/Graphic';

interface ConfigOptions {
    // webmap: '4b99c1fb712d4fe694805717df5fadf2', // selectedWebMapId,
    webmap: string;
    title: string;
    subtitle: string;
    // arcgis.com sharing url is used modify this if yours is different
    sharingurl: string;
    // enter the bing maps key for your organization if you want to display bing maps
    bingMapsKey: string;
  }

// @Injectable()
export class StartupArcGIS  extends Startup {
    // private hostName: string = 'MapHosterArcGIS';
    private aMap: any = null;
    private webMap: WebMap;
    private configOptions: ConfigOptions;
    private aView: any = null;
    private mapHoster: MapHosterArcGIS = null;
    // private newSelectedWebMapId: string = '';
    // private pusherChannel: string = '';
    selectedWebMapId = 'f52bc3aee47749c380ddb0cd89337349'; // Requires a space after map ID
    previousSelectedWebMapId = this.selectedWebMapId;

    // private newSelectedWebMapId: string = '';
    private pusher: any = null;
    private pusherChannel = null;
    private channel = null;
    private mapHosterSetupCallback: any = null;
    private esriLocator;
    private esriConfig : Config;
    private esriGeometryService;
    private esriwebmap;
    private esrimapview;
    private esriPoint;
    private viewCreated; // : EventEmitter;
    private pointWebMap = [null, null];
    private zoomWebMap = null;
    private mapView: any = null;
    private mlconfig: MLConfig;
    private elementRef: ElementRef;
    private mapOptions: any;
    private mapNumber: number;
    private utils: any;
    private pusherConfig: PusherConfig;

    async loadEsriModules() {

      this.esriLocator = Locator;
      this.esriConfig = Config;
      this.esriGeometryService = GeometryService;
      this.esriwebmap = WebMap;
      this.esrimapview = MapView;
      this.esriPoint = Point;
    }

    // constructor(private esriwebmap: WebMap, private esrimapview: MapView,
    //   private esriConfig: Config, private esriGeometryService: GeometryService, private esriPoint: Point
    constructor() {
        super();
        const mapInstanceService = MLInjector.injector.get(MapinstanceService);
        this.pusherConfig = MLInjector.injector.get(PusherConfig);
        // @Output()
        this.viewCreated = new EventEmitter();
        this.loadEsriModules();
          /*
        loadModules(
        ['dojo/_base/event','esri/tasks/Locator', 'dojo/_base/fx', 'dojo/fx/easing', 'esri/config',
            'esri/tasks/GeometryService', 'esri/WebMap', 'esri/views/MapView', 'esri/geometry/Point', 'esri/geometry/SpatialReference'])
          .then(([ esriLocator, esriConfig,
              GeometrySvc, WebMap, MapView, Point, SpatialReference]:
            [__esri.LocatorConstructor, __esri.config,
             __esri.geometry, __esri.WebMapConstructor, __esri.MapViewConstructor, le
             __esri.PointConstructor, __esri.SpatialReferenceConstructor]) => {

              this.esriLocator = esriLocator;
              this.esriConfig = esriConfig;
              this.GeometryService = GeometrySvc;
              this.esriwebmap = WebMap;
              this.esrimapview = MapView;
              this.esriPoint = Point;
              this.esriSpatialReference = SpatialReference;
          });
          */

        this.mapNumber = mapInstanceService.getNextSlideNumber();
        this.mlconfig = mapInstanceService.getConfigForMap(this.mapNumber);
        if (!this.mlconfig) {
            this.mapNumber = this.mapNumber - 1;
            this.mlconfig = mapInstanceService.getConfigInstanceForMap(this.mapNumber);
        }
        this.mlconfig.setUserId(this.pusherConfig.getUserName() + this.mapNumber);
    }

  configure(newMapId: number, mapLocOpts, elementRef: ElementRef) {

    this.elementRef = elementRef;
    this.mapOptions = mapLocOpts;
    // this.newSelectedWebMapId = newMapId;
    this.mlconfig.setMapId(newMapId);
    // this.mlconfig.setWebmapId('f52bc3aee47749c380ddb0cd89337349');
    this.initializePreProc();
    console.log('Finished configure/initialize sequence');
  }

  showLoading() {
      this.utils.showLoading();
      this.aMap.disableMapNavigation();
      this.aMap.hideZoomSlider();
  }

  hideLoading(error) {
      this.utils.hideLoading(error);
      this.aMap.enableMapNavigation();
      this.aMap.showZoomSlider();
  }
  placeCustomControls() {
      const inj = MLInjector.injector,
          ctrlSvc = inj.get('MapControllerService'),
          mapCtrl = ctrlSvc.getController();
          // mapCtrl = MapControllerService.getController();
      mapCtrl.placeCustomControls();
  }

  setupQueryListener() {
      const inj = MLInjector.injector,
          ctrlSvc = inj.get('MapControllerService'),
          mapCtrl = ctrlSvc.getController();
      // var mapCtrl = MapControllerService.getController();
      mapCtrl.setupQueryListener();
  }
  getMap() {
      return this.aMap;
  }

  getMapNumber() {
      return this.mapNumber;
  }
  getMapHosterInstance(ndx) {
      return this.mapHoster;
  }

  async initUI() {
    // add scalebar or other components like a legend, overview map etc
      // dojo.parser.parse();
      console.log(this.aMap);
      const
          curmph = null;

      /* Scalebar refuses to appear on map.  It appears outside the map on a bordering control.
      var scalebar = new esri.dijit.Scalebar({
          map: aMap,
          scalebarUnit:'english',
          attachTo: 'top-left'
      });
       */

      console.log('start MapHoster with center ' + this.pointWebMap[0] + ', ' + this.pointWebMap[1] + ' zoom ' + this.zoomWebMap);
      console.log('this.mapHoster: ' + this.mapHoster);
      if (this.mapHoster === null) {
          console.log('this.mapHoster is null');
          // alert('StartupArcGIS.initUI: thisDetails.mph == null');
          // placeCustomControls();
          this.mapHoster = new MapHosterArcGIS(this.aMap, this.mapNumber, this.mlconfig, this.elementRef);

          MLInjector.injector.get(MapinstanceService).setMapHosterInstance(this.mapNumber, this.mapHoster);
          this.mlconfig.setMapHosterInstance(this.mapHoster);
          MLInjector.injector.get(CurrentmaptypeService).setCurrentMapType('arcgis');
          await this.mapHoster.configureMap(this.aMap, this.zoomWebMap, this.pointWebMap, this.mlconfig);
          // this.placeCustomControls();
          // this.setupQueryListener();
          // mph = new MapHosterArcGIS(window.map, zoomWebMap, pointWebMap);
          console.log('StartupArcGIS.initUI: thisDetails.mph as initially null and should now be set');
          // console.debug(MapHosterArcGIS);
          // console.debug(pusherChannel);
          // curmph = this.mapHoster;

          // $inj = this.mlconfig.getInjector();
          // console.log('$inj');
          // console.debug($inj);
          // mapTypeSvc = $inj.get('CurrentMapTypeService');
          // curmph = mapTypeSvc.getSelectedMapType();
          // console.log('selected map type is ' + curmph);

          this.pusher = MLInjector.injector.get(PusherclientService).createPusherClient(
              this.mlconfig,
              {destination: 'destPlaceHolder', currentMapHolder: this.mapHoster, newWindowId: 'windowIdPlaceholder'}
          );
          if (!this.pusher) {
              console.log('failed to create Pusher in StartupArcGIS');
          }

      } else {
          console.log('this.mapHoster is something or other');
          MLInjector.injector.get(MapinstanceService).setMapHosterInstance(this.mapNumber, this.mapHoster);
          this.mlconfig.setMapHosterInstance(this.mapHoster);
          // $inj = this.mlconfig.getInjector();
          // mapTypeSvc = $inj.get('CurrentMapTypeService');
          // curmph = mapTypeSvc.getSelectedMapType();
          // console.log('selected map type is ' + curmph);
          // this.mlconfig.setZoom(this.zoomWebMap);
          this.zoomWebMap = 15;
          await this.mapHoster.configureMap(this.aMap, this.zoomWebMap, this.pointWebMap, this.mlconfig);
          this.pusherChannel = this.pusherConfig.masherChannel(false);
          this.pusher = MLInjector.injector.get(PusherclientService).createPusherClient(
              this.mlconfig,
              {destination: 'destPlaceHolder', currentMapHolder: curmph, newWindowId: 'windowIdPlaceholder'}
          );
          const currentPusher = this.pusher;
          const currentChannel = this.channel;
          // await this.mapHoster.configureMap(this.aMap, this.zoomWebMap, this.pointWebMap, this.mlconfig);

          // mph = new MapHosterArcGIS(window.map, zoomWebMap, pointWebMap);
          console.log('use current pusher - now setPusherClient');
          this.mapHoster.setPusherClient(currentPusher, currentChannel);
          await this.mapHoster.configureMap(this.aMap, this.zoomWebMap, this.pointWebMap, this.mlconfig);
          // this.placeCustomControls();  // MOVED TEMPORARILY on 3/15
          // this.setupQueryListener();
      }
  }

  async initializePostProc(idAgoItem) {
      console.log('StartupArcGIS initializePostProc with map no. ' + this.mapNumber);
      console.log('configOptions.webmap will be ' + this.selectedWebMapId);

      try {
        this.webMap = new WebMap({
          portalItem: { // autocasts as new PortalItem()
            // id: '4c3ccb95474c4c4d89ec191d69ba1080'
            id: this.mlconfig.getWebmapId(false)
          }
          // basemap: 'streets'
        });
      } catch(err) {
        console.log(err);
      }
      this.webMap.when((w: any) => {
        console.log('We mighthave a webmap here');
        console.log(w);
      },
      (msg: string) => {
        console.log('WebMap failed');
        console.log(msg);
      });

      console.log(`Hopefully created new esriWebMap with id ${this.mlconfig.getWebmapId(false)}`);
      this.selectedWebMapId = this.mlconfig.getWebmapId(false);
      this.webMap.load()
        .then(() =>{
          return this.webMap.basemap.load();
        });

      // if (idAgoItem) {
      //     this.configOptions.webmap = this.webMap.portalItem = idAgoItem;
      // }

      console.log('StartupArcGIS ready to instantiate Map Hoster with map no. ' + this.mapNumber);
      // this.esriConfig.request.proxyUrl = '/arcgisserver/apis/javascript/proxy/proxy.ashx';
      // console.log('call for new WebMap with webmap id ' + this.configOptions.webmap);

      // try {
      const mapView = new MapView({
        container: this.elementRef as unknown as HTMLDivElement, // 'viewDiv'+this.mapNumber, // this.elementRef,
        map: this.webMap, // this.mapService.map,,
        // constraints: {
        //   lods: TileInfo.create().lods
        // },
        // center: this.webMap.portalItem.extent.center,
        // extent: this.webMap.portalItem.extent,
      });
      this.mapView = mapView;
      mapView.when(() => {
          console.log('mapView.when');
          // console.log(instance);
          if (this.previousSelectedWebMapId !== this.selectedWebMapId) {
              this.previousSelectedWebMapId = this.selectedWebMapId;
              // dojo.destroy(map.container);
          }
          // if (aMap) {
          //     aMap.destroy();
          // }
          // this.aMap = aMap = webMap;
          this.aMap = this.mapView;
          this.mapHoster = new MapHosterArcGIS(this.mapView, this.mapNumber, this.mlconfig, this.elementRef);
          this.mlconfig.setMapHosterInstance(this.mapHoster);
          MLInjector.injector.get(MapinstanceService).setMapHosterInstance(this.mapNumber, this.mapHoster);
          this.initUI();
          // this.mapHosterSetupCallback(this.mapHoster, this.aMap);
      // },
        // (error: any) => {
        //   console.log(`The webmap failed to load: ${this.configOptions.webmap}`);
        //   console.log(error);
      });
      this.viewCreated.next(this.mapView);

  }

  prepareWindow(idAgoItem, referringMph, displayDestination) {

      const curmph = this.mapHoster;
      let baseUrl = '';

      const openNewDisplay = function(channel: string, userName: string) {
          let url = '?id=' + idAgoItem + this.mapHoster.getGlobalsForUrl() +
              '&channel=' + channel + '&userName=' + userName +
              '&maphost=ArcGIS' + '&referrerId=' + this.mlconfig.getUserId();
          if (referringMph) {
              url = '?id=' + idAgoItem + referringMph.getGlobalsForUrl() +
                  '&channel=' + channel + '&userName=' + userName +
                  '&maphost=ArcGIS' + '&referrerId=' + this.mlconfig.getUserId();
          }

          console.log('open new ArcGIS window with URI ' + url);
          console.log('using channel ' + channel + 'with userName ' + userName);
          this.mlconfig.setUrl(url);
          this.pusherConfig.setUserName(userName);
          this.mlconfig.setUserId(userName + this.mapNumber);
          if (displayDestination === 'New Pop-up Window') {
              baseUrl = this.mlconfig.getbaseurl();
              window.open(baseUrl + '/arcgis/' + url, idAgoItem, this.mlconfig.getSmallFormDimensions());
          } else {
              baseUrl = this.mlconfig.getbaseurl();
              window.open(baseUrl + 'arcgis/' + url, '_blank');
              window.focus();
          }
      };

      if (this.pusherConfig.isNameChannelAccepted() === false) {
          MLInjector.injector.get(PusherclientService).setupPusherClient(openNewDisplay,
                  {destination: displayDestination, currentMapHolder: curmph, newWindowId: idAgoItem});
      } else {
          openNewDisplay(this.pusherConfig.masherChannel(false),
              this.pusherConfig.getUserName());
      }
  }

  initialize(idAgoItem, destDetails, selectedMapTitle, referringMph) {
      const displayDestination = destDetails.dstSel;
      //     $inj,
      // CurrentMapTypeService;
      /*
      This branch should only be encountered after a DestinationSelectorEvent in the AGO group/map search process.
      The user desires to open a new popup or tab related to the current map view, without yet publishing the new map environment.
       */
      if (displayDestination === 'New Pop-up Window') {
          this.prepareWindow(idAgoItem, referringMph, displayDestination);
      } else if (displayDestination === 'New Tab') {
          this.prepareWindow(idAgoItem, referringMph, displayDestination);
      } else {
          /*
          This branch handles a new ArcGIS Online webmap presentation from either selecting the ArcGIS tab in the master
          site or opening the webmap from a url sent through a publish event.
           */

          this.initializePostProc(idAgoItem);

          // $inj = this.mlconfig.getInjector();
          // CurrentMapTypeService = $inj.get('CurrentMapTypeService');
          // CurrentMapTypeService.setCurrentMapType('arcgis');
      }
  }

  initializePreProc() {

      console.log('initializePreProc entered');
      // var urlparams=dojo.queryToObject(window.location.search);
      // console.debug(urlparams);
      // var idWebMap=urlparams['?id'];
      const idAgoItem = this.mlconfig.getWebmapId(true);

      console.log(idAgoItem);
      // initUI();
      if (!idAgoItem || idAgoItem === '') {
          console.log('no idAgoItem');
          // selectedWebMapId = 'a4bb8a91ecfb4131aa544eddfbc2f1d0 '; //'e68ab88371e145198215a792c2d3c794';
          this.selectedWebMapId = 'f52bc3aee47749c380ddb0cd89337349'; // 'f2e9b762544945f390ca4ac3671cfa72'/
          this.mlconfig.setWebmapId(this.selectedWebMapId);
          console.log('use ' + this.selectedWebMapId);
          // pointWebMap = [-87.7, lat=41.8];  [-89.381388, 43.07493];
          this.pointWebMap = [-87.620692, 41.888941];
          this.zoomWebMap = 15;
          // initialize(selectedWebMapId, '', '');   original from mlhybrid requires space after comma
          this.initialize(this.selectedWebMapId, {dstSel: 'no destination selection probably Same Window'},
              'Name Placeholder', null);
      } else {
          console.log('found idAgoItem');
          console.log('use ' + idAgoItem);
          if (this.mlconfig.getConfigParams().source === EMapSource.urlagonline) {
              this.zoomWebMap = this.mlconfig.zoom();
              const llon = this.mlconfig.lon();
              const llat = this.mlconfig.lat();
              this.pointWebMap = [llon, llat];
          } else if (this.mlconfig.getConfigParams().source === EMapSource.srcagonline) {
              this.zoomWebMap = this.mlconfig.getPosition().zoom;
              const llon = this.mlconfig.getPosition().lon;
              const llat = this.mlconfig.getPosition().lat;
              this.pointWebMap = [llon, llat];
          }
          this.initialize(idAgoItem, {dstSel: 'no destination selection probably Same Window'},
              'Name Placeholder', null);
      }
  }
}
