/*global angular, console, define, document, HostConfig, require, alert */
/*jslint unparam: true*/
import {
    Injectable
} from '@angular/core';
import { PusherConfig } from './PusherConfig';
import { Utils } from './utils';
import { MapLocOptions } from '../services/positionupdate.interface';
import { IMapShare } from '../services/positionupdate.interface';
import { EMapSource } from '../services/configparams.service';
import { HttpClient } from '@angular/common/http';
// import { MapLocOptions, MapLocCoords } from '../../../services/positionupdate.interface';
// import { IPosition } from '../../../services/position.service'

console.log('loading HostConfig');

interface IUserName {
  id: string;
  name: string;
}
interface IPusherkeys {
  pusherkeys: {
    appid: string;
    appkey: string;
    appsecret: string;
  };
}

export interface IPositionStr {
    lat: string;
    lon: string;
    zoom: string;
    webmapId: string;
    mapType: string;
}

export interface IHostConfigDetails {
    details: {
        webmapId: string;
        lat: string;
        lon: string;
        zoom: string;
        masherChannel: string;
        masherChannelInitialized: boolean;
        nameChannelAccepted: boolean;
        protocol: string;
        host: string;
        hostport: string;
        href: string;
        userName: string;
        userId: string;
        search: string;
        referrerName: string;
        referrerId: string;
        locationPath: string;
        url: string;
        isInitialUser: boolean;
        mapType: string;
        query: string;
        startupQuery: IMapShare;
        mapHost: any;
    };
}

@Injectable()
export class HostConfig implements IHostConfigDetails {
    public details = {
        webmapId: '',
        lat: '',
        lon: '',
        zoom: '',
        nginj: null,
        masherChannel: 'private-channel-mashchannel',
        masherChannelInitialized: false,
        nameChannelAccepted: false,
        protocol: 'http',
        host: '', // 'http://localhost';
        hostport: '3035',
        href: '', // 'http://localhost';
        userName: 'defaultuser',
        userId: '',
        search: '',
        referrerName: '',
        referrerId: '',
        locationPath: '',
        url: '',
        isInitialUser: false,
        mapType: '',
        query: '',
        startupQuery: null,
        mapHost: null
    };
    public nextWindowName = 'mishmash';
    public smallFormDimensions: { 'top': 1, 'left': 1, 'width': 450, 'height': 570};

    constructor(private pusherConfig: PusherConfig, private utils: Utils, private http: HttpClient) {
            console.log('HostConfig ctor');
    }

    masherChannel(newWindow: boolean): string {
        // alert(this.getParameterByName('channel'));
        // alert(this.details.masherChannel);
        return newWindow ? this.utils.getParameterByName('channel', this.details.masherChannel) :
        this.details.masherChannel;
    }
    getChannelFromUrl(): string {
        this.details.masherChannel = this.utils.getParameterByName('channel', this.details.search);
        this.details.masherChannelInitialized = true;
        return this.details.masherChannel;
    }
    setChannel(chnl: string) {
        if (this.details.masherChannelInitialized === false) {
            this.details.masherChannelInitialized = true;
        }
        this.details.masherChannel = chnl;
    }
    isChannelInitialized(): boolean {
        return this.details.masherChannelInitialized;
    }

    setNameChannelAccepted(tf: boolean) {
        if (this.details.nameChannelAccepted === false) {
            this.details.nameChannelAccepted = true;
        }
        this.details.nameChannelAccepted = tf;
    }
    isNameChannelAccepted(): boolean {
        return this.details.nameChannelAccepted;
    }
    getWebmapId(newWindow: boolean): string {
        let result = '';
        if (newWindow === true) {
            result = this.utils.getParameterByName('id', this.details.search);
            if (result === '') {
                result = this.details.webmapId;
            }
        } else {
            result = this.details.webmapId;
        }
        return result;
    }
    setLocationPath(locPath: string) {
        this.details.locationPath = locPath;
    }
    getLocationPath(): string {
        return this.details.locationPath;
    }
    setSearch(searchdetails: string) {
        this.details.search = searchdetails;
        this.details.query = this.getQueryFromUrl();
        // if (this.details.webmapId != '') {
        //     this.details.mapHost = 'arcgis';
        // }
    }
    getSearch(): string {
        return this.details.search;
    }
    setprotocol(p: string) {
        this.details.protocol = p;
        console.log('protocol: ' + this.details.protocol);
    }
    getprotocol(): string {
        return this.details.protocol;
    }
    sethostport(hp: string) {
        this.details.hostport = hp;
        console.log('hostport: ' + this.details.hostport);
    }
    gethostport(): string {
        return this.details.hostport;
    }
    sethref(hrf: string) {
        console.log('sethref: ' + hrf);
        this.details.href = hrf;
        console.log('this.details href: ' + this.details.href);
    }
    gethref(): string {
        const pos = this.details.href.indexOf('/arcgis');
        if (pos  > -1) {
            return this.details.href; // .substring(0, pos);
        }
        return this.details.href;
    }
    setWebmapId(id: string) {
        console.log('Setting webmapId to ' + id);
        this.details.webmapId = id;
    }
    getUserName(): string {
        return this.details.userName;
    }
    getUserNameFromUrl(): string {
        this.details.userName = this.utils.getParameterByName('userName', this.details.search);
        return this.details.userName;
    }
    setUserName(name: string) {
        this.details.userName = name;
    }
    getUserId(): string {
        return this.details.userId;
    }
    setUserId(id: string) {
        this.details.userId = id;
    }
    getReferrerId(): string {
        return this.details.referrerId;
    }
    getReferrerIdFromUrl(): string {
        this.details.referrerId = this.utils.getParameterByName('referrerId', this.details.search);
        return this.details.referrerId;
    }
    setReferrerId(id: string) {
        this.details.referrerId = id;
    }
    getReferrerNameFromUrl(): string {
        this.details.referrerName = this.utils.getParameterByName('referrerName', this.details.search);
        return this.details.referrerName;
    }
    async getUserNameFromServer() {
      console.log('await in hostConfig.getUserNameFromServer');
      const response = await this.http.get<IUserName>(this.pusherConfig.getPusherPath() + '/username').toPromise();
      const retval = response; // .  json();
      console.log('simpleserver returns');
      const userName = retval.name;
      console.log(userName);
      this.pusherConfig.setUserName(userName);
      this.setUserName(userName);
      const userId = retval.id;
      console.log(userId);
      this.pusherConfig.setUserId(userId);
      // this.setIDsAndNames();

      console.log('return from hostConfig.getUserNameFromServer');
      return retval;
    }

    async getPusherKeys() {
      console.log('await in hostConfig.getPusherKeys');
      const timeStamp = Date.now();

      this.http.get<IPusherkeys>(this.pusherConfig.getPusherPath() +
      '/pusherkeys' + '?tsp=' + timeStamp).subscribe(data  => {
        const pks = data;
        //   appid: data.appid,
        //   appkey: data.appkey,
        //   appsecret: data.appsecret
        // }
        console.log(pks.pusherkeys);
        console.log('return from hostConfig.getPusherKeys');
        this.pusherConfig.setPusherKeys(pks.pusherkeys);
        return pks;
      });
    }

    // getUserNameFromServer($http, opts): void {
    //     console.log(this.pusherConfig.getPusherPath());
    //     var pusherPath = this.pusherConfig.getPusherPath() + '/username';
    //     console.log('pusherPath in getUserNameFromServer');
    //     console.log(pusherPath);
    //     $http(
    //         {
    //             method: 'GET',
    //             url: pusherPath,
    //             withCredentials: true,
    //             headers: {
    //                 'Content-Type': 'application/json; charset=utf-8'
    //             }
    //         }).
    //         success(function (data, status, headers, config) {
    //             // this callback will be called asynchronously
    //             // when the response is available.
    //             console.log('ControllerStarter getUserName: ', data.name);
    //             if (opts.uname) {
    //                 this.pusherConfig.setUserName(data.name);
    //             }
    //             // alert('got user name ' + data.name);
    //             if (opts.uid) {
    //                 this.pusherConfig.setUserId(data.id);
    //             }
    //             if (opts.refId === -99) {
    //                 this.pusherConfig.setReferrerId(data.id);
    //             }
    //         }).
    //         error(function (data, status, headers, config) {
    //                 // called asynchronously if an error occurs
    //                 // or server returns response with an error status.
    //             console.log('Oops and error', data);
    //             alert('Oops' + data.name);
    //         });
    // }
    getNextWindowName() {
        const nextNum = this.utils.getRandomInt(100, 200),
            nextName = this.nextWindowName + nextNum;
        return nextName;
    }
    getSmallFormDimensions() {
        const d = this.smallFormDimensions,
            ltwh = `top=${d.top}, left=$d.left1}, height=${d.height},width=${d.width}`;
        return ltwh;
    }
    testUrlArgs(): boolean {
        const rslt = this.utils.getParameterByName('id', this.details.search);
        // alert('this.getParameterByName('id') = ' + rslt);
        // alert(rslt.length);
        // alert(rslt.length != 0);

        console.log('this.getParameterByName("id") = ' + rslt);
        console.log(rslt.length);
        console.log(rslt.length !== 0);
        return rslt.length !== 0;
    }

    setUrl(u: string) {
        this.details.url = u;
    }
    getUrl(): string {
        return this.details.url;
    }
    sethost(h: string) {
        this.details.host = h;
        console.log('host: ' + this.details.host);
    }
    gethost(): string {
        return this.details.host;
    }
    setInitialUserStatus(tf: boolean) {
        this.details.isInitialUser = tf;
    }
    getInitialUserStatus(): boolean {
        return this.details.isInitialUser;
    }
    hasCoordinates(): boolean {
        const result = this.utils.getParameterByName('zoom', this.details.search);
        return result === '' ? false : true;
    }
    lon(): string {
        return this.utils.getParameterByName('lon', this.details.search);
    }
    lat(): string {
        return this.utils.getParameterByName('lat', this.details.search);
    }
    zoom(): string {
        return this.utils.getParameterByName('zoom', this.details.search);
    }
    setPosition(position: IPositionStr) {
        this.details.lon = position.lon;
        this.details.lat = position.lat;
        this.details.zoom = position.zoom;
    }
    getPosition(): IPositionStr {
        return {webmapId: this.details.webmapId, mapType: this.details.mapType,
        lon: this.details.lon, lat: this.details.lat, zoom: this.details.zoom};
    }

    setStartupQuery(query: IMapShare) {
        this.details.startupQuery = query;
    }
    getStartupQuery(): IMapShare {
        return this.details.startupQuery;
    }
    assembleStartupQuery(): IMapShare {
      const bnds = this.getBoundsFromUrl();
      const lng = +this.lon();
      const lat = +this.lat();
      const zoom = +this.zoom();
      const opts = {center: {lng, lat}, zoom, places: null, query: this.getQuery()} as MapLocOptions;
      this.details.startupQuery = {mapLocOpts: opts, userName: this.getUserName(), mlBounds: bnds,
          source: EMapSource.urlgoogle, webmapId: '-99'} as IMapShare;
      return this.details.startupQuery;
    }

    setQuery(q: string) {
        this.details.query = q;
    }
    getQuery(): string {
        return this.details.query;
        // return this.getParameterByName('gmquery', this.details.search);
    }
    getQueryFromUrl(): string {
        const query = this.utils.getParameterByName('gmquery', this.details.search);
        this.details.query = query;
        return query;
    }
    getBoundsFromUrl()  {
        const llx = +this.utils.getParameterByName('llx', this.details.url),
            lly = +this.utils.getParameterByName('lly', this.details.url),
            urx = +this.utils.getParameterByName('urx', this.details.url),
            ury = +this.utils.getParameterByName('ury', this.details.search);
        return {llx, lly, urx, ury};
    }
    getbaseurl(): string {
        const baseurl = this.details.host + '/'; // this.details.protocol + '//' + this.details.host + '/';
        console.log('getbaseurl --> ' + baseurl);
        return baseurl;
    }
    showConfig(msg: string) {
        console.log(msg);
        console.log(
            'isInitialUser: ' + this.details.isInitialUser + '\n',
            'userId: '  + this.details.userId + ', userName ' + this.details.userName + '\n' +
            'referrerId: '  + this.details.referrerId + '\n' +
            'locationPath: '  + this.details.locationPath + '\n' +
            'host: '  + this.details.host + '\n' +
            'hostport: '  + this.details.hostport + '\n' +
            'href: '  + this.details.href + '\n'  +
            'search: '  + this.details.search + '\n' +
            'maphost: '  + this.details.mapHost + '\n' +
            'webmapId: '  + this.details.webmapId + '\n' +
            'masherChannel: '  + this.pusherConfig.masherChannel(false) + '\n' +
            'lon :' + this.details.lon + '\n' +
            'lat: ' + this.details.lat + '\n' +
            'zoom: ' + this.details.zoom
        );
    }
}
