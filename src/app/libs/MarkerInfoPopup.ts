
import { InfopopService } from '../services/infopop.service';
import { PopoverController } from '@ionic/angular';
// import { PophandlerProvider } from '../../../providers/pophandler/pophandler';
import { InfopopComponent } from '..//components/infopop/infopop.component';
import { v4 as uuid } from 'uuid';
import { MLInjector } from './MLInjector';
import { Utils } from './utils';
import { PusherConfig } from './PusherConfig';
import { GeocodingService, OSMAddress } from '../services/geocoding.service';
import { PusherclientService } from '../services/pusherclient.service';
import { MapHosterGoogle } from '../libs/MapHosterGoogle';

// import { } from 'googlemaps';
// import { google } from 'googleapis';

// declare var google;


export class MarkerInfoPopup {
    public popOver: HTMLElement;
    private popContent: string;
    private popTitle: string;
    private popId: string;
    private popMarker: google.maps.Marker;
    private utils: any;
    private pusherConfig: PusherConfig;
    private pusherClientService: PusherclientService;
    private geoCoder: GeocodingService;
    private infopopService: InfopopService;

    constructor(
      private pos: google.maps.LatLng,
      private content: string, public title: string,
      private placeIconUrl, private mphmap, private userId: string, private mapNumber: number,
      private popupId: string, private labelarg: any,
      private mphg: MapHosterGoogle,
      private isShared: boolean = false) {
        this.utils = MLInjector.injector.get(Utils);
        this.pusherConfig = MLInjector.injector.get(PusherConfig);
        this.pusherClientService = MLInjector.injector.get(PusherclientService);
        this.popTitle = title;
        this.popContent = content;
        this.geoCoder = MLInjector.injector.get(GeocodingService);
        this.infopopService = MLInjector.injector.get(InfopopService);

/*
InvalidValueError: setIcon: not a string; and not an instance of PinView;
and no url property; and no path property
*/
        const image = {
            url: placeIconUrl,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
            labelOrigin: new google.maps.Point(20, 16)
        };
        let contentRaw = '';
        const self = this,
            marker = new google.maps.Marker({
                position: pos,
                icon: image,
                map: this.mphmap,
                title,
                label: {text: labelarg, color: '#003a44', fontSize: '16px', fontWeight: 'bold'}
            }),
            // shareClick  = function(e: Event, self) {
            //     let fixedLL = this.utils.toFixedTwo(marker.position.lng(), marker.position.lat(), 9);
            //     let referrerId = self.mlconfig.getUserId();
            //     let referrerName = this.pusherConfig.getUserName();
            //     let mapId = 'map' + self.mlconfig.getUserId();
            //     let pushLL = {'x': fixedLL.lon, 'y': fixedLL.lat, 'z': self.zmG,
            //         'referrerId': referrerId, 'referrerName': referrerName,
            //         'mapId': mapId,
            //         'address': marker.address, 'title': marker.title };
            //     console.log('You, ' + referrerName + ', ' + referrerId + ', clicked the map at ' + fixedLL.lat + ', ' + fixedLL.lon);
            //     this..pusherClientService.publishClickEvent(pushLL);
            // },

            dockPopup = async (e: Event) => {
                // console.log(e);
                // console.log(e.srcElement.id);
                console.log('dockPopup !!!');
                const infopopsvc = this.infopopService;
                const subscriber = infopopsvc.dockPopEmitter.subscribe((retval: any) => {
                    console.log(`dockPopEmitter event received from ${retval.title} in popover for ${title} userId ${self.userId}`);
                    if (retval) {
                        console.log(`retval.action is ${retval.action}`);
                        if (retval.action === 'undock') {
                          if (retval.title === self.popupId) {
                            console.log('titles matched....');
                            console.log(`close popover for ${title}`);
                            infopopsvc.close(self.popupId, false);
                            this.mphg.closePopup(this.popupId, this.pos);
                            console.log('dockPopEmitter client received and processed undock');
                          } else {
                              console.log('titles did not match....unsubscribe');
                              // subscriber.unsubscribe();
                          }
                        } else if (retval.action === 'close') {
                            console.log('dockPopEmitter client received close...close popover');
                            if (retval.title === self.popupId) {
                              // subscriber.unsubscribe();
                              infopopsvc.remove(self.popupId);
                              // infopopsvc.close(self.popupId);
                              this.mphg.closePopup(this.popupId, this.pos);
                              if (this.isShared === true) {
                                this.popMarker.setMap(null);
                              }
                            }
                        } else if (retval.action === 'share') {
                          console.log('dockPopEmitter client received share');
                          self.shareClick(e, self, retval.title, retval.labelShort);
                        }
                    } else {
                        // got click on map outside docked popover
                        console.log('dockPopEmitter client received map click....close popover and unsubscribe');
                        this.mphg.closePopup(this.popupId, this.pos);
                        infopopsvc.close(this.popupId, true);
                        // subscriber.unsubscribe();
                    }
                    // this.pophandlerProvider.closePopupsExceptOne(title);
                    // subscriber.unsubscribe();
                });
                self.popupId = uuid();
                if (infopopsvc.hasModal(self.popupId, self.mapNumber) === false) {
                    console.log(`open popover for ${self.userId} with title ${title}`);
                    this.popOver = infopopsvc.create(marker, self.mapNumber, InfopopComponent, contentRaw,
                      title, labelarg, self.popupId, ! self.isShared);
                    console.log('back from infopopsvc.create');
                    console.log(self.popOver);
                }
            };

        // let lbl = marker.getLabel();
        // lbl.color = '#eb3a44';
        // lbl.text = labelarg;
        // lbl.fontSize = '16px';
        // lbl.fontWeight = 'bold';
        // marker.setLabel(lbl);
        // if (! this.mrkr) {
        //     this.mrkr = marker;
        // }
        this.popMarker = marker;
        // this.popMarker.setLabel(lbl);
        google.maps.event.addListener(marker, 'click',  async (event) => {
            // this.pophandlerProvider.closePopupsExceptOne(marker.title);
            console.log(`triggered click listener for user ${this.userId} on marker ${marker.getTitle()}`);
            const latlng = {lat: pos.lat(), lng: pos.lng()};
            this.geoCoder.geoCode({location: latlng}).then((adrs) => {
                contentRaw = adrs;
                dockPopup(event);
            });
            // this.pophandlerProvider.closeAllPopups();
        });

    }

    getId() {
        return this.popupId;
    }

    shareClick(e: Event, self: MarkerInfoPopup, popoverId, labelShort) {
        console.log(`shareClick with popoverId: ${popoverId}, this.popupId ${this.popupId} `);
        if (popoverId === this.popupId) {
          const marker = self.popMarker,
              fixedLL = self.utils.toFixedTwo(marker.getPosition().lng(), marker.getPosition().lat(), 6),
              referrerName = self.pusherConfig.getUserName(),
              referrerId = this.userId,
              mapId = 'map' + this.userId,
              pushLL = {lng: fixedLL.lon, lat: fixedLL.lat, z: self.popMarker.getZIndex(),
                referrerId, referrerName,
                mapId, popId: popoverId, mapNumber: this.mapNumber,
                address: marker.getLabel(), title: marker.getTitle() };

          console.log('You, ' + referrerName + ', ' + referrerId +
          ',clicked the map with id ' + popoverId + ' at ' + fixedLL.lat + ', ' + fixedLL.lon);
          self.pusherClientService.publishClickEvent(pushLL);
        }
    }

    openSharedPopover() {
      console.log(`openPopover on share for ${this.userId}, with title ${this.popTitle}, content ${this.popContent}`);
      console.log('isShared ?');
      console.log(this.isShared);
      if (this.isShared === true) {
        google.maps.event.trigger(this.popMarker, 'click');
      }
      // let infopop = CommonToNG.getLibs().infopopoverSvc;
      // infopop.open(this.popContent, this.popTitle);
    }
    getMarker() {
      return this.popMarker;
    }
    openPopover(content: string, title: string) {

    }

    closePopover() {
      const infopopsvc = this.infopopService;
      infopopsvc.close(this.popupId, true);
      this.mphg.closePopup(this.popupId, this.pos);
    }
}
