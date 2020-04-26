
import { InfopopService } from '../services/infopop.service';
import { PopoverController } from '@ionic/angular';
// import { PophandlerProvider } from '../../../providers/pophandler/pophandler';
import { InfopopComponent } from '..//components/infopop/infopop.component';
import { v4 as uuid } from 'uuid';
import { AppModule } from '../app.module';
import { Utils } from './utils';
import { PusherConfig } from './PusherConfig';
import { GeocodingService, OSMAddress } from '../services/geocoding.service';
import { PusherclientService } from '../services/pusherclient.service';
import {} from 'googlemaps';

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
      private pos,
      private content: string, public title: string,
      private placeIconUrl, private mphmap, private userId: string, private mapNumber: number,
      private popupId: string, private labelarg: any,
      private isShared: boolean = false) {
        this.utils = AppModule.injector.get(Utils);
        this.pusherConfig = AppModule.injector.get(PusherConfig);
        this.pusherClientService = AppModule.injector.get(PusherclientService);
        this.popTitle = title;
        this.popContent = content;
        this.geoCoder = AppModule.injector.get(GeocodingService);
        this.infopopService = AppModule.injector.get(InfopopService);

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
                const infopop = this.infopopService;
                const subscriber = infopop.dockPopEmitter.subscribe((retval: any) => {
                    console.log(`dockPopEmitter event received from ${retval.title} in popover for ${title} userId ${self.userId}`);
                    if (retval) {
                        console.log(`retval.action is ${retval.action}`);
                        if (retval.action === 'undock') {
                          if (retval.title === self.popupId) {
                              console.log('titles matched....');
                          } else {
                              console.log('titles did not match....unsubscribe');
                              subscriber.unsubscribe();
                          }
                          console.log(`close popover for ${title}`);
                          infopop.close(self.popupId);
                          console.log('dockPopEmitter client received and processed undock');
                        } else if (retval.action === 'close') {
                            console.log('dockPopEmitter client received close...close popover');
                            subscriber.unsubscribe();
                            // infopop.close(self.popupId);
                        } else if (retval.action === 'share') {
                          console.log('dockPopEmitter client received share');
                          self.shareClick(e, self, retval.title, retval.labelShort);
                        }
                    } else {
                        // got click on map outside docked popover
                        console.log('dockPopEmitter client received map click....close popover and unsubscribe');
                        infopop.close(this.popupId);
                        subscriber.unsubscribe();
                    }
                    // this.pophandlerProvider.closePopupsExceptOne(title);
                    subscriber.unsubscribe();
                });
                self.popupId = uuid();
                if (infopop.hasModal(self.popupId, self.mapNumber) === false) {
                    console.log(`open popover for ${self.userId} with title ${title}`);
                    this.popOver = await infopop.create(marker, self.mapNumber, InfopopComponent, contentRaw,
                      title, labelarg, self.popupId, ! self.isShared);
                    console.log('back from infopop.create');
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

    shareClick(e: Event, self, popoverId, labelShort) {
        console.log(`shareClick with popoverId: ${popoverId}, this.popupId ${this.popupId} `);
        if (popoverId === this.popupId) {
          const marker = self.popMarker,
              fixedLL = self.utils.toFixedTwo(marker.position.lng(), marker.position.lat(), 9),
              referrerName = self.pusherConfig.getUserName(),
              referrerId = this.userId,
              mapId = 'map' + this.userId,
              pushLL = {x: fixedLL.lon, y: fixedLL.lat, z: self.zmG,
                referrerId, referrerName,
                mapId, popId: popoverId, mapNumber: this.mapNumber,
                address: marker.address, title: marker.title };

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
      const infopop = this.infopopService;
      infopop.close(this.popupId);
    }
}
