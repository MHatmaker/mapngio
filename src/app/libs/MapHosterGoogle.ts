// import {Injectable} from '@angular/core';
import { MLConfig } from './MLConfig';
// import { PusherConfig } from './PusherConfig';
// import { PusherClientService } from '../services/pusherclient.service';
import { PusherEventHandler } from './PusherEventHandler';
import { Utils } from './utils';
import { MlboundsService, ImlBoundsParams, XtntParams, Xtnt } from '../services/mlbounds.service';
import { EMapSource } from '../services/configparams.service';
// import { GoogleMap, Size, Point, LatLngLiteral, LatLng, LatLngBounds } from '@agm/core/services/google-maps-types';
// import { createClient, GoogleMapsClient } from '@google/maps';
// import { GeoCoder } from './GeoCoder';
// import { GeoCodingService } from '../services/GeoCodingService';
// import { IPositionParams, IPositionData } from '../services/positionupdate.interface';
import { PositionupdateService } from '../services/positionupdate.service';
import { PusherclientService, PusherDetails } from '../services/pusherclient.service';
import { PusherConfig } from './PusherConfig';
// import { PusherEventHandler } from './PusherEventHandler';
import { MapHoster } from './MapHoster';
import { GeocodingService } from '../services/geocoding.service';
// import { Observable } from 'rxjs';
import { MapLocOptions } from '../services/positionupdate.interface';
// import { SearchplacesService } from '../services/searchplaces.service';
import { LocationsService } from '../services/locations.service';
// import { GmpopoverService } from '../services/gmpopover.service';
// import { Popover } from '@ionic/angular';
import { MarkerInfoPopup } from './MarkerInfoPopup';
import { v4 as uuid } from 'uuid';
import { MLInjector } from './MLInjector';
// import { } from 'googlemaps';
// import { LatLng, LatLngBounds, SearchplacesService, PlacesService, Marker, events, event, MaxZoomStatus } from 'googlemaps';
// import { google } from 'googleapis';

// declare var google;

// interface IInfoWnd  IMap<{'title': string, infownd: google.maps.InfoWindow};

// @Injectable()
export class MapHosterGoogle extends MapHoster {
    hostName = 'MapHosterGoogle';
    scale2Level = [];
    mphmap: any;
    google: typeof google;
    mapReady = true;
    zmG = -1;
    userZoom = true;
    // mphmapCenter;
    cntrxG = null;
    cntryG = null;
    bounds = null;
    minZoom = null;
    maxZoom = null;
    zoomLevels = null;
    popup = null;
    marker = null;
    markers = [];
    popupSet: Set<string> = new Set<string>();
    popups = [];
    infoWnds = new Map<string, google.maps.InfoWindow> ();
    // popovers = new Map<string, Popover>();
    markerInfoPopups = new Map<string, MarkerInfoPopup> ();
    currentPopup = null;
    mrkr = null;
    CustomControl = null;
    queryListenerLoaded = false;
    searchBox = null;
    // searchInput = null,
    searchFiredFromUrl = false;
    selfPusherDetails = {
        channelName: null,
        pusher: null
    };
    // popDetails = null;
    queryPlaces = {
        location: null,
        bounds: null,
        query: 'what do you want?'
    };
    placesFromSearch = [];
    // private geoCoder = createClient();
    mlconfig: MLConfig;
    pusherEventHandler: PusherEventHandler;
    self: any;
    boundsListenerHandle: any;
    adrs: string;
    im: 'http://www.robotwoods.com/dev/misc/bluecircle.png';
    private labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private labelIndex = 0;
    private utils: any;
    private pusherConfig: PusherConfig;
    private pusherClientService: PusherclientService;
    private positionUpdateService: PositionupdateService;
    private geoCoder: GeocodingService;
    private initialLocations: LocationsService;

    constructor(private mapNumber: number, mlconfig: MLConfig) {
        super();
        this.mlconfig = mlconfig;
        this.self = this;
        this.utils = MLInjector.injector.get(Utils);
        this.pusherClientService = MLInjector.injector.get(PusherclientService);
        this.positionUpdateService = MLInjector.injector.get(PositionupdateService);
        this.pusherConfig = MLInjector.injector.get(PusherConfig);
        this.geoCoder = MLInjector.injector.get(GeocodingService);
        this.initialLocations = MLInjector.injector.get(LocationsService);
        this.selfPusherDetails = this.pusherClientService.getPusherDetails();
    }

    updateGlobals(msg: string, cntrx: number, cntry: number, zm: number) {
        console.log('updateGlobals ');
        const gmBounds = this.mphmap.getBounds();
        const
            mapLinkrBounds = new MlboundsService();
        if (gmBounds) {
            const ne = gmBounds.getNorthEast();
            const sw = gmBounds.getSouthWest();
            // bounds = gmBounds;
            mapLinkrBounds.llx = sw.lng();
            mapLinkrBounds.lly = sw.lat();
            mapLinkrBounds.urx = ne.lng();
            mapLinkrBounds.ury = ne.lat();
        }
        this.zmG = zm;
        this.cntrxG = cntrx;
        this.cntryG = cntry;
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
        this.mlconfig.setBounds(mapLinkrBounds);
    }

    showGlobals(cntxt: string) {
        console.log(cntxt + ' Globals: lon ' + this.cntrxG + ' lat ' + this.cntryG + ' zoom ' + this.zmG);
    }

    collectScales(levels: number) {
        this.scale2Level = [];
        const sc2lv = this.scale2Level,
        // var topLevel = ++levels;
            topLevel = levels + 2;
        let scale = 1128.497220;
        for (let i = topLevel; i > 0; i -= 1) {
            const obj = {scale, level: i};
            scale = scale * 2;
            // console.log('scale ' + obj.scale + ' level ' + obj.level);
            sc2lv.push(obj);
        }
    }

    placeMarkers(places: any) { // google.maps.places.PlacesService) {
        for (const marker of this.markers) {
            if (marker) {
                marker.setMap(null);
            }
        }

        // For each place, get the icon, place name, and location.
        this.markers = [];
        const boundsForMarkers = new google.maps.LatLngBounds();
        // for (let i = 0; i < places.``; i++) {
        //     const place = places[i];
        for (const place of places) {
            if (place) {
                const lbl = this.labels[this.labelIndex++ % this.labels.length];
                const fixedLL = this.utils.toFixedTwo(place.geometry.location.lng(), place.geometry.location.lat(), 6);
               // fixedGeo = new google.maps.Point(fixedLL.lon, fixedLL.lat);

                const mip = new MarkerInfoPopup(place.geometry.location, place.formatted_address, place.name, place.icon,
                    this.mphmap, this.mlconfig.getUserId(), this.mapNumber, uuid(), lbl, this);
                this.markerInfoPopups.set(mip.getId(), mip);
                this.markers.push(mip.getMarker());
                this.addToPopupSet(mip.getMarker().getPosition().lng(), mip.getMarker().getPosition().lat());
                // this.popupSet.add(new PointIndex(mip.getMarker().getPosition().lng(), mip.getMarker().getPosition().lat()));
                // MLInjector.injector.get(PophandlerProvider).addPopup(place.name, mip);

                boundsForMarkers.extend(place.geometry.location);
            }
        }
    }

    addInitialSymbol(lat: number, lng: number, hint: string, text: string) {
        const popPt = new google.maps.LatLng(lat, lng);
        const label = this.labels[this.labelIndex++ % this.labels.length];
        const mip = new MarkerInfoPopup(popPt, text,
          hint, 'assets/icon/ltblu-stars.png', this.mphmap, this.mlconfig.getUserId(), this.mapNumber, uuid(), label, this);
        this.markerInfoPopups.set(mip.getId(), mip);
    }

    addInitialSymbols() {
        const locs = this.initialLocations.getInitialLocations();
        locs.forEach(loc => this.addInitialSymbol(loc.lat, loc.lon, loc.name, loc.description));
    }

    // formatBounds(b) {
    //     var s = String.format('ll: {0}, {1}, ru: {2}, {3}',
    //                         b.getSouthWest().lng(), b.getSouthWest().lat(),
    //                         b.getNorthEast().lng(), b.getNorthEast().lat());
    //     return s;
    // }

    extractBounds(action: string): XtntParams {
        const zm = this.mphmap.getZoom(),
            cntr = this.mphmap.getCenter(),
            fixedLL = this.utils.toFixedTwo(cntr.lng(), cntr.lat(), 9),
            // bnds = this.mphmap.getBounds(),
            xtntDict = {
                src: 'google',
                zoom: zm < this.maxZoom ? zm : this.maxZoom - 1,
                lon: fixedLL.lon,
                lat: fixedLL.lat,
                scale: this.scale2Level[zm < this.maxZoom ? zm : this.maxZoom - 1].scale,
                action
                // bounds: bnds
            };
        return xtntDict;
    }

    compareExtents(msg: string, xtnt: XtntParams) {
        let cmp = true;
        const gmBounds = this.mphmap.getBounds();

        if (gmBounds) {
            const ne = gmBounds.getNorthEast();
            const sw = gmBounds.getSouthWest();
            cmp = xtnt.zoom === this.zmG;
            const wdth = Math.abs(ne.lng() - sw.lng());
            const hgt = Math.abs(ne.lat() - sw.lat());
            if (!(wdth === 0 || hgt === 0)) {
                const lonDif = Math.abs((xtnt.lon - this.cntrxG) / wdth);
                const latDif =  Math.abs((xtnt.lat - this.cntryG) / hgt);
                // cmp = ((cmp == true) && (xtnt.lon == this.cntrxG) && (xtnt.lat == this.cntryG));
                cmp = ((cmp === true) && (lonDif < 0.0005) && (latDif < 0.0005));
                console.log('compareExtents ' + msg + ' ' + cmp);
          }
        }
        return cmp;
    }

    async setBounds(action: string) {
        console.log('MapHosterGoogle setBounds with  ' + this.pusherEventHandler.getMapNumber());
        if (this.mapReady === true) {
            // runs this code after you finishing the zoom
            const xtExt = this.extractBounds(action),
                xtntJsonStr = JSON.stringify(xtExt);


            this.selfPusherDetails = this.pusherClientService.getPusherDetails();
            console.log('extracted bounds ' + xtntJsonStr);
            const cmp = this.compareExtents('MapHosterGoogle ' + this.mlconfig.getMapNumber() + ' setBounds', xtExt);
            if (cmp === false) {
                console.log('MapHoster Google setBounds ' + this.mlconfig.getMapNumber() +
                ' pusher send to channel ' + this.selfPusherDetails.channelName);
                // if (this.selfPusherDetails.pusher) {
                //     const triggered = this.selfPusherDetails.pusher.channel(
                //       this.selfPusherDetails.channelName).trigger('client-MapXtntEvent', xtExt);
                //     console.log('triggered?');
                //     console.log(triggered);
                // }
                this.pusherClientService.publishPanEvent(xtExt);
                this.updateGlobals('in setBounds with cmp false', +xtExt.lon, +xtExt.lat, xtExt.zoom);

                const gBnds = this.mphmap.getBounds();
                console.log(gBnds);
                // ll = new google.maps.LatLng(bnds.lly, bnds.llx);
                // ur = new google.maps.LatLng(bnds.ury, bnds.urx);
                // gBnds = new google.maps.LatLngBounds(ll, ur);
                // if (this.mlconfig.getSource() == EMapSource.urlgoogle) {
                //     qtext = this.mlconfig.query();
                // } else { //if (this.mlconfig.getSource() == EMapSource.sharegoogle) {
                //     qtext = this.mlconfig.getQuery();
                // }
                const qtext = this.mlconfig.getQuery();
                if (qtext && qtext !== '') {
                    this.queryPlaces.bounds = gBnds;
                    this.queryPlaces.query = qtext;
                    this.queryPlaces.location = this.mphmap.getCenter();
                    const service = new google.maps.places.PlacesService(this.mphmap);
                    await service.textSearch(this.queryPlaces, (places) => {
                        if (places && places.length > 0) {
                            this.placeMarkers(places);
                        }
                    });
                }
            }
        }
    }

    hideLoading(error = null) {
        console.log('hide loading');
        this.utils.hideLoading(error);
    }

    refreshPlaces() {
      const gBnds = this.mphmap.getBounds();
      console.log(gBnds);
      // ll = new google.maps.LatLng(bnds.lly, bnds.llx);
      // ur = new google.maps.LatLng(bnds.ury, bnds.urx);
      // gBnds = new google.maps.LatLngBounds(ll, ur);
      const qtext = this.mlconfig.getQuery();
      if (qtext && qtext !== '') {
          this.queryPlaces.bounds = gBnds;
          this.queryPlaces.query = qtext;
          this.queryPlaces.location = this.mphmap.getCenter();
          const service = new google.maps.places.PlacesService(this.mphmap);
          service.textSearch(this.queryPlaces, (places) => {
              if (places && places.length > 0) {
                  this.placeMarkers(places);
              }
          });
      }
    }

    retrievedBoundsInternal(xj: XtntParams) {
        console.log('Back in MapHosterGoogle ' + this.mlconfig.getMapNumber() + ' retrievedBounds');
        if (xj.zoom === 0) {
            xj.zoom = this.zmG;
        }
        const cmp = this.compareExtents('retrievedBounds', xj);
            // view = xj.lon + ', ' + xj.lat + ': ' + zm + ' ' + this.scale2Level[zm].scale;
            // document.getElementById('mppos').innerHTML = view;
        if (cmp === false) {
            const tmpLon = this.cntrxG;
            const tmpLat = this.cntryG;
            const tmpZm = this.zmG;

            this.updateGlobals('in retrievedBounds with cmp false', xj.lon, xj.lat, xj.zoom);
            this.userZoom = false;
            const cntr = new google.maps.LatLng(xj.lat, xj.lon);
            // this.userZoom = true;
            if (xj.action === 'pan') {
                if (tmpZm !== xj.zoom) {
                  this.mphmap.setZoom(xj.zoom > 21? 21 : xj.zoom);
                }
                this.mphmap.setCenter(cntr);
            } else {
                if (tmpLon !== xj.lon || tmpLat !== xj.lat) {
                    this.mphmap.setCenter(cntr);
                }
                this.mphmap.setZoom(xj.zoom > 21? 21 : xj.zoom);
            }
            this.refreshPlaces();
            this.userZoom = true;
        }
    }

    addToPopupSet(x: number, y: number) {
      if (this.popupSet.has('' + x + ', ' + y) === false) {
        this.popupSet.add('' + x + ', ' + y);
      }
    }

    closePopup(popupId: string, popPt: google.maps.LatLng) {
      const xystr = '' + popPt.lng() + ', ' + popPt.lat();
      console.log('close popup ID ' + popupId + ' at ' + xystr);
      this.popupSet.delete(xystr);
    }

    retrievedClick(clickPt) {
        const fixedLL = this.utils.toFixedTwo(clickPt.lng, clickPt.lat, 6);
        console.log('Back in retrievedClick - with click at ' +  clickPt.lng + ', ' + clickPt.lat);
        // latlng = L.latLng(clickPt.y, clickPt.x, clickPt.y);
        // $inj = this.mlconfig.getInjector();
        // linkrSvc = $inj.get('LinkrService');
        // linkrSvc.hideLinkr();

        const popPt = new google.maps.LatLng(clickPt.lat, clickPt.lng);
        let content = 'Map click at ' + fixedLL.lat + ', ' + fixedLL.lon;
        if (clickPt.title) {
            content += '<br>' + clickPt.title;
        }
        if (clickPt.address) {
            content += '<br>' + clickPt.address;
        }
        // if (this.popDetails !== null && clickPt.referrerId !== this.mlconfig.getUserId()) {
        //     this.popDetails.infoWnd.close();
        //     this.popDetails.infoMarker.setMap(null);
        // }
        console.log(`referrerId is ${clickPt.referrerId}, I am ${this.mlconfig.getUserId()}`);
        console.log(`popoverId is ${clickPt.popId}`);
        if (clickPt.referrerId !== this.mlconfig.getUserId()) {
            if (this.popupSet.has('' + fixedLL.lon + ', ' + fixedLL.lat) === false) {
            // if(this.markerInfoPopups.has(clickPt.popId) === false) {
              const titleShared = '(shared )' + clickPt.title;
              const lbl = this.labels[this.labelIndex++ % this.labels.length];
              const mip = new MarkerInfoPopup(popPt, content, titleShared,
                // 'Received from user ' + clickPt.referrerName + ', ' + clickPt.referrerId,
                'assets/icon/ltblu-stars.png', this.mphmap, this.mlconfig.getUserId(), this.mapNumber, clickPt.popId, lbl, this, true);
              this.markerInfoPopups.set(clickPt.popId, mip);
              this.markers.push(mip.getMarker());
              this.addToPopupSet(fixedLL.lon, fixedLL.lat);
              // this.addToPopupSet(mip.getMarker().getPosition().lng(), mip.getMarker().getPosition().lat());
              mip.openSharedPopover();

              const elms = document.getElementsByClassName('sharebutton');
              for (const elm of Array.from(elms)) {
                if (elm instanceof (HTMLElement)) {
                  const btnShare = elm;
                  if (btnShare) {
                    console.log(btnShare);
                    btnShare.style.visibility = 'hidden';
                  }
                }
            }
          }
        }
    }

    setCurrentLocation( loc: MapLocOptions) {
      const cntr = new google.maps.LatLng(loc.center.lat, loc.center.lng);
      // this.updateGlobals('setCurrentLocation', loc.center.lng, loc.center.lat, this.zmG);
      this.mphmap.panTo(cntr);
      // const userMarker = new google.maps.Marker({
      //       position: cntr,
      //       map: this.mphmap,
      //       icon: this.im
      //   });
      this.setBounds('pan');
    }

  async searchOnStartupMap(queryPlaces) {
      const service = new google.maps.places.PlacesService(this.mphmap);
      await service.textSearch(queryPlaces, (places) => {
          this.mlconfig.setInitialPlaces(places);
          console.log(places);
          if (places && places.length > 0) {
              this.placeMarkers(places);
          }
      });
    }
    configureMap(gMap: google.maps.Map, mapOptions: google.maps.MapOptions, config) {
        console.log('MapHosterGoogle configureMap');
        let initZoom = mapOptions.zoom;
        let qlat = '';
        let qlon = '';

        this.mlconfig = config;
        this.self = this;
        this.mphmap = gMap;
        // this.geoCoder = new google.maps.Geocoder();


        if (this.mlconfig.testUrlArgs()) {
            qlat = this.mlconfig.lat();
            qlon = this.mlconfig.lon();
            const qzoom = this.mlconfig.zoom();
            initZoom = +qzoom; // parseInt(qzoom, 10);
            this.updateGlobals('iin configureMap - nit with qlon, qlat', +qlon, +qlat, +qzoom);
        } else {
            if (mapOptions) {
              const lat = mapOptions.center.lat;
              const lng = mapOptions.center.lng;
                this.updateGlobals('in configureMap - MapHosterGoogle init with passed in mapOptions',
                +lng, +lat, +initZoom);
            } else {
                this.updateGlobals('in configureMap - MapHosterGoogle init with hard-coded values', +qlon, +qlat, +initZoom);
            }
        }
        const firstCntr = new google.maps.LatLng(this.cntryG, this.cntrxG);
        this.mphmap.panTo(firstCntr);
        this.mphmap.setCenter(firstCntr);
        // LocateSelfCtrl.setMap(goooogle, this.mphmap);

        // this.updateGlobals('init', -0.09, 51.50, 13, 0.0);
        this.showGlobals('MapHosterGoogle - Prior to new Map');
        // google.maps.event.addListener(this.mphmap, 'end', gotDragEnd);

        // Maybe it will work at this point!!!

        this.minZoom = this.maxZoom = this.zoomLevels = 0;

        this.maxZoom = 21;
        this.zoomLevels = this.maxZoom - this.minZoom;
        this.collectScales(this.zoomLevels);
        this.mlconfig.showConfigdetails('MapHosterGoogle - after collectScales');
        this.showGlobals('after collectScales');
        this.mphmap.setZoom(+initZoom);

        /*

        google.maps.event.addListenerOnce(gMap, 'zoom_changed', function() {
            var oldZoom = gMap.getZoom();
            gMap.setZoom(oldZoom - 1); //Or whatever
        });
        */

        function placeCustomControls() {
          /*
            var $inj = this.mlconfig.getInjector(),
                ctrlSvc = $inj.get('MapControllerService'),
                mapCtrl = ctrlSvc.getController();
            setTimeout(function () {
                mapCtrl.placeCustomControls();
            }, 500);
            */
        }

        function setupQueryListener() {
          /*
            var $inj = this.mlconfig.getInjector(),
                ctrlSvc = $inj.get('MapControllerService'),
                mapCtrl = ctrlSvc.getController();
            mapCtrl.setupQueryListener('google');
            */
        }

        function fillMapWithMarkers(places) {
            if (places) {
                this.placeMarkers(places);
            }
          /*
            var $inj = this.mlconfig.getInjector(),
                ctrlSvc = $inj.get('MapControllerService'),
                mapCtrl = ctrlSvc.getController();
            mapCtrl.fillMapWithMarkers();
            */
        }

        google.maps.event.addListenerOnce(this.mphmap, 'tilesloaded', () => {
            const zsvc = new google.maps.MaxZoomService(),
                cntr = new google.maps.LatLng(this.cntryG, this.cntrxG); // {lat: this.cntryG, lng: this.cntrxG},
            console.log('>>>>>>>>>>>>>> tiles loaded >>>>>>>>>>>>>>>>>>>>');

            this.hideLoading();
            this.mapReady = true;
            const center = this.mphmap.getCenter();
            // google.maps.event.trigger(this.mphmap, 'resize');
            // this.mphmap.setCenter(center);
            this.addInitialSymbols();
            // google.maps.event.trigger(this.mphmap, 'resize');
            // this.mphmap.setCenter(center);
            const gmQuery = this.mlconfig.getQuery();
            console.log('getMaxZoomAtLatLng for ' + cntr.lng() + ', ' + cntr.lat());

            zsvc.getMaxZoomAtLatLng(cntr,  (response) => {
                console.log('zsvc.getMaxZoomAtLatLng returned response:');
                console.log(response);
                if (response && response.status === google.maps.MaxZoomStatus.OK) {
                    this.maxZoom = response.zoom;
                    this.zoomLevels = this.maxZoom - this.minZoom;
                    this.collectScales(this.zoomLevels);
                    // this.mlconfig.showConfigDetails('MapHosterGoogle zsvc.getMaxZoomAtLatLng - after collectScales');
                    this.showGlobals('after zsvc.getMaxZoomAtLatLng collectScales');
                } else {
                    if (response) {
                        // alert('getMaxZoomAtLatLng service returned status other than OK');
                        console.log('getMaxZoomAtLatLng service returned status other than OK');
                        console.log(response.status);
                        console.log('zoom level returned ' + response.status);
                        this.maxZoom = this.mphmap.getZoom();
                        console.log('used zoom level ' + this.mphmap.getZoom());
                        this.zoomLevels = this.maxZoom - this.minZoom;
                        this.collectScales(this.zoomLevels);
                        this.showGlobals('after zsvc.getMaxZoomAtLatLng failure and collectScales');
                    } else {
                        alert('getMaxZoomAtLatLng service returned null');
                    }

                }
            });

            console.log('gmQuery contains ' + gmQuery);
        // searchInput = (document.getElementById('pac-input' + this.mlconfig.getMapNumber()));
        // this.mphmap.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
        // searchInput.value = '';
            // if (gmQuery !== '') {
            //     this.searchFiredFromUrl = true;
            //     this.mlconfig.setQuery(gmQuery);
            // }
            // if (this.searchFiredFromUrl === true) {
            if (this.mlconfig.getSource() === EMapSource.placesgoogle ||
                  this.mlconfig.getSource() === EMapSource.urlgoogle ||
                  this.mlconfig.getSource() === EMapSource.sharegoogle) {
                console.log('getBoundsFromUrl or from share config.......in MapHosterGoogle "tilesloaded" listener');
                const bnds = this.mlconfig.getBounds();
                const qtext = this.mlconfig.getQuery();
                if (this.mlconfig.getSource() === EMapSource.sharegoogle || this.mlconfig.getSource() === EMapSource.placesgoogle) {
                    const xtExt = this.extractBounds('pan');
                    this.pusherClientService.publishPanEvent(xtExt);
                }
                console.log(bnds);
                const ll = new google.maps.LatLng(bnds.lly, bnds.llx);
                const ur = new google.maps.LatLng(bnds.ury, bnds.urx);
                const gBnds = new google.maps.LatLngBounds(ll, ur);
                this.searchFiredFromUrl = false;

/* this is the previously functional location for accessing pac-input
                pacinput = angular.element('pac-input' + this.mlconfig.getMapNumber());
                pacinput.value = qtext;
*/
                // pacinput.focus();
                if (qtext !== '') {
                    this.queryPlaces.bounds = gBnds;
                    this.queryPlaces.query = qtext;
                    this.queryPlaces.location = center;
                    this.searchOnStartupMap(this.queryPlaces);
                }
                }

            // setupQueryListener();
            // ();
            const initialPlaces = this.mlconfig.getInitialPlaces();
            if ( initialPlaces) {
                this.placeMarkers(initialPlaces);
              }
        });
        setupQueryListener();
        // var bndsInit = createBounds();
        // this.mphmap.fitBounds(bndsInit);
        /*
        listener = this.mphmap.addListener('idle',  () => {
            console.log('Entering idle listener');
            // var center = this.mphmap.getCenter();
            var idleFirstCntr = new google.maps.LatLng(this.cntryG, this.cntrxG);
            this.mphmap.setCenter(idleFirstCntr);
            // this.mphmap.setZoom(12);
            this.mphmap.setZoom(initZoom);
            console.log('bounds in idle');
            console.debug(this.mphmap.getBounds());
            this.boundsListenerHandle.remove(listener);
        });
        */

        // searchInput = (document.getElementById('pac-input' + this.mlconfig.getMapNumber()));
        // this.mphmap.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
        // searchInput.value = '';
        // searchBox = new gplaces.SearchBox(/** @type {HTMLInputElement} */
        //     (searchInput));
        // searchBox = MapCtrl.getSearchBox();

        // Bias the SearchBox results towards places that are within the bounds of the
        // current map's viewport.
        this.boundsListenerHandle = this.mphmap.addListener('bounds_changed',  () => {
            const changedBounds = this.mphmap.getBounds();
            // console.debug(changedBounds);
            if (this.searchBox) {
                this.searchBox.setBounds(changedBounds);
            }
            const convertedBounds = new MlboundsService(changedBounds.getSouthWest().lng(), changedBounds.getSouthWest().lat(),
                         changedBounds.getNorthEast().lng(), changedBounds.getNorthEast().lat());
            this.mlconfig.setBounds(convertedBounds);
        });

        this.mphmap.addListener('dragend',  () => {
            console.log('DRAG END');
            if (this.userZoom === true) {
                this.setBounds('pan');
            }
        });
        this.mphmap.addListener('zoom_changed', () => {
            if (this.userZoom === true) {
                if (this.scale2Level.length > 0) {
                    this.setBounds('zoom');
                }
            }
        });

        // google.maps.event.addListener(this.mphmap, 'resize', gotResize); //function() {
        //     console.log('resize event hit');
        //     console.log(this.mphmap.getBounds());
        // });

        // google.maps.event.addDomListener(window, 'resize', function () {
        //     gotResize();
            // console.log('resize event hit');
            // console.log(this.mphmap.getBounds());
        // });
        google.maps.event.addDomListener(window, 'resize', () => {
            const center = this.mphmap.getCenter();
            google.maps.event.trigger(this.mphmap, 'resize');
            this.mphmap.setCenter(center);
        });

        this.mphmap.addListener('mousemove', (e) => {
            const ltln = e.latLng,
                fixedLL = this.utils.toFixedTwo(ltln.lng(), ltln.lat(), 4),
                evlng = fixedLL.lon,
                evlat = fixedLL.lat,
                zm = this.mphmap.getZoom(),
                cntr = this.mphmap.getCenter(),
                fixedCntrLL = this.utils.toFixedTwo(cntr.lng(), cntr.lat(), 4),
                cntrlng = fixedCntrLL.lon,
                cntrlat = fixedCntrLL.lat;

            if (this.scale2Level.length > 0 && zm < this.maxZoom) {
                // var view = 'Zoom: ' + zm + ' Scale: ' + this.scale2Level[zm].scale +
                // ' Center: ' + cntrlng + ', ' + cntrlat + ' Current: ' + evlng + ', ' + evlat;
                // document.getElementById('mppos').value = view;
                this.positionUpdateService.positionData.emit({key: 'coords',
                    val: {
                        zm: zm < this.maxZoom ? zm : this.maxZoom - 1,
                        scl: this.scale2Level[zm < this.maxZoom ? zm : this.maxZoom - 1].scale,
                        cntrlng,
                        cntrlat,
                        evlng,
                        evlat
                    }});
            }
        });

        this.mphmap.addListener('click', (e) => {
            this.onMapClick(e);
        });

        this.pusherEventHandler = new PusherEventHandler(this.mlconfig.getMapNumber());
        console.log('Add pusher event handler for MapHosterGoogle ' + this.mlconfig.getMapNumber());

        this.pusherEventHandler.addEvent('client-MapXtntEvent', (xj: XtntParams) => this.retrievedBoundsInternal(xj));
        this.pusherEventHandler.addEvent('client-MapClickEvent',  (clickPt) => this.retrievedClick(clickPt));
        /*
        createBounds() {
            var createdBounds = new google.maps.LatLngBounds(),
                testPts = [

                    new google.maps.LatLng(41.890283, -87.625842),
                    new google.maps.LatLng(41.888941, -87.620692),
                    new google.maps.LatLng(41.884979, -87.620950)
                ],
                i;

            for (i = 0; i < 3; i++) {
                createdBounds.extend(testPts[i]);
            }
            return createdBounds;
        }
        */
//    }
    /*
    gotDragEnd() {
        console.log('dragend event hit');
        setBounds('pan');
    }
    */

    }
       gotResize() {
            const center = this.mphmap.getCenter();
            google.maps.event.trigger(this.mphmap, 'resize');
            this.mphmap.setCenter(center);
            // console.log(this.mphmap.getBounds());
        }
        showClickResult(content: string, popPt) {
            console.log(`showClickResult`);
            // if (this.popDetails !== null) {
            //     this.popDetails.infoWnd.close();
            //     this.popDetails.infoMarker.setMap(null);
            // }
            const label = this.labels[this.labelIndex++ % this.labels.length];
            const mip = new MarkerInfoPopup(popPt, content, 'Shareable position/info',
            'assets/icon/ltblu-stars.png', // placeholder for image icon url
              this.mphmap, this.mlconfig.getUserId(), this.mapNumber, uuid(), label, this);
            this.markerInfoPopups.set(mip.getId(), mip);
              // MLInjector.injector.get(Pophandlerprovider).addpopup('mapclicked', mip);
              // this.markerInfoPopups[place.name] = mip;
            // this.popDetails.infoWnd.open(this.mphmap, this.popDetails.infoMarker);
            if (this.selfPusherDetails.pusher) {
                const fixedLL = this.utils.toFixedTwo(popPt.lng(), popPt.lat(), 6),
                referrerId = this.mlconfig.getUserId(),
                referrerName = this.pusherConfig.getUserName(),
                pushLL = {lng: fixedLL.lon, lat: fixedLL.lat, z: '0',
                    referrerId, referrerName };
                console.log('You, ' + referrerName + ', ' + referrerId + ', clicked the map at ' + fixedLL.lat + ', ' + fixedLL.lon);
                this.selfPusherDetails.pusher.channel(this.selfPusherDetails.channelName).trigger('client-MapClickEvent', pushLL);
            }
        }



        async onMapClick(e) {
            const popPt = e.latLng,
                popPtRaw = {lat: popPt.lat(), lng: popPt.lng()},
                fixedLL = this.utils.toFixedTwo(popPt.lng(), popPt.lat(), 9);
            let content = 'You clicked the map at ' + fixedLL.lat + ', ' + fixedLL.lon;

            this.geoCoder.geoCode({location: popPtRaw}).then((adrs) => {
                if (adrs) {
                    content = adrs;
                }
                this.showClickResult(content, popPt);
            });
        }

    getMapHosterName() {
        return 'hostName is ' + this.hostName;
    }

    getMap() {
        return this.mphmap;
    }

    getEventDictionary() {
        const eventDct = this.pusherEventHandler.getEventDct();
        return eventDct;
    }
/*
    getBoundsZoomLevel(bounds) {
        var GLOBE_HEIGHT = 256, // Height of a google map that displays the entire world when zoomed all the way out
            GLOBE_WIDTH = 256, // Width of a google map that displays the entire world when zoomed all the way out

            ne = bounds.getNorthEast(),
            sw = bounds.getSouthWest(),
            latZoomLevel,
            lngZoomLevel,
            lngAngle = ne.lng() - sw.lng(),
            latAngle = ne.lat() - sw.lat();

        if (latAngle < 0) {
            latAngle += 360;
        }
        latZoomLevel = Math.floor(Math.log(this.mphmap.height * 360 / latAngle / GLOBE_HEIGHT) / Math.LN2);
        lngZoomLevel = Math.floor(Math.log(this.mphmap.width * 360 / lngAngle / GLOBE_WIDTH) / Math.LN2);

        return (latZoomLevel < lngZoomLevel) ? latZoomLevel: lngZoomLevel;
    }
*/

    /*
    polygon(coords) {
        var arrayLatLng = [],
            i,
            pgn;
        for (i = 0; i < coords.length; i++) {
            arrayLatLng.push(new google.maps.LatLng(coords[i][0], coords[i][1]));
        }
        pgn = new google.maps.Polygon({
            paths: arrayLatLng,
            strokeColor: '#0000FF',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            fillColor: '#FF0000',
            fillOpacity: 0.25
        });

        pgn.setMap(this.mphmap);
    }

    circle(cntr, rds) {
        var cntrLatLng = new google.maps.LatLng(cntr[0], cntr[1]),
            crcl = new google.maps.Circle({
                center: cntrLatLng,
                radius: rds,
                strokeColor: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            });

        crcl.setMap(this.mphmap);
    }
    */


    setUserName(name: string) {
        this.pusherConfig.setUserName(name);
    }

    getGlobalsForUrl() {
        return '&lon=' + this.cntrxG + '&lat=' + this.cntryG + '&zoom=' + this.zmG;
    }

    getCenter() {
        const pos = { lon: this.cntrxG, lat: this.cntryG, zoom: this.zmG};
        console.log('return accurate center from getCenter()');
        console.log(pos);
        return pos;
    }

    formatCoords(pos) {
        const fixed = this.utils.toFixedTwo(pos.lng, pos.lat, 5),
            formatted  = '<div style="color: blue;">' + fixed.lon + ', ' + fixed.lat + '</div>';
        return formatted;
    }

    geoLocate(pos: google.maps.LatLng) {
        const infoWindow = new google.maps.InfoWindow();
        infoWindow.setPosition(pos);
        infoWindow.setContent(this.formatCoords(pos));
        this.mphmap.setCenter(pos);
        this.mphmap.setZoom(14);
        this.updateGlobals('geoLocate just happened', pos.lng(), pos.lat(), 15);
    }

    publishPosition(pos) {
        if (this.selfPusherDetails.pusher) {
            console.log('MapHosterGoogle.publishPosition');
            console.log(pos);

            const gmQuery = this.mlconfig.query();
            if (gmQuery !== '') {
                console.log('adding gmQuery: ' + gmQuery);
                pos.gmquery = gmQuery;
                pos.search += '&gmquery=' + gmQuery;
                const pubBounds = this.mlconfig.getBoundsForUrl();
                pos.search += pubBounds;
            }
            console.log('After adding gmQuery');
            console.log(pos.search);

            this.selfPusherDetails.pusher.channel(this.selfPusherDetails.channelName).trigger('client-NewMapPosition', pos);
        }

    }

    retrievedBounds(xj: XtntParams) {
        return this.retrievedBoundsInternal(xj);
    }

    getSearchBounds() {
        console.log('MapHosterGoogle getSearchBounds');
        const bounds = this.mphmap.getBounds();
        console.log(bounds);
        return bounds;
    }

    setSearchBox(sbox) {
        this.searchBox = sbox;
    }

    setPlacesFromSearch(places: google.maps.places.PlaceResult[]) {
        this.placesFromSearch = places;
        console.log('in setPlacesFromSearch');
        console.log(this.placesFromSearch);
    }

    removeEventListeners() {
        console.log('empty removeEventListeners block in MapHosterGoogle');
    }

    getPusherEventHandler() {
        return this.pusherEventHandler;
    }

    getmlconfig(): MLConfig {
        return this.mlconfig;
    }
}
