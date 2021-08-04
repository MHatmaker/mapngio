import { OnInit, ElementRef} from '@angular/core';
import { MLConfig } from './MLConfig';
import { PusherConfig } from './PusherConfig';
import { PusherclientService } from '../services/pusherclient.service';
import { MapinstanceService } from '../services/mapinstance.service';
import { MapopenerService } from '../services/mapopener.service';
import { Utils, ILonLatStrings } from './utils';
// import { ConfigParams } from '../../../services/configparams.service';
// import { GeoCoder } from './GeoCoder';
// import { IPositionParams, IPositionData } from '../../../services/positionupdate.interface';
import { PositionupdateService } from '../services/positionupdate.service';
import { PusherEventHandler } from './PusherEventHandler';
import _esri = __esri;
// import * as esri from 'arcgis-js-api';
// import { Point } from 'esri/geometry/Point';
// import { ImlBounds } from '../../../services/mlbounds.service'
// import { SpatialReference } from 'esri/geometry';
// import { Point } from 'esri/geometry';
// import * as proj4x from 'proj4';
// import { toScreenGeometry } from 'esri/geometry/screenUtils';
// import { webMercatorToGeographic, xyToLngLat, lngLatToXY } from 'esri/geometry/support/webMercatorUtils';
// import * as Locator from 'esri/tasks/Locator';
import { MapHoster } from './MapHoster';
import { ImlBounds, MlboundsService, XtntParams, Xtnt } from '../services/mlbounds.service';
import { DomService } from '../services/dom.service';
import { ReflectiveInjector } from '@angular/core';
import { MapLocOptions } from '../services/positionupdate.interface';
import { MLInjector } from '../libs/MLInjector';

import * as webMercatorUtils from '@arcgis/core/geometry/support/webMercatorUtils';
import { SpatialReference } from '@arcgis/core/geometry';
import Point from '@arcgis/core/geometry/Point';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import ActionButton from '@arcgis/core/support/actions/ActionButton';
import Locator from '@arcgis/core/tasks/Locator';
import * as watchUtils from '@arcgis/core/core/watchUtils';
import SimpleMarkerSymbol from '@arcgis/core/symbols/MarkerSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import Graphic from '@arcgis/core/Graphic';
import { locationToAddress } from '@arcgis/core/rest/locator';
import config from '@arcgis/core/config';
// import { locationToAddress } from '@arcgis/core/tasks/Locator');
//
// const proj4 = (proj4x as any).default;

export class MapHosterArcGIS extends MapHoster {
    hostName = 'MapHosterArcGIS';
    scale2Level = [];
    zmG = 15;
    userZoom = true;
    // this.mphmapCenter;
    cntrxG = null;
    cntryG = null;
    bounds = new MlboundsService();
    minZoom = null;
    maxZoom = null;
    zoomLevels = null;
    mapReady = true;
    popup = null;
    marker = null;
    markers = [];
    popups = [];
    mrkr = null;
    CustomControl = null;
    queryListenerLoaded = false;

    selectedMarkerId = 101;
    initialActionListHtml = '';
    geoLocator: _esri.Locator;
    screenPt = null;
    // btnShare;
    selfPusherDetails = {
        channel: null,
        pusher: null
    };
    mlconfig: MLConfig;
    pusherEventHandler: PusherEventHandler;
    pusherConfig: PusherConfig;
    utils: any;

    constructor(private mphmap: MapView,
                private mapNumber: number,
                mlconfig: MLConfig,
                private elementRef: ElementRef) {
        super();
        this.mlconfig = mlconfig;
        const pos = this.mlconfig.getPosition();
        this.cntrxG = pos.lon;
        this.cntryG = pos.lat;
        this.zmG = pos.zoom;
        this.utils = MLInjector.injector.get(Utils);
        this.mphmap.popup.autoOpenEnabled = false;
            // let mpopn = MLInjector.injector.get(MapopenerProvider);
            // mpopn.addHiddenCanvas.emit();
            // this.updateGlobals('adding hidden canvas updateGlobals', pos.lon, pos.lat, pos.zoom);
    }

    getMap() {
        return this.mphmap;
    }

    getMapNumber() {
        return this.mapNumber;
    }
    //     getMapHosterInstance(ndx) {
    //     return this.mphmap;
    // }

    async updateGlobals(msg: string, cntrx: string, cntry: string, zm: number) {
        console.log('updateGlobals ');
        this.zmG = zm;
        this.cntrxG = cntrx;
        this.cntryG = cntry;
        if (this.mphmap !== null && this.mphmap.extent !== null) {
            const ll = webMercatorUtils.xyToLngLat(this.mphmap.extent.xmin, this.mphmap.extent.ymin);
            const ur = webMercatorUtils.xyToLngLat(this.mphmap.extent.xmax, this.mphmap.extent.ymax);
            this.bounds = new MlboundsService(ll[0], ll[1], ur[0], ur[1]);
            // this.bounds = this.mphmap.extent;
            this.mlconfig.setBounds(this.bounds);
            // this.mlconfig.setBounds({'llx': this.bounds.xmin, 'lly': this.bounds.ymin,
            // 'urx': this.bounds.xmax, 'ury': this.bounds.ymax});
        }
        console.log('Updated Globals ' + msg + ' ' + this.cntrxG + ', ' + this.cntryG + ': ' + this.zmG);
        MLInjector.injector.get(PositionupdateService).positionData.emit(
            {key: 'zm',
              val: {
                zm: this.zmG,
                scl: this.scale2Level.length > 0 ? this.scale2Level[this.zmG].scale : this.scale2Level[3],
                cntrlng: this.cntrxG,
                cntrlat: this.cntryG,
                evlng: this.cntrxG,
                evlat: this.cntryG
          }
        });
        this.mlconfig.setPosition({lon: this.cntrxG, lat: this.cntryG, zoom: this.zmG});
    }

    showGlobals(cntxt: string) {
        console.log(cntxt + ' Globals: lon ' + this.cntrxG + ' lat ' + this.cntryG + ' zoom ' + this.zmG);
    }

    initMap() {
        /*jslint nomen: true */  // for dangling _
        // var tileInfo = this.mphmap.__tileInfo,
        //     lods = tileInfo.lods,
        let lods: any[] = [], // this.mphmap.lods,
            sc2lv: any[];
        lods = this.mphmap.constraints.effectiveLODs;
        if (lods) {
          this.zoomLevels = lods.length;
          this.scale2Level = [];
          sc2lv = this.scale2Level;
          for ( const item of lods) {
              const obj = {scale: item.scale, resolution: item.resolution, level: item.level};
              sc2lv.push(obj);
              // console.log('scale ' + obj.scale + ' level ' + obj.level + ' resolution ' + obj.resolution);
          }
        }
        console.log('zoom levels: ' + this.zoomLevels);
    }

    async extractBounds(zm: number, cntr: any, whichaction: string): Promise<XtntParams> {
        // const source = proj4.Proj('GOOGLE'),
        //     dest = proj4.Proj('WGS84'),
        //     p = proj4.toPoint([cntr.longitude, cntr.latitude]);
/*
        console.log('proj4.transform ' + p.x + ', ' + p.y);
        try {
            proj4.transform(source, dest, p);
        } catch(err) {
            alert('proj4.transform threw up');
        }
        console.log('ready to create ESRI pt with ' + p.x + ', ' + p.y);
*/
        const cntrpt = new Point({longitude: cntr.longitude, latitude: cntr.latitude,
          spatialReference: new SpatialReference({wkid: 4326})});
        // cntrpt = new Point({longitude: cntr.x, latitude: cntr.y, spatialReference: new SpatialReference({wkid: 4326})});
        console.log('cntr ' + cntr.x + ', ' + cntr.y);
        console.log('cntrpt ' + cntrpt.x + ', ' + cntrpt.y);
        // let ltln = webMercatorUtils.geographicToWebMercator(cntrpt);
        // fixedLL = this.utils.toFixedTwo(ltln.longitude, ltln.latitude, 3);
        const fixedLL: ILonLatStrings = this.utils.toFixedTwo(cntrpt.x, cntrpt.y, 9);
        return {
            src: 'arcgis',
            zoom: zm,
            lon: +fixedLL.lon,
            lat: +fixedLL.lat,
            scale: this.scale2Level[zm].scale,
            action: whichaction
        };
    }

    compareExtents(msg: string, xtnt: XtntParams) {
        let cmp = xtnt.zoom === this.zmG;
        const wdth = Math.abs(this.bounds.urx - this.bounds.llx),
            hgt = Math.abs(this.bounds.ury - this.bounds.lly),
            lonDif = Math.abs((xtnt.lon - this.cntrxG) / wdth),
            latDif =  Math.abs((xtnt.lat - this.cntryG) / hgt);
        // cmp =((cmp == true) && (xtnt.lon == this.cntrxG) && (xtnt.lat == this.cntryG));
        cmp = ((cmp === true) && (lonDif < 0.0005) && (latDif < 0.0005));
        console.log('compareExtents ' + msg + ' ' + cmp);
        return cmp;
    }

    async setBounds(xtExt: XtntParams) {
        console.log('MapHosterArcGIS setBounds with selfPusherDetails.pusher ' + this.mlconfig.getMapNumber());

        if (this.mapReady === true) { // } && selfPusherDetails.pusher) {
            // runs this code after you finishing the zoom
            console.log('MapHoster ArcGIS ' + this.mlconfig.getMapNumber() + ' setBounds ready to process json xtExt');
            const xtntJsonStr = JSON.stringify(xtExt);
            console.log('extracted bounds ' + xtntJsonStr);
            const cmp = this.compareExtents('setBounds', xtExt);
            if (cmp === false) {
                console.log('MapHoster arcGIS ' + this.mlconfig.getMapNumber() + ' setBounds pusher send ');
                //
                // if (selfPusherDetails.pusher && selfPusherDetails.channelName) {
                //     selfPusherDetails.pusher.channel(selfPusherDetails.channelName).trigger('client-MapXtntEvent', xtExt);
                // }
                MLInjector.injector.get(PusherclientService).publishPanEvent(xtExt);
                await this.updateGlobals('in setBounds with cmp false', '' + xtExt.lon, '' + xtExt.lat, xtExt.zoom);
                // letconsole.debug(sendRet);
            }
        }
    }

    setUserName(name: string) {
        MLInjector.injector.get(PusherConfig).setUserName(name);
    }
    getEventDictionary() {
        const eventDct = this.pusherEventHandler.getEventDct();
        return eventDct;
    }

    setPusherClient(pusher, channel) {
        console.log('MapHosterArcGIS setPusherClient ' +  this.pusherEventHandler.getMapNumber());
        /*
        var evtDct = this.pusherEventHandler.getEventDct(),
            key;

        console.log('Ready to subscribe MapHosterArcGIS ' + this.mlconfig.getMapNumber());
        if (selfPusherDetails.pusher === null) {
            selfPusherDetails.pusher = pusher;
            selfPusherDetails.channelName = channel;
            this.pusherConfig.setChannel(channel);

            for (key in evtDct) {
                if (evtDct.hasOwnProperty(key)) {
                    pusher.subscribe(key, evtDct[key]);
                }
            }

            // pusher.subscribe( 'client-MapXtntEvent', retrievedBounds);
            // pusher.subscribe( 'client-MapClickEvent', retrievedClick);
            // pusher.subscribe( 'client-NewMapPosition', retrievedNewPosition);
            console.log('reset MapHosterArcGIS setPusherClient, selfPusherDetails.pusher ' +  selfPusherDetails.pusher);
        }
        */
    }

    async retrievedClick(clickPt) {
      if (clickPt.referrerId !== this.mlconfig.getUserId()) {
        console.log('Back in retrievedClick');
        // var latlng = L.latLng(clickpt.lat, clickpt.lng, clickpt.lat);
        console.log('You clicked the map at ' + clickPt.lng + ', ' + clickPt.lat);
        // alert('You clicked the map at ' + clickpt.lng + ', ' + clickpt.lat);
        console.log(clickPt);
        const
              // mpDiv = document.getElementById('map' + this.mlconfig.getMapNumber()),
              // mpDivNG = angular.element(mpDiv),
              // mpDivNG = this.elementRef,
              // wdt = mpDivNG[0].clientWidth,
              // hgt = mpDivNG[0].clientHeight,
              mppt = new Point({longitude: clickPt.lng, latitude: clickPt.lat});
              // screenGeo = new toScreenGeometry(this.mphmap.extent, wdt, hgt, mppt),
              // screenGeo = this.mphmap.toScreen(mppt);

          // console.log('screenGeo');
          // console.debug(screenGeo);
          // $inj = this.mlconfig.getInjector();
          // linkrSvc = $inj.get('LinkrService');
          // linkrSvc.hideLinkr();

          //      screengraphic = new esri.geometry.toScreenGeometry(this.mphmap.extent,800,600,userdrawlayer.graphics[0].geometry);

          // if (clickPt.referrerId !== this.mlconfig.getUserId()) {
        const fixedLL: ILonLatStrings = this.utils.toFixedTwo(clickPt.lng, clickPt.lat, 9);
        let content = 'Map click at ' + fixedLL.lat + ', ' + fixedLL.lon;
        if (clickPt.title) {
          content += '<br>' + clickPt.title;
        }
        if (clickPt.address) {
          content += '<br>' + clickPt.address;
        }
        this.mphmap.popup.title = 'Received from user ' + clickPt.referrerName + ', ' + clickPt.referrerId;
        this.mphmap.popup.content = content;
        // }

        this.mphmap.popup.open({location: mppt}); // this.mphmap.getInfoWindowAnchor(screenGeo));
          // popup
              // .setLatLng(latlng)
              // .setContent('You clicked the map at ' + latlng.toString())
              // .openOn(this.mphmap);
      }
    }

    async retrievedBounds(xj: XtntParams) {
      console.log('Back in MapHosterArcGIS ' + this.mlconfig.getMapNumber() + ' retrievedBounds');
      if (xj.zoom === 0) {
          xj.zoom = this.zmG;
      }
      const zm = xj.zoom;
      // x = webMercatorUtils.lngLatToXY(xj.lon, xj.lat),
      const xtn = new Xtnt('arcgis', xj.zoom, xj.lon, xj.lat);
      const cmp = this.compareExtents('retrievedBounds', xtn.getParams());

      if (cmp === false) {
          const tmpLon = this.cntrxG;
          const tmpLat = this.cntryG;
          const tmpZm = this.zmG;

          await this.updateGlobals('in retrievedBounds with cmp false', '' + xj.lon, '' + xj.lat, xj.zoom);
          // this.userZoom = false;
          console.log('retrievedBounds centerAndZoom at zm = ' + zm);
          const cntr = new Point({longitude: xj.lon, latitude: xj.lat, spatialReference: new SpatialReference({wkid: 4326})});

          this.userZoom = false;
          if (xj.action === 'pan') {
              if (tmpZm !== zm) {
                  // this.mphmap.centerAndZoom(cntr, zm);
                  this.mphmap.goTo({target: cntr, zoom: zm});
              } else {
                  // this.mphmap.centerAt(cntr);
                  this.mphmap.goTo(cntr);
              }
          } else {
              if (tmpLon !== xj.lon || tmpLat !== xj.lat) {
                  // var tmpCenter = new GeometryPoint(tmpLon, tmpLat, new esri.SpatialReference({wkid: 4326}));
                  // this.mphmap.centerAndZoom(cntr, zm);
                  this.mphmap.goTo({target: cntr, zoom: zm});
              } else {
                  this.mphmap.zoom = zm;
              }
          }
          this.userZoom = true;
      }
    }

    async onMapClick(e: any) {
      const mapPt = e.mapPoint;
      const emapPt = new Point({latitude: mapPt.latitude, longitude: mapPt.longitude});
      this.mphmap.popup.open({location: emapPt});

      const shareAction = new ActionButton({
        title: 'Share Info',
        id: 'idShareInfo',
        className: 'share-action',
        image: 'assets/imgs/share-info.png'
      });

      if (this.mphmap.popup.actions.length < 1) {
        this.mphmap.popup.actions.push(shareAction);
      }

      const geoLocater = new Locator ({
        url: 'http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer'
      });
      config.apiKey = 'AAPK0f6edcdc643b4ca9bc1fad44f3c659ee9dUyLj5MqZdGhsgnM1i-lWgsHwOCad4_rfRLz6gYlS_qswzHXioQ5kMqHOTwc6M7';
      geoLocater.locationToAddress({location: e.mapPoint, locationType: 'street'}).then((response) => {
          // var location;
          if (response.address) {
              const address = response.address;
              const location = webMercatorUtils.lngLatToXY(response.location.longitude, response.location.latitude);
              this.showClickResult(address, e.mapPoint);
              console.log(location);
          } else {
              this.showClickResult(null, e.mapPoint);
          }
        },
        (err) => {
          console.log(err);
        });
      }

    // this.pusherEventHandler = new PusherEventHandler.PusherEventHandler(this.mlconfig.getMapNumber());
    //
    // this.pusherEventHandler.addEvent('client-MapXtntEvent', retrievedBounds);
    // this.pusherEventHandler.addEvent('client-MapClickEvent',  retrievedClick);

    async showClickResult(content: string, mapPt: any) {
      console.log('showClickResult : ' + content);
      const fixedLLG: ILonLatStrings = this.utils.toFixedTwo(mapPt.longitude , mapPt.latitude, 9);
      const pushContent = this.configForPusher(content, fixedLLG);

      this.mphmap.popup.on('trigger-action', (event) => {
        if (event.action.id === 'idShareInfo') {
          MLInjector.injector.get(PusherclientService).publishClickEvent(pushContent);
        }
      });

      if (content === null) {
          // const addedContent = 'Share lat/lon: ' + this.fixedLLG.lat + ', ' + this.fixedLLG.lon;
          this.mphmap.popup.title = 'No address at this location';
          this.mphmap.popup.content = 'lat/lon: ' + fixedLLG.lat + ', ' + fixedLLG.lon;
      } else {
          if (this.mphmap.popup.content === null) {
            const addedContent = 'Share address: ' + content;
            this.mphmap.popup.content = addedContent;
          } else {
            this.mphmap.popup.content = content;
          }
          this.mphmap.popup.watch('currentDockPosition', (value) => {
              console.log('currentDockPosition');
              console.log(value);
          });
      }

    }

    configForPusher(content: string, fixedLLG: ILonLatStrings) {
        // if (selfPusherDetails.pusher) {
        const referrerId = this.mlconfig.getUserId();
        const referrerName = MLInjector.injector.get(PusherConfig).getUserName();
        const mapId = referrerName + this.mapNumber;

        const pushLL = {
            lng: fixedLLG.lon,
            lat: fixedLLG.lat,
            zoom: this.zmG,
            referrerId,
            referrerName,
            mapId,
            address: content
        };
        console.log('You, ' + referrerName + ', ' + referrerId + ', clicked the map at ' + fixedLLG.lat + ', ' + fixedLLG.lon);
        // selfPusherDetails.pusher.channel(selfPusherDetails.channelName).trigger('client-MapClickEvent', pushLL);
        // this.pusherClientService.publishClickEvent(pushLL);
        return pushLL;
    // }
    }

    async setCurrentLocation( loc: MapLocOptions) {
      const cntr = new Point({longitude: loc.center.lng, latitude: loc.center.lat,
        spatialReference: new SpatialReference({wkid: 4326})});
      this.mphmap.goTo({target: cntr, zoom: this.zmG});
      const xtExt = await this.extractBounds(this.mphmap.zoom, cntr, 'pan');
      // xtExt.then( () => {
      this.setBounds(xtExt);
      this.addGraphic(cntr);
      // });
    }

    async addGraphic(pt) {
      const symbol = new SimpleMarkerSymbol({
        color: [226, 119, 40],
        // outline: {
        //   color: [255, 255, 255],
        //   width: 1
        // }
      });

      const graphic = new Graphic({
        geometry: pt,
        symbol
      });
      this.mphmap.graphics.add(graphic);
    }

    async configureMap(xtntMap, zoomWebMap, pointWebMap, mlcfg) {
      console.log('MapHosterArcGIS configureMap');
      this.mphmap = xtntMap;
      this.mapReady = false;
      this.mlconfig = mlcfg;
          // currentVerbVis = false;; //, location;
      // alert('before first update globals');

      this.pusherEventHandler = new PusherEventHandler(this.mlconfig.getMapNumber());

      this.pusherEventHandler.addEvent('client-MapXtntEvent', (xj: XtntParams) => this.retrievedBounds(xj));
      // this.pusherEventHandler.addEvent('client-MapXtntEvent', this.retrievedBounds);
      this.pusherEventHandler.addEvent('client-MapClickEvent', (clickPt) => this.retrievedClick(clickPt));

      if (zoomWebMap !== null) {
          await this.updateGlobals('in configureMap - init with attributes in args',
              xtntMap.extent.center.x, xtntMap.extent.center.y, this.mlconfig.getZoom()); // xtntMap.zoom);
      } else {

          const qlat = this.mlconfig.lat();
          const qlon = this.mlconfig.lon();
          const qzoom = this.mlconfig.zoom();

          if (qlat !== '') {
              await this.updateGlobals('in configureMap - MapHosterArcGIS init with qlon, qlat', qlon, qlat, +qzoom);
          } else {
              await this.updateGlobals('in configureMap - MapHosterArcGIS init with hard-coded values', '-87.620692', '41.888941', 13);
          }

          // updateGlobals('init standard', -87.7, 41.8, 13);
      }
      this.showGlobals('in configureMap - MapHosterArcGIS - Prior to new Map');
      // alert('showed first globals');
      const startCenter = new Point({longitude: this.cntrxG, latitude: this.cntryG,
        spatialReference: new SpatialReference({wkid: 4326})});

      await this.updateGlobals('in configureMap - using startCenter', '' + startCenter.x, '' + startCenter.y, this.zmG);
      this.showGlobals('Prior to startup centerAndZoom');
      // this.mphmap.centerAndZoom(startCenter, this.zmG);
      this.mphmap.goTo({target: startCenter, zoom: this.zmG});
      this.showGlobals('After centerAndZoom');
      const xtnt = new Xtnt('arcgis', this.zmG, startCenter.x, startCenter.y);
      MLInjector.injector.get(PusherclientService).publishPanEvent(xtnt.getParams());

      this.initMap();
      this.geoLocator = new Locator({url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'});
      // addInitialSymbols();
      const ll = webMercatorUtils.xyToLngLat(this.mphmap.extent.xmin, this.mphmap.extent.ymin);
      const ur = webMercatorUtils.xyToLngLat(this.mphmap.extent.xmax, this.mphmap.extent.ymax);
      this.bounds = new MlboundsService(ll[0], ll[1], ur[0], ur[1]);
      this.userZoom = true;

      this.mphmap.on('zoom-start', (evt) => {
          this.zmG = evt.level;
      });
      this.mphmap.on('zoom-end', async (evt) => {
          console.log('onZoomEnd with userZoom = ' + this.userZoom);
          if (this.userZoom === true) {
            const xtn = await this.extractBounds(this.mphmap.get('effectiveLODs'), evt.extent.getCenter(), 'zoom');
            this.setBounds(xtn);
          }
          // this.userZoom = true;
      });

      watchUtils.whenTrue(this.mphmap, 'stationary', async (evt: any) => {
        if (this.mphmap.center) {
          console.log('x' + this.mphmap.center.x +  ', y' + this.mphmap.center.y);
          await this.prepareToSetBounds();
        }
        if (this.mphmap.extent) {
          if (this.userZoom === true) {
              const bnds = await this.extractBounds(this.mphmap.zoom, this.mphmap.center, 'pan');
              this.setBounds(bnds);
          }
        }
      });
/*
      this.mphmap.on('pan-start',  (evt) => {
          // event.stop(evt);
          console.log('pan-start');
      });

      this.mphmap.on('drag', (evt) => {
        console.log('drag state', evt.action);
        if (evt.action === 'end') {
        }
      });

      this.mphmap.on('pan-end', (evt) => {
          if (this.userZoom === true) {
              this.setBounds(this.extractBounds(this.mphmap.zoom, evt.extent.getCenter(), 'pan'));
          }
      });
*/
      this.mphmap.on('pointer-move', (evt) => {
      const // pnt = new Point({longitude: evt.mapPoint.x, latitude: evt.mapPoint.y}),
          ltln = this.mphmap.toMap({x: evt.x, y: evt.y}),
          // ltln = webMercatorUtils.xyToLngLat(evt.mapPoint.x, evt.mapPoint.y),
          fixedLL = this.utils.toFixedTwo(ltln.longitude, ltln.latitude, 4),
          evlng = fixedLL.lon,
          evlat = fixedLL.lat;
      MLInjector.injector.get(PositionupdateService).positionData.emit(
          {key: 'coords',
            val: {
              zm: this.zmG,
              scl: this.scale2Level.length > 0 ? this.scale2Level[this.zmG].scale : this.scale2Level[3],
              cntrlng: evlng,
              cntrlat: evlat,
              evlng,
              evlat
            }
          });
      });

      this.mphmap.on('click', (evt: MouseEvent) => {
        this.onMapClick(evt);
      });
      /*
      window.addEventListener('resize', () => {
          // this.mphmap.resize();                         //********* resize not yet fixed

          mpCanRoot.style.width = '100%';
          mpCanRoot.style.height = '100%';
      });
      */
      this.mapReady = true;
      this.userZoom = true;

      // mpWrap = document.getElementById('map_wrapper');
      // mpCan = document.getElementById('map_canvas');
      // mpCanRoot = document.getElementById('map_canvas_root');

      // mpWrap = document.getElementById('map_wrapper');
      // mpCan = document.getElementById('map_' + this.mlconfig.getMapNumber());
      // mpCanRoot = document.getElementById('map' + this.mlconfig.getMapNumber() + '_root');
    }

    async prepareToSetBounds() {
      if (this.userZoom === true) {
        // let mapPt = this.mphmap.toMap({x: evt.x, y: evt.y});
        const mapPt = this.mphmap.extent.center;
        const lld = webMercatorUtils.xyToLngLat(this.mphmap.extent.xmin, this.mphmap.extent.ymin);
        const urd = webMercatorUtils.xyToLngLat(this.mphmap.extent.xmax, this.mphmap.extent.ymax);
        this.bounds = new MlboundsService(lld[0], lld[1], urd[0], urd[1]);
        // this.bounds = this.mphmap.extent;
        this.mlconfig.setBounds(this.bounds);
        const xtExt = await this.extractBounds(this.mphmap.zoom, mapPt, 'pan');
        // xtExt.then( () => {
        this.setBounds(xtExt);
        // });
      }
    }

    getSearchBounds() {
            console.log('MapHosterArcGIS getSearchBounds');
            const bounds = this.mphmap.extent;
            console.log(bounds);
            return bounds;
        }
    retrievedNewPosition(pos) {
        console.log('Back in retrievedNewPosition');
        console.log(pos);
        console.log('open map using framework {pos.maphost} at x {pos.lon}, y {pos.lat} zoom {pos.zoom}');
    }

    getGlobalsForUrl(): string {
        console.log(' MapHosterArcGIS.prototype.getGlobalsForUrl');
        console.log('&lon=' + this.cntrxG + '&lat=' + this.cntryG + '&zoom=' + this.zmG);
        return '&lon=' + this.cntrxG + '&lat=' + this.cntryG + '&zoom=' + this.zmG;
    }

    getGlobalPositionComponents() {
        return {lon: this.cntrxG, lat: this.cntryG, zoom: this.zmG};
    }

    getCenter() {
        const pos = { lon: this.cntrxG, lat: this.cntryG, zoom: this.zmG};
        console.log('return accurate center from getCenter()');
        console.log(pos);
        return pos;
    }

    getPusherEventHandler() {
        return this.pusherEventHandler;
    }
    removeEventListeners() {
        // this.mphmap.removeListener();
        console.log('empty function removeEventListners');
    }

    getmlconfig() {
        return this.mlconfig;
    }
}
