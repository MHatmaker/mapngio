import { Injectable, EventEmitter } from '@angular/core';

import { PusherConfig } from '../libs/PusherConfig';
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

export class PusherDetails {
  public pusher: any;
  public channelName: string;
  constructor(pusher: any, channelName: string){
    this.pusher = pusher;
    this.channelName = channelName;
  }
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
      private pusherDetails : PusherDetails;
      // private mph: null;
      // private pusher: Pusher;
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
          channelMashover: null, // PusherConfig.masherChannel(),
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
          this.statedata.prevChannel = this.statedata.channelMashover;
          console.log('preserve ' + this.statedata.prevChannel + ' from ' + this.statedata.channelMashover);
          this.statedata.userName = this.statedata.userName;
          console.log('preserve ' + this.statedata.prevUserName + ' from ' + this.statedata.userName);
      }

      restoreState() {
          console.log('restoreState');
          // this.statedata.whichDismiss = 'Accept';
          console.log('restore ' + this.statedata.channelMashover + ' from ' + this.statedata.prevChannel);
          this.statedata.channelMashover = this.statedata.prevChannel;
          console.log('restore ' + this.statedata.userName + ' from ' + this.statedata.prevChannel);
          this.statedata.userName = this.statedata.prevUserName;
      }

      onAcceptChannel() {
          console.log('onAcceptChannel ' + this.statedata.channelMashover);
          this.userName = this.statedata.userName;
          this.CHANNELNAME = this.statedata.channelMashover;
          this.statedata.clientName = this.clientName = 'map' + this.mapInstanceService.getNextSlideNumber();
          this.pusherConfig.setChannel(this.statedata.channelMashover);
          this.pusherConfig.setNameChannelAccepted(true);
          this.pusherConfig.setUserName(this.userName);
          // this.clients[this.clientName] = new PusherClient(null, this.clientName);
      }

      cancel() {
          this.restoreState();
      }

      traverseClients(evt, frame) {
          // for (const clientName in this.clients) {
          this.clients.forEach((client: PusherClient, clientName:string) => {
              if (client.eventHandlers.hasOwnProperty(evt)) {
                  client.eventHandlers[evt](frame);
              }
          });
      }

      getPusherDetails() : PusherDetails {
        return this.pusherDetails;
      }

      bindEvents(channel) {
          console.log('BIND to client-MapXtntEvent');

          channel.bind('client-MapXtntEvent',  (frame) => {
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

          channel.bind('client-MapClickEvent', (frame) => {
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

      }

      PusherChannel() {
          const // pusher,
              // APP_ID = '40938',
              APP_KEY = this.pusherConfig.getAppKey(),
              APP_SECRET = this.pusherConfig.getSecretKey();
          let
              channelName = this.pusherConfig.getPusherChannel(),
              chlength = channelName.length,
              channelsub = channelName.substring(1);
          console.log('PusherChannel ready to create channel');
          console.log(`AppKey: ${APP_KEY}, APP_SECRET ${APP_SECRET}`);
          // this.eventDct = eventDct;

          if (channelName[0] === '/') {
              chlength = channelName.length;
              channelsub = channelName.substring(1);
              channelsub = channelsub.substring(0, chlength - 2);
              channelName = channelsub;
          }

          this.CHANNELNAME = channelName.indexOf('presence-channel-') > -1 ? channelName : 'presence-channel-' + channelName;
          console.log('with channel name ' + this.CHANNELNAME);

          console.log('getMapLinkrSvrPath is ' + this.pusherConfig.getMapLinkrSvrPath() + '/pusher/auth');
          const pusher = new Pusher(APP_KEY, {
              authTransport: 'jsonp',
              // cluster: 'mt1',
              authEndpoint: this.pusherConfig.getMapLinkrSvrPath() + '/pusher/auth', //  + '&channeldata={username: foo}',
              // authEndpoint: this.pusherConfig.getMapLinkrSvrPath() + '/pusher/auth', // 'http://linkr622-arcadian.rhcloud.com/',
              clientAuth: {
                  key: APP_KEY,
                  secret: APP_SECRET
                  // user_id: USER_ID,
                  // user_info: {}
              },
              // auth: {params: {user_id: this.userName}}
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

          this.pusherDetails = new PusherDetails(pusher, this.CHANNELNAME);

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
/*
          this.channel.bind('client-PollTourClients', (name: string) => {
            console.log('received request for client-PollTourClients');
            this.respondTourClientPoll(name);
          });

*/
          this.channel.bind('client-RefreshTourClients', (name: string) => {
            console.log('frame for client-RefreshTourClients is ', name);
            this.refreshTourClients(name);
          });
          this.channel.bind('client-SetTourGuide', (frame: ITourGuide) => {
            console.log('frame for client-SetTourClients is ', frame);
            this.setCurrentTourGuide(frame);
          });

          this.channel.bind('pusher:subscription_error', (statusCode) => {
              // alert('Problem subscribing to 'private-channel': ' + statusCode);
              console.log('Problem subscribing to "channel": ' + statusCode);
          });
          this.channel.bind('pusher:subscription_succeeded',  (data) => {
              console.log('Successfully subscribed to ' + this.CHANNELNAME); // + 'r'');
              console.log(data);
              this.userName = data.myID;
              // this.pollTourClients();
          });
          this.channel.bind('pusher:member_removed', (member) => {
            alert('member removed ' + member.id);
          })
      }
      createPusherClient(mlcfg: MLConfig, nfo): PusherClient {
          console.log('pusherClientService.createPusherClient');
          const
              mapHoster = mlcfg.getMapHosterInstance(),
              clientName = 'map' + this.pusherConfig.getUserName() + mlcfg.getMapNumber();

          this.mapNumber = mlcfg.getMapNumber();

          this.info = nfo;
          console.log('createPusherClient for map ' + clientName);
          this.clients.set(clientName,new PusherClient(mapHoster.getEventDictionary(), clientName, this.userName, this.mapNumber));

          this.bindEvents(this.channel);
          // this.tourClients.add(this.userName);

          return this.clients[clientName];
      }

      createHiddenPusherClient(evtDct: IEventDct) {
          this.clients.set('hiddenmap', new PusherClient(evtDct, 'hiddenmap', 'hiddenmap', 99));
          this.PusherChannel();
          this.bindEvents(this.channel);
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

  addToTouristList(member: string) {
    this.tourClients.add(member);
    this.channel.trigger('client-RefreshTourClients', this.userName);
  }

  pollTourClients() {
    console.log('trigger client-PollTourClients');
    this.channel.trigger('client-PollTourClients', this.userName);
  }

  respondTourClientPoll(name: string) {
    console.log('respondTourClients: trigger client-RefreshTourClients with new name ' + name);
    console.log(this.tourClients);
    if (name !== '') {
      this.tourClients.add(name);
    }
    console.log(this.tourClients);
    if (this.tourClients.size) {
      this.channel.trigger('client-RefreshTourClients', this.userName);
    }
  }

  refreshTourClients(name: string) {
    console.log('refreshTourClients from ');
    console.log(this.tourClients);
    console.log('add new tourist ');
    console.log(name);

    if (name !== '') {
      this.tourClients.add(name);
      // console.log(value);
      console.log('refreshed ...');
      this.touristsUpdated.emit(this.tourClients);
    }
  }

  getTouristList(): IterableIterator<string> {
    // this.touristsUpdated.emit(this.tourClients);
    this.channel.members.each((member) => {
      this.tourClients.add(member.info.name);
    });
    this.tourClients.add(this.channel.members.me.id);
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
      this.clients.forEach((client: PusherClient, clName: string) => {
          if (client.hasOwnProperty('eventHandlers')) {
            const obj = client.eventHandlers;
            console.log('publish pan event to map ' + client.eventHandlers);
            if (obj) {
              obj['client-MapXtntEvent'](frame);
            }
        }
      });
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
