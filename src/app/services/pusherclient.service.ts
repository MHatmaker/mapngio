import { Injectable, EventEmitter } from '@angular/core';

import {  PusherConfig } from '../libs/PusherConfig';
import { MapinstanceService } from './mapinstance.service';
import { MLConfig } from '../libs/MLConfig';
// import { Pusher } from 'pusher-client';
// import Pusher from 'pusher-js';
import { IEventDct } from '../libs/PusherEventHandler';
import { MapopenerService } from './mapopener.service';
import { IMapShare } from './positionupdate.interface';
// declare const Pusher: any;
import * as _ from 'underscore';
declare const Pusher: any;

interface ITourGuide {
  name: string;
  myname: string;
  thisClient: boolean;
}

class PusherClient {
    public eventHandlers: IEventDct; // = new Map<string, IEventDct>();
    public clientName: string;
    public userName: string;
    public mapNumber: number;
    constructor(evtDct: IEventDct, clientName: string, userName: string, mapNumber: number) {
        this.eventHandlers = evtDct;
        this.clientName = clientName;
        this.userName = userName;
        this.mapNumber = mapNumber;
    }
}
@Injectable({
  providedIn: 'root'
})
export class PusherclientService {
      // private ndx: number;
      // private evtDct: {};
      // private data: IPusherConfigParams;
      private userName = '';
      private channel: any = null;
      private CHANNELNAME = '';
      // private mph: null;
      // private pusher: Pusher;
      private callbackFunction: null;
      private info: null;
      // private isInitialized: false;
      // private pusherClient: null;
      // private isInstantiated: false;
      // private serverUrl: string = 'https://smppushmaplinkrsrv.herokuapp.com/';
      private clients: Map<string, PusherClient> = new Map<string, PusherClient>();
      private eventHandlers: Map<string, IEventDct>;
      private mapNumber: number;
      private clientName: string;
      private tourClients: Set<string> = new Set<string>();
      public touristsUpdated = new EventEmitter();
      private currentTourGuide: string;

      private statedata = {
          privateChannelMashover: null, // PusherConfig.masherChannel(),
          prevChannel: 'mashchannel',
          userName: this.userName,
          prevUserName: this.userName,
          whichDismiss: 'Cancel',
          clientName: ''
      };

      constructor(
          private pusherConfig: PusherConfig,
          private mapInstanceService: MapinstanceService,
          private mapOpener: MapopenerService
        ) {
      }

      preserveState() {
          console.log('preserveState');
          // $scope.data.whichDismiss = 'Cancel';
          this.statedata.prevChannel = this.statedata.privateChannelMashover;
          console.log('preserve ' + this.statedata.prevChannel + ' from ' + this.statedata.privateChannelMashover);
          this.statedata.userName = this.statedata.userName;
          console.log('preserve ' + this.statedata.prevUserName + ' from ' + this.statedata.userName);
      }

      restoreState() {
          console.log('restoreState');
          // this.statedata.whichDismiss = 'Accept';
          console.log('restore ' + this.statedata.privateChannelMashover + ' from ' + this.statedata.prevChannel);
          this.statedata.privateChannelMashover = this.statedata.prevChannel;
          console.log('restore ' + this.statedata.userName + ' from ' + this.statedata.prevChannel);
          this.statedata.userName = this.statedata.prevUserName;
      }

      onAcceptChannel() {
          console.log('onAcceptChannel ' + this.statedata.privateChannelMashover);
          this.userName = this.statedata.userName;
          this.CHANNELNAME = this.statedata.privateChannelMashover;
          this.statedata.clientName = this.clientName = 'map' + this.mapInstanceService.getNextSlideNumber();
          this.pusherConfig.setChannel(this.statedata.privateChannelMashover);
          this.pusherConfig.setNameChannelAccepted(true);
          this.pusherConfig.setUserName(this.userName);
          // this.clients[this.clientName] = new PusherClient(null, this.clientName);
      }

      cancel() {
          this.restoreState();
      }

      traverseClients(evt, frame) {
          for (const clientName in this.clients) {
            if (this.clients[clientName]) {
                  const client = this.clients[clientName];
                  if (client.eventHandlers.hasOwnProperty(evt)) {
                      client.eventHandlers[evt](frame);
                  }
              }
          }
      }

      PusherChannel(chnl) {
          const // pusher,
              // APP_ID = '40938',
              APP_KEY = this.pusherConfig.getAppKey(),
              APP_SECRET = this.pusherConfig.getSecretKey();
          let
              channel = chnl,
              chlength = channel.length,
              channelsub = channel.substring(1);
          console.log('PusherChannel ready to create channel');
          console.log(`AppKey: ${APP_KEY}, APP_SECRET ${APP_SECRET}`);
          // this.eventDct = eventDct;

          if (channel[0] === '/') {
              chlength = channel.length;
              channelsub = channel.substring(1);
              channelsub = channelsub.substring(0, chlength - 2);
              channel = channelsub;
          }

          this.CHANNELNAME = channel.indexOf('private-channel-') > -1 ? channel : 'private-channel-' + channel;
          console.log('with channel ' + this.CHANNELNAME);

          console.log('PusherPath is ' + this.pusherConfig.getPusherPath() + '/pusher/auth');
          const pusher = new Pusher(APP_KEY, {
              authTransport: 'jsonp',
              authEndpoint: this.pusherConfig.getPusherPath() + '/pusher/auth', // 'http://linkr622-arcadian.rhcloud.com/',
              clientAuth: {
                  key: APP_KEY,
                  secret: APP_SECRET,
                  // user_id: USER_ID,
                  // user_info: {}
              }
          });

          pusher.connection.bind('state_change', (state) => {
              if (state.current === 'connected') {
                  // alert('Yipee! We've connected!');
                  console.log('Yipee! We"ve connected!');
              } else {
                  // alert('Oh-Noooo!, my Pusher connection failed');
                  console.log('Oh-Noooo!, my Pusher connection failed');
              }
          });
          console.log('Pusher subscribe to channel ' + this.CHANNELNAME);
          this.channel = pusher.subscribe(this.CHANNELNAME);

          this.channel.bind('client-NewUrlEvent', (frame) => {
              console.log('frame is', frame);
              // eventDct['client-NewUrlEvent'](frame);
              console.log('currently unsupported NewUrlEvent');
          });

          this.channel.bind('client-NewMapPosition', (frame: IMapShare) => {
              console.log('frame is', frame);
              console.log('Open slide on NewMapPosition Event');
              this.mapOpener.openMap.emit(frame);
              // this.testShare.testShare.emit(frame);
          });

          this.channel.bind('client-PollTourClients', (frame) => {
            console.log('received request for client-PollTourClients');
            this.respondTourClientPoll();
          });

          this.channel.bind('client-RefreshTourClients', (frame) => {
            console.log('frame for client-RefreshTourClients is ', frame);
            this.refreshTourClients(frame);
          });

          this.channel.bind('client-SetTourGuide', (frame: ITourGuide) => {
            console.log('frame for client-SetTourClients is ', frame);
            this.setCurrentTourGuide(frame);
          });

          console.log('BIND to client-MapXtntEvent');

          this.channel.bind('client-MapXtntEvent',  (frame) => {
              console.log('frame is', frame);
              // frame might already have lat, lon, zoom, rather than x, y, z properties
              if (frame.hasOwnProperty('x')) {
                  frame.lat = frame.y;
                  frame.lon = frame.x;
                  frame.zoom = frame.z;
              }
              this.traverseClients('client-MapXtntEvent', frame);

              console.log('back from boundsRetriever');
          });

          this.channel.bind('client-MapClickEvent', (frame) => {
              console.log('frame is', frame);
              // frame might already have lat, lon, zoom, rather than x, y, z properties
              if (frame.hasOwnProperty('x')) {
                  frame.lat = frame.y;
                  frame.lon = frame.x;
                  frame.zoom = frame.z;
              }
              this.traverseClients('client-MapClickEvent', frame);
              // for (handlerkey in this.eventHandlers) {
              //     if (this.eventHandlers.hasOwnProperty(handlerkey)) {
              //         obj = this.eventHandlers[handlerkey];
              //         obj['client-MapClickEvent'](frame);
              //     }
              // }
              console.log('back from clickRetriever');
          });

          this.channel.bind('pusher:subscription_error', (statusCode) => {
              // alert('Problem subscribing to 'private-channel': ' + statusCode);
              console.log('Problem subscribing to "private-channel": ' + statusCode);
          });
          this.channel.bind('pusher:subscription_succeeded',  () => {
              console.log('Successfully subscribed to ' + this.CHANNELNAME); // + 'r'');
              this.pollTourClients();
          });
      // this.PusherChannel(this.pusherConfig.getPusherChannel());

      // PusherClient(evtDct, clientName) {
      //     this.eventHandlers[clientName] = evtDct;
      // }
      }
      createPusherClient(mlcfg, cbfn, nfo): PusherClient {
          console.log('pusherClientService.createPusherClient');
          const
              mapHoster = mlcfg.getMapHosterInstance(),
              clientName = 'map' + this.pusherConfig.getUserName() + mlcfg.getMapNumber();

          this.CHANNELNAME = this.pusherConfig.getPusherChannel();
          this.userName = this.pusherConfig.getUserName();
          this.mapNumber = mlcfg.getMapNumber();

          this.callbackFunction = cbfn;
          this.info = nfo;
          console.log('createPusherClient for map ' + clientName);
          this.clients[clientName] = new PusherClient(mapHoster.getEventDictionary(), clientName, this.userName, this.mapNumber);
          this.PusherChannel(this.CHANNELNAME);
          this.tourClients.add(this.userName);

          return this.clients[clientName];
      }

      createHiddenPusherClient(evtDct: IEventDct) {
          this.CHANNELNAME = this.pusherConfig.getPusherChannel();
          this.clients.set('hiddenmap', new PusherClient(evtDct, 'hiddenmap', 'hiddenmap', 99));
          this.PusherChannel(this.CHANNELNAME);
      }

      setupPusherClient(resolve, reject) {
          // var promise;
          this.userName = this.pusherConfig.getUserName();
  /*
          promise = this.getPusherDetails();
          return promise.then(function (response) {
              console.log('getPusherDetails resolve response ' + response);
              resolve(response);
              return promise;
          }, function (error) {
              console.log('getPusherDetails error response ' + error);
              return error;
          });
          */
          // return promise;
          // this.displayPusherDialog();
      }

  getPusherChannel() {
      const promise = new Promise(function(resolve, reject) {
          const result = this.setupPusherClient(resolve, reject);
          console.log('getPusherChannel returns ' + result);
      });
      return promise;
  }

  pollTourClients() {
    console.log('trigger client-PollTourClients');
    const frame = new Set<string>();
    const jts = JSON.stringify([...frame.values()]);
    this.channel.trigger('client-PollTourClients', jts);
    // this.respondTourClientPoll();
  }

  respondTourClientPoll() {
    console.log('respondTourClients: trigger client-RefreshTourClients');
    console.log(this.tourClients);
    const tc = JSON.stringify([...this.tourClients.values()]);
    console.log(tc);
    if (this.tourClients.size) {
      this.channel.trigger('client-RefreshTourClients', tc);
    }
  }

  refreshTourClients(tc: IterableIterator<string>) {
    console.log('refreshTourClients from ');
    console.log(this.tourClients);
    console.log('add new tourist ');
    console.log(tc);
    const ts = new Set<string>(tc);
    // const tc = JSON.parse(tcs);
    // tc.forEach((value: string) => {
    if (ts.size) {
      for (const value of ts) {
        this.tourClients.add(value);
        // console.log(value);
      }
      console.log('refreshed ...');
      console.log(this.tourClients);
    }
    this.touristsUpdated.emit(this.tourClients);
  }

  getTouristList(): IterableIterator<string> {
    this.touristsUpdated.emit(this.tourClients);
    return this.tourClients.values();
  }

  setCurrentTourGuide(tourist: ITourGuide) {
    this.currentTourGuide = tourist.name;
    if (tourist.thisClient === true) {
      tourist.thisClient = false;
      this.channel.trigger('client-SetTourGuide', tourist);
    } else {
      alert('Tour guide is now ' + tourist.name);
    }
  }

  updateCurrentTourGuide(name: string) {
    console.log('updateCurrentTourGuide, name is ' + name);
    this.currentTourGuide = name;
    // alert(name);
    this.setCurrentTourGuide({name, myname: this.userName, thisClient: true});
  }

  publishPanEvent(frame) {
      console.log('frame is', frame);
      if (frame.hasOwnProperty('x')) {
          frame.lat = frame.y;
          frame.lon = frame.x;
          frame.zoom = frame.z;
      }
      for (const clName in this.clients) {
        if (this.clients.hasOwnProperty(clName)) {
          const client = this.clients[clName];
          // for (handler in this.clients.  eventHandlers) {
          if (client.hasOwnProperty('eventHandlers')) {
            const obj = client.eventHandlers;
            console.log('publish pan event to map ' + client.eventHandlers);
            if (obj) {
              obj['client-MapXtntEvent'](frame);
            }
        }
        // if (this.eventHandlers.hasOwnProperty(handler)) {
        //     obj = this.eventHandlers[handler];
        //     console.log('publish pan event to map ' + this.eventHandlers[handler]);
        //     if (obj) {
        //         obj['client-MapXtntEvent'](frame);
        //     }
        // }
      }}
      if (this.userName === this.currentTourGuide ) {
        this.channel.trigger('client-MapXtntEvent', frame);
      }
      // this.pusher.channels[this.CHANNELNAME].trigger('client-MapXtntEvent', frame);
  }
  publishClickEvent(frame) {
      console.log(`publishClickEvent: frame for frame.mapId - ${frame.mapId} , referrerId - ${frame.referrerId}
          popId - ${frame.popId}`);
      console.log(frame);
      if (frame.hasOwnProperty('x')) {
          frame.lat = frame.y;
          frame.lon = frame.x;
          frame.zoom = frame.z;
      }
      const keys = Array.from(this.clients.keys());
      const withoutHidden = _.without(keys, 'hiddenmap');  // this.clients.get('hiddenmap'));
      console.log(withoutHidden);
      const withoutSubmitter = _.without(withoutHidden, this.clients[frame.mapId]);
      console.log(withoutSubmitter);
      const withoutPopId = _.without(withoutSubmitter, this.clients[frame.popId]);
      console.log(withoutPopId);
      _.each(withoutPopId, (client) => {
          const testId = client.userName + client.mapNumber;
          console.log(`client is clientName ${client.clientName}, userName ${client.userName}, testId ${testId}`);
          if (testId !== frame.referrerId) {
            if (client.hasOwnProperty('eventHandlers')) {
                const obj = client.eventHandlers;
                console.log('publish shared click event to map ' + client.clientName);
                obj['client-MapClickEvent'](frame);
            }
          }
      });

      // for (clName in this.clients) {
      //     if(!((clName === frame.mapId) || (clName === 'hiddenmap'))){
      //       client = this.clients[clName];
      //       console.log(`client is clientName ${client.clientName} userName ${client.userName}`);
      //       if(client.userName !== frame.referrerId){
      //           if (client.hasOwnProperty('eventHandlers')) {
      //               obj = client.eventHandlers;
      //               console.log('publish shared click event to map ' + client.clientName);
      //               obj['client-MapClickEvent'](frame);
      //           }
      //         }
      //   }
      // }
      if (this.userName === this.currentTourGuide ) {
        this.channel.trigger('client-MapClickEvent', frame);
    }
      // this.pusher.channels(this.CHANNELNAME).trigger('client-MapClickEvent', frame);
  }

  publishPosition(pos: string) {
      // var handler, client: PusherClient,
      //     clName,
      //     obj;
      // for (clName in this.clients) {
      //     client = this.clients[clName];
      //     if (client.hasOwnProperty('eventHandlers')) {
      //         obj = client.eventHandlers;
      //         console.log('publish position event to map ' + client.eventHandlers);
      //         obj['client-NewMapPosition'](pos);
      //     }
      // }
      this.channel.trigger('client-NewMapPosition', pos);
    }
}
