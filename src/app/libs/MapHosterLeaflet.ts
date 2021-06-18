import { MLConfig } from './MLConfig';
import { PusherConfig } from './PusherConfig';
import { PusherclientService } from '../services/pusherclient.service';
// import { utils } from './utils';
import { MlboundsService, ImlBounds, XtntParams } from '../services/mlbounds.service';
// import { ConfigParams } from '../../../services/configparams.service';
import * as L from 'leaflet';
import { GeoCoder } from './GeoCoder';
// import { IPositionParams, IPositionData } from '../services/positionupdate.interface';
import { PositionupdateService } from '../services/positionupdate.service';
import { PusherEventHandler } from './PusherEventHandler';
import { MapHoster } from './MapHoster';
import { MapLocOptions } from '../services/positionupdate.interface';
import { MLInjector } from './MLInjector';
import { Utils } from './utils';


// @Injectable()
export class MapHosterLeaflet extends MapHoster {
    hostName = 'MapHosterLeaflet';
    scale2Level = [];
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
    mphmap = null;
    markers = [];
    popups = [];
    mrkr = null;
    CustomControl = null;
    queryListenerLoaded = false;
    pusherEvtHandler;
    mlconfig: MLConfig;
    pusherConfig: PusherConfig;
    utils: any;


    constructor(
      private mapNumber: number, mlconfig: MLConfig,
      private geoCoderLflt: GeoCoder) {
        super();
        this.mlconfig = mlconfig;
        this.utils = MLInjector.injector.get(Utils);
        this.pusherConfig = MLInjector.injector.get(PusherConfig);
        this.CustomControl =  L.Control.extend({
            options: {
                position: 'topright'
            },

            onAdd: () => { // map) {
                const container = document.getElementById('gmsearch' + this.mlconfig.getMapNumber());
                return container;
            }
        });
    }
    showLoading() {
        this.utils.showLoading();
    }
    hideLoading() {
        this.utils.hideLoading(null);
    }
    // MapHosterLeaflet.prototype.updateGlobals (msg, this.cntrx, this.cntry, zm)
    updateGlobals(msg: string, cntrx: number, cntry: number, zm: number) {
        console.log('updateGlobals ' + msg);
        const lfltBounds = this.mphmap.getBounds();
        console.log(lfltBounds);
        if (lfltBounds) {
            const ne = lfltBounds.getNorthEast();
            const sw = lfltBounds.getSouthWest();
            this.bounds = lfltBounds;
            lfltBounds.xmin = sw.lng;
            lfltBounds.ymin = sw.lat;
            lfltBounds.xmax = ne.lng;
            lfltBounds.ymax = ne.lat;
            this.mlconfig.setBounds(new MlboundsService(sw.lng as number, sw.lat as number, ne.lng as number, ne.lat as number));
        }
        this.zmG = zm;
        this.cntrxG = cntrx;
        this.cntryG = cntry;
        console.log('Updated Globals ' + msg + ' ' + this.cntrxG + ', ' + this.cntryG + ': ' + this.zmG);
        /*
        PositionViewCtrl.update('zm', {
            'zm: this.zmG,
            'scl: this.scale2Level.length > 0 ? this.scale2Level[this.zmG].scale : 3,
            'cntrlng: this.cntrxG,
            'cntrlat': this.cntryG,
            'evlng: this.cntrxG,
            'evlat: this.cntryG
        });
        */
        this.mlconfig.setPosition({lon: this.cntrxG, lat: this.cntryG, zoom: this.zmG});
    }

    showGlobals(cntxt) {
        console.log(cntxt + ' Globals : lon ' + this.cntrxG + ' lat ' + this.cntryG + ' zoom ' + this.zmG);
    }

    collectScales() {
        console.log('collectScales');

        this.scale2Level = [];
        const sc2lv = this.scale2Level;
        for (let i = 0; i < this.zoomLevels + 1; i += 1) {
            const scale = this.mphmap.options.crs.scale(i);
            const obj = {scale, level: i};
            // console.log('scale ' + obj.scale + ' level ' + obj.level);
            sc2lv.push(obj);
        }
    }


    markerInfoPopup(pos, content: string, hint) {
        const shareBtnId = 'idShare' + hint,
            contentId = 'idContent' + hint,
            contextHint = hint,
            contextContent = content,
            allContent = '<h4  style="color:#A0743C; visibility: visible">' + hint +
                '</h4><div id=' + contentId + ' >' + content +
                '</div><br><button class="trigger btn-primary" id=' + shareBtnId + '>Share</button>',
            contextPos = pos;

        this.mrkr = L.marker(pos).addTo(this.mphmap);


        const triggerPusher = function() {
            const fixedLL = this.utils.toFixed(contextPos[1], contextPos[0], 6);
            const referrerId = this.mlconfig.getUserId();
            const referrerName = this.pusherConfig.getUserName();
            const pushLL = {x: fixedLL.lon, y: fixedLL.lat, z: '0',
                referrerId, referrerName,
                address: contextContent, title: contextHint };
            console.log('You, ' + referrerName + ', ' + referrerId + ', clicked the map at ' + fixedLL.lat + ', ' + fixedLL.lon);

            this.pusherClientService.publishCLickEvent(pushLL);
        };

        // container = angular.element('<div />');
        // container.html(allContent);
        //
        // this.popup = L.popup().setContent(container[0]);
        this.popup = L.popup().setContent(allContent);
        this.mrkr.bindPopup(this.popup);
        this.markers.push(this.mrkr);
        this.popups.push(this.popup);
        this.mphmap.on('popupopen', function() {
            // alert('pop pop pop');
            console.log(this.popup);
            const referrerId = this.mlconfig.getReferrerId(),
                usrId = this.mlconfig.getUserId(),
                btnShare = document.getElementById(shareBtnId);
            if (referrerId && referrerId !== usrId) {
                if (btnShare) {
                    console.log(btnShare);
                    btnShare.style.visibility = 'visible';
                    btnShare.onclick = (e) => {
                        triggerPusher();
                    };
                }

            } else {
                if (btnShare) {
                    console.log(btnShare);
                    btnShare.style.visibility = 'hidden';
                }
            }
        });
    }

    addInitialSymbols() {
        let hint = 'Seanery Beanery Industrial Row';
        this.markerInfoPopup([41.8933, -87.6258], 'Seanery Beanery with spectacular view of abandoned industrial site', hint);
        hint = 'Seanery Beanery For Discriminating Beaners';
        this.markerInfoPopup([41.8789, -87.6206], 'Seanery Beanery located adjacent to great entertainment venues', hint);
        hint = 'Seanery Beanery For Walking Averse';
        this.markerInfoPopup([41.8749, -87.6190], 'Seanery Beanery located close to the pedicab terminal', hint);

        // L.circle([51.508, -0.11], 500, {
            // color: 'red',
            // fillColor: '#f03',
            // fillOpacity: 0.5
        // }).addTo(mphmap).bindPopup('I am a circle.');

        // L.polygon([
            // [51.509, -0.08],
            // [51.503, -0.06],
            // [51.51, -0.047]
        // ], {
            // color: 'blue',
            // fillColor: '#00f',
            // fillOpacity: 0.25
        // }).addTo(mphmap).bindPopup('I am a polygon.');

        this.popup = L.popup();
    }

    onMouseMove(e) {
        const ltln = e.latlng,
            cntr = this.mphmap.getCenter();
            // fixedCntrLL = this.utils.toFixedTwo(cntr.lng, cntr.lat, 4);
            // cntrlng = fixedCntrLL.lon,
            // cntrlat = fixedCntrLL.lat;

        MLInjector.injector.get(PositionupdateService).positionData.emit(
          {
            key: 'zm',
            val: {
              zm: this.zmG,
              scl: this.scale2Level.length > 0 ? this.scale2Level[this.zmG].scale : 3,
              cntrlng: this.cntrxG,
              cntrlat: this.cntryG,
              evlng: this.cntrxG,
              evlat: this.cntryG
              // 'cntrlng: cntrlng,
              // 'cntrlat': cntrlat,
              // 'evlng: evlng,
              // 'evlat: evlat
            }
          }
        );
  }

    showClickResult(r) {
      if (r) {
        console.log('showClickResultp at ' + r.lat + ', ' + r.lon);
        const cntr = L.latLng(r.lat, r.lon, 0);
        if (this.marker) {
          this.marker.closePopup();
          this.markerInfoPopup([cntr.lat, cntr.lng], r.display_name, 'The hint');
        } else {
          this.markerInfoPopup([cntr.lat, cntr.lng], r.display_name, 'The hint');
        }
      }
    }

    onMapClick(e) {
        let r: any = null;
        this.geoCoderLflt.reverse(e.latlng, this.mphmap.options.crs.scale(this.mphmap.getZoom())).
            then((results) => {
                r = results;
                this.showClickResult(r);
            });
    }

    extractBounds(action: string): XtntParams {
            // scale = mphmap.options.crs.scale(zm),
            // oldMapCenter = mphmapCenter,

        // xtntDict  : xtntParams;
            // mphmapCenter = mphmap.getCenter();
        // var cntr = action == 'pan' ? latlng : mphmap.getCenter();
        const cntr = this.mphmap.getCenter();
        const zm = this.mphmap.getZoom();
        const fixedLL = this.utils.toFixedTwo(cntr.lng, cntr.lat, 3);
        const xtntDict = {
            src: 'leaflet_osm',
            zoom: zm,
            lon: fixedLL.lon,
            lat: fixedLL.lat,
            scale: this.scale2Level[zm].scale,
            action
        };
        return xtntDict;
    }

    compareExtents(msg, xtnt) {
        let cmp = xtnt.zoom === this.zmG;
        const
            wdth = Math.abs(this.bounds.xmax - this.bounds.xmin),
            hgt = Math.abs(this.bounds.ymax - this.bounds.ymin),
            lonDif = Math.abs((xtnt.lon - this.cntrxG) / wdth),
            latDif =  Math.abs((xtnt.lat - this.cntryG) / hgt);
        // cmp = ((cmp == true) && (xtnt.lon == this.cntrxG) && (xtnt.lat == this.cntryG));
        cmp = ((cmp === true) && (lonDif < 0.0005) && (latDif < 0.0005));
        console.log('compareExtents ' + msg + ' ' + cmp);
        return cmp;
    }

    setBounds(action, ll) {
        // runs this code after finishing the zoom
        const xtExt = this.extractBounds(action), // latlng),
            xtntJsonStr = JSON.stringify(xtExt),
            cmp = this.compareExtents('setBounds', xtExt);
        console.log('extracted bounds ' + xtntJsonStr);

        if (cmp === false) {
            console.log('MapHoster Leaflet setBounds publishPanEvent');
            MLInjector.injector.get(PusherclientService).publishPanEvent(xtExt);
            this.updateGlobals('setBounds with cmp false', xtExt.lon, xtExt.lat, xtExt.zoom);
        }
    }

    retrievedClick(clickPt) {
        console.log('Back in retrievedClick - with a click at ' +  clickPt.x + ', ' + clickPt.y);
        const ll = L.latLng(clickPt.y, clickPt.x, clickPt.y);
            // $inj,
            // linkrSvc,
        let content = 'Received Pushed Click from user ' + clickPt.referrerName + ', ' + clickPt.referrerId + ' at ' + ll.toString();

        // $inj = this.pusherConfig.getInjector();
        // linkrSvc = $inj.get('LinkrService');
        // linkrSvc.hideLinkr();
        if (clickPt.title) {
            content += '<br>' + clickPt.title;
        }
        if (clickPt.address) {
            content += '<br>' + clickPt.address;
        }
        if (clickPt.referrerId !== this.mlconfig.getUserId()) {
            this.popup
                .setLatLng(ll)
                .setContent(content)
                .openOn(this.mphmap);
        }
    }

    retrievedBounds(xj: XtntParams) {
        console.log('Back in retrievedBounds');
        if (xj.zoom === 0) {
            xj.zoom = this.zmG;
        }
        const zm = xj.zoom,
            cmp = this.compareExtents('retrievedBounds', {zoom: zm, lon: xj.lon, lat: xj.lat});

        if (cmp === false) {
            const tmpLon = this.cntrxG;
            const tmpLat = this.cntryG;

            this.updateGlobals('retrievedBounds with cmp false', xj.lon, xj.lat, xj.zoom);
            this.userZoom = false;
            const cntr = new L.LatLng(xj.lat, xj.lon);

            if (xj.action === 'pan') {
                this.mphmap.setView(cntr, zm);
            } else {
                if (tmpLon !== xj.lon || tmpLat !== xj.lat) {
                    this.mphmap.setView(cntr, zm);
                } else {
                    this.mphmap.setZoom(zm);
                }
            }
            this.userZoom = true;
        }

        this.mlconfig.setPosition({lon: this.cntrxG, lat: this.cntryG, zoom: this.zmG});
    }

    // this.CustomControl =  L.Control.extend({
    //     options: {
    //         position: 'topright'
    //     },
    //
    //     onAdd: () { //map) {
    //         var container = document.getElementById('gmsearch' + this.mlconfig.getMapNumber());
    //         return container;
    //     }
    // });

    placeCustomControls() {
        // var $inj = PusherConfig.getInjector(),
        //     ctrlSvc = $inj.get('MapControllerService'),
        //     mapCtrl = ctrlSvc.getController();
        // mapCtrl.placeCustomControls();
    }

    setupQueryListener() {
        // var $inj = PusherConfig.getInjector(),
        //     ctrlSvc = $inj.get('MapControllerService'),
        //     mapCtrl = ctrlSvc.getController();
        // mapCtrl.setupQueryListener('leaflet');
    }

    setCurrentLocation( loc: MapLocOptions) {
      const lcntr = L.latLng(loc.center.lat, loc.center.lng, null);
      this.mphmap.panTo(lcntr);
      this.setBounds('pan', lcntr);
    }

    configureMap(lmap, mapOptions, config) {
        this.mlconfig = config;
        console.log('ready to show leaflet mphmap');
        this.mphmap = lmap; // L.map('map_canvas').setView([51.50, -0.09], 13);
        console.log(this.mphmap);
        this.showLoading();

        this.geoCoderLflt =  new GeoCoder(); // .nominatim();

        if (this.mlconfig.testUrlArgs()) {
            const qlat = +this.mlconfig.lat();
            const qlon = +this.mlconfig.lon();
            const qzoom = +this.mlconfig.zoom();
            this.mphmap.setView([qlat, qlon], qzoom);
            this.updateGlobals('init with qlon, qlat', qlon, qlat, qzoom);
        } else {
            this.mphmap.setView([mapOptions.center.lat, mapOptions.center.lng], mapOptions.zoom);
            this.updateGlobals('init with hard-coded values', mapOptions.center.lng, mapOptions.center.lat, mapOptions.zoom);
        }
        console.log(this.mphmap.getCenter().lng + ' ' +  this.mphmap.getCenter().lat);

        this.showGlobals('Prior to new Map');

        const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        const lyr = L.tileLayer(osmUrl, {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">' +
            'OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/"' +
            '>CC-BY-SA</a>, Imagery � <a href="http://cloudmade.com">CloudMade</a>'
        }).addTo(this.mphmap);
        lyr.on('load', function() {
        // setTimeout(function() {
        this.placeCustomControls();
        if (this.queryListenerLoaded === false) {
          this.setupQueryListener();
        } else {
          this.queryListenerLoaded = true;
        }
        // }, 1000);
        this.hideLoading();
            // this.mphmap.addControl(new CustomControl());
        });

        lyr.on('loading', function() { /// e) {
            this.showLoading();
        });

        this.minZoom = this.mphmap.getMinZoom();
        this.maxZoom = this.mphmap.getMaxZoom();
        this.zoomLevels = this.maxZoom - this.minZoom + 1;
        this.collectScales();
        this.bounds = this.mphmap.getBounds(); // returns LatLngBounds  -- also check getBoundsZoom(bounds, inside? bool)

        this.addInitialSymbols();

        console.log('again ' + this.mphmap.getCenter().lng + ' ' +  this.mphmap.getCenter().lat);
        // this.mphmapCenter = this.mphmap.getCenter();
        this.mphmap.on('mousemove', function(e) {
            this.onMouseMove(e);
        });
        this.mphmap.on('click', function(e) {
            this.onMapClick(e);
        });
        this.mphmap.on('zoomend', function() { // e) {
            if (this.userZoom === true) {
                this.setBounds('zoom', null);
            }
        });

        this.mphmap.on('moveend', function(e) {
            if (this.userZoom === true) {
                this.setBounds('pan', e.latlng);
            }
        });
        this.pusherEvtHandler = new PusherEventHandler(this.mlconfig.getMapNumber());
        console.log('Add pusher event handler for MapHosterGoogle ' + this.mlconfig.getMapNumber());

        this.pusherEvtHandler.addEvent('client-MapXtntEvent', this.retrievedBounds);
        this.pusherEvtHandler.addEvent('client-MapClickEvent',  this.retrievedClick);
    }


    getMapHosterName() {
        return 'hostName is ' + this.hostName;
    }
    getMap() {
        console.log('Asking MapHosterLeaflet to return a google maphoster');
        return null;
    }

    getEventDictionary() {
        const eventDct = this.pusherEvtHandler.getEventDct();
        return eventDct;
    }



    setUserName(name) {
        this.mlconfig.setUserName(name);
    }

    getGlobalsForUrl() {
        console.log(' MapHosterLeaflet.prototype.getGlobalsForUrl');
        console.log('&lon=' + this.cntrxG + '&lat=' + this.cntryG + '&zoom=' + this.zmG);
        return '&lon=' + this.cntrxG + '&lat=' + this.cntryG + '&zoom=' + this.zmG;
    }

    formatCoords(pos) {
        const fixed = this.utils.toFixedTwo(pos.lng, pos.lat, 5),
            formatted  = '<div style="color: blue;"">' + fixed.lon + ', ' + fixed.lat + '</div>';
        return formatted;
    }

    geoLocate(pos) {
        const latlng = L.latLng(pos.lat, pos.lng);
        this.popup
            .setLatLng(latlng)
            .setContent(this.formatCoords(pos))
            .openOn(this.mphmap);
        this.updateGlobals('geoLocate just happened', pos.lng, pos.lat, 15);
        this.mphmap.setView(latlng, 15);
        this.mphmap.panTo(latlng);
    }

    publishPosition(pos) {
        console.log('MapHosterLeaflet.publishPosition');
        let bnds: ImlBounds = null;
        // pos['maphost'] = 'Leaflet';
        console.log(pos);

        const lfltBounds = this.mphmap.getBounds();

        console.log(lfltBounds);
        if (lfltBounds) {
            const ne = lfltBounds.getNorthEast();
            const sw = lfltBounds.getSouthWest();

            this.bounds = lfltBounds;
            lfltBounds.xmin = sw.lng;
            lfltBounds.ymin = sw.lat;
            lfltBounds.xmax = ne.lng;
            lfltBounds.ymax = ne.lat;

            bnds = {llx: sw.lng, lly: sw.lat,
                         urx: ne.lng, ury: ne.lat, getCenter : null, getEsriExtent: null};
            this.mlconfig.setBounds(bnds);
        }

        const bndsUrl = this.mlconfig.getBoundsForUrl();
        pos.search += bnds;

        // MLInjector.injector.get(PusherclientService).publishPosition(pos);
    }

    getCenter() {
        const pos = { lon: this.cntrxG, lat: this.cntryG, zoom: this.zmG };
        console.log('return accurate center from getCenter()');
        console.log(pos);
        return pos;
    }


    removeEventListeners(destWnd) {
        const ctrlDiv = document.getElementsByClassName('leaflet-control-container')[0],
            paneDiv = document.getElementsByClassName('leaflet-map-pane')[0],
            mapDiv = document.getElementById('map_canvas');
        if (destWnd === 'Same Window') {
            this.mphmap.removeEventListener();
            ctrlDiv.remove();
            paneDiv.remove();
            mapDiv.classList.remove('leaflet-container');
            mapDiv.classList.remove('leaflet-fade-anim');
            mapDiv.classList.remove('map');
        }
    }

    getPusherEventHandler() {
        return this.pusherEvtHandler;
    }
}
