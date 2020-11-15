import {
    Injectable,
} from '@angular/core';
import { Utils } from './utils';

export interface IPusherConfigParams {
      channelMashover: string;
      prevChannel: string;
      userName: string;
      prevUserName: string;
      whichDismiss: string;
}

export interface IPusherConfig {
    details: {
        masherChannel: string,
        masherChannelInitialized: boolean,
        nameChannelAccepted: boolean,
        userName: string,
        userId: string,
        mapLinkrSvrPathPre: string,
        // mapLinkrSvrPathNgrok:'maplinkroc3-maplinkr.7e14.starter-us-west-2.openshiftapps.com', //'c1232bf1',
        mapLinkrSvrPathNgrok: string,
        mapLinkrSvrPathPost: string,
        search: string,
        query: string
    };
}

@Injectable()
export class PusherConfig implements IPusherConfig {
    details = {
        masherChannel: 'presence-channel-mashchannel',
        masherChannelInitialized: false,
        nameChannelAccepted: false,
        userName: 'defaultuser',
        userId: 'uidnone',
        mapLinkrSvrPathPre: 'https://',
        // mapLinkrSvrPathNgrok:'maplinkroc3-maplinkr.7e14.starter-us-west-2.openshiftapps.com', //'c1232bf1',
        mapLinkrSvrPathNgrok: 'c5d33cd44ac4.ngrok.io', // 'smppushmaplinkrsrv.herokuapp.com',
        mapLinkrSvrPathPost: '', // '.ngrok.io',
        search: '/',
        query: ''
    };
    private APP_ID: string;
    private APP_KEY: string;
    private APP_SECRET: string;
    private hasPusherKeys = false;
    constructor(private utils: Utils) {
        console.log('entering PusherConfig');
    }

    getChannelFromUrl(): string {
        this.details.masherChannel = this.utils.getParameterByName('channel', this.details.search);
        this.details.masherChannelInitialized = true;
        return this.details.masherChannel;
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
    setChannel(chnl: string) {
        if (this.details.masherChannelInitialized === false) {
            this.details.masherChannelInitialized = true;
        }
        this.details.masherChannel = chnl;
    }
    masherChannel(newWindow: boolean): string {
        // alert(getParameterByName('channel'));
        // alert(this.details.masherChannel);
        return newWindow ? this.utils.getParameterByName('channel', this.details.search) : this.details.masherChannel;
    }
    getPusherChannel(): string {
        return this.details.masherChannel;
    }
    getUserName(): string {
        return this.details.userName;
    }
    setUserName(name: string) {
        this.details.userName = name;
    }
    setUserId(uid: string) {
        this.details.userId = uid;
    }
    getUserId(): string {
        return this.details.userId;
    }
    getBoundsFromUrl() {
        const llx = this.utils.getParameterByName('llx', this.details.search),
            lly = this.utils.getParameterByName('lly', this.details.search),
            urx = this.utils.getParameterByName('urx', this.details.search),
            ury = this.utils.getParameterByName('ury', this.details.search);
        return {llx, lly, urx, ury};
    }
    getMapLinkrSvrPath(): string {
        const path = this.details.mapLinkrSvrPathPre + this.details.mapLinkrSvrPathNgrok + this.details.mapLinkrSvrPathPost;
        console.log('Pusher ngrok path is ' + path);
        return path;
    }
    getQueryFromUrl() {
        const query = this.utils.getParameterByName('gmquery', this.details.search);
        return query;
    }
    getQuery(): string {
        return this.details.query;
    }
    setSearch(searchDetails: string) {
        this.details.search = searchDetails;
        this.details.query = this.getQueryFromUrl();
    }
    setPusherKeys(keys) {
      this.APP_ID = keys.appid;
      this.APP_KEY = keys.appkey;
      this.APP_SECRET = keys.appsecret;
      this.hasPusherKeys = true;
    }

    getAppKey(): string {
        return this.APP_KEY;
    }
    getSecretKey(): string {
        return this.APP_SECRET;
    }
    pusherKeysAvailable(): boolean {
      return this.hasPusherKeys;
    }
}
