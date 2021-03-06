

import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CurrentmaptypeService } from '../../services/currentmaptype.service';
import { MapinstanceService } from '../../services/mapinstance.service';
import { HostConfig } from '../../libs/HostConfig';
import { PusherConfig } from '../../libs/PusherConfig';
// import * as ClipboardMin from 'clipboard/dist/clipboard.js';
// import * as copy from 'copy-text-to-clipboard';
import { Clipboard } from '@ionic-native/clipboard/ngx';
// import { Clipboard as ClipboardCdk } from '@angular/cdk/clipboard';

// import { PusherclientService } from '../../services/pusherclient.service';
import { MapLocOptions, IMapShare } from '../../services/positionupdate.interface';
import { EmailerService, EmailParts, IEmailAddress } from '../../services/emailer.service';
import { EMapSource } from '../../services/configparams.service';
import { ImlBoundsParams } from '../../services/mlbounds.service';
import { IPosition } from '../../services/position.service';
import { MLInjector } from '../../libs/MLInjector';
import { CanvasService } from '../../services/canvas.service';

interface IexpItem {
  expanded: boolean;
}

@Component({
  selector: 'msgsetup',
  templateUrl: './msgsetup.component.html',
  styleUrls: ['./msgsetup.component.scss'],
})
export class MsgsetupComponent {

  public urlCopyField: string;
  public recipientAdrs: string;
  public items: any = [];
  private selectedItem: any = null;
  private mapInstanceService: MapinstanceService;
  private currentMapTypeService: CurrentmaptypeService;

  constructor(
    public viewCtrl: ModalController, private hostConfig: HostConfig,
    private pusherConfig: PusherConfig, private emailer: EmailerService,
    public clipboard: Clipboard,
    // private clipboardCdk: ClipboardCdk,
    public canvasService: CanvasService) {
    console.log('Hello MsgsetupComponent Component');

    this.mapInstanceService = MLInjector.injector.get(MapinstanceService);
    this.currentMapTypeService = MLInjector.injector.get(CurrentmaptypeService);

    this.items = [
        {expanded: false},
        {expanded: false},
        {expanded: false}
    ];
    this.selectedItem = this.items[0];
  }
  assembleUrl() {
      console.log('gethref: ');
      const mlConfig = this.mapInstanceService.getMapHosterInstanceForCurrentSlide().getmlconfig();
      console.log(this.hostConfig.gethref());
      let updtUrl = this.hostConfig.gethref();
      const curmapsys = this.currentMapTypeService.getMapRestUrl(),
          gmQuery = encodeURIComponent(mlConfig.getQuery()),
          bnds = mlConfig.getBoundsForUrl(),
          channel = this.pusherConfig.masherChannel(false);

      if (updtUrl.indexOf('?') < 0) {
          updtUrl +=  mlConfig.getUpdatedRawUrl(channel);
      }
      console.log('Raw Updated url');
      console.log(updtUrl);
      updtUrl += '&maphost=' + curmapsys;
      updtUrl += '&referrerId=-99';


      if (gmQuery !== '') {
          updtUrl += '&gmquery=' + gmQuery;
          updtUrl += bnds;
      }

      return updtUrl;
  }

  assembleJson(): IMapShare {
    const mlConfig = this.mapInstanceService.getMapHosterInstanceForCurrentSlide().getmlconfig(),
        // curmapsys: string = this.currentMapTypeService.getMapRestUrl(),
        gmQuery: string = mlConfig.getQuery(),
        bnds: ImlBoundsParams = mlConfig.getBounds(),
        curpos: IPosition = mlConfig.getPosition(),
        cntr = {lat: curpos.lat, lng: curpos.lon},
        zoom: number = curpos.zoom,
        pos: MapLocOptions = {center: cntr, zoom, query: gmQuery, places: null},
        username: string = this.hostConfig.getUserName(),
        // switch from getting places as the source for another tab to sharing the source and query for another user
        src = mlConfig.getSource() === EMapSource.placesgoogle ? EMapSource.sharegoogle : mlConfig.getSource(),
        ago: string = src === EMapSource.sharegoogle ? 'nowebmap' : mlConfig.getWebmapId(false),
        opts: IMapShare = {mapLocOpts: pos, userName: username, mlBounds: bnds, source: src, webmapId: ago};

    return opts;

  }

  async copyUrlField(inputElement: any ) {
    if (this.canvasService.isMobileApp() === false) {
    const cb = window.navigator.clipboard;
    cb.writeText(this.urlCopyField).then(() => {
      console.log('url copied to clipboard');
    }).catch((err) => {
      console.log('clipboard copy failed');
      console.log(err);
    });
    } else {
      this.clipboard.copy(this.urlCopyField);
      this.clipboard.paste().then(
        (resolve: string) => {
          alert(resolve);
        },
        (reject: string) => {
          alert('Error: ' + reject);
        }
      );
    }
  }

  expandItem(item: IexpItem) {

      if (item.expanded) {
        item.expanded = false;
      } else {
        this.items.map((listItem: IexpItem) => {

          if (item === listItem) {
              listItem.expanded = !listItem.expanded;
              // this.selectedItem.expanded = listItem.expanded;
          } else {
              listItem.expanded = false;
          }
          return listItem;
        });
    }
  }
  fetchUrl() {
    // const mlConfig = this.mapInstanceService.getMapHosterInstanceForCurrentSlide().getmlconfig();

    this.urlCopyField = this.assembleUrl();

    console.log(this.urlCopyField);
    this.selectedItem = this.items[0];
    this.expandItem(this.items[0]);
  }

  setupMapLinkrMail() {
    this.selectedItem = this.items[1];
    console.log('selectedItem : ' + this.selectedItem);
    this.expandItem(this.items[1]);
  }
  setupDirectShare() {
    this.selectedItem = this.items[2];
    this.expandItem(this.items[2]);
  }

  sendMail() {
    const mlConfig = this.mapInstanceService.getMapHosterInstanceForCurrentSlide().getmlconfig();

    this.urlCopyField = this.assembleUrl();

    console.log(this.urlCopyField);
    const adrs: IEmailAddress = {Email: this.recipientAdrs}; // {Email: 'michael.hatmaker@gmail.com'}
    const email = new EmailParts({ to: [adrs], subject: mlConfig.getQuery(), text: this.urlCopyField});
    this.emailer.sendEmail(email);

  }

  logForm() {
    console.log(this.urlCopyField);
  }
  close() {
    this.viewCtrl.dismiss('usemsg', null);
  }
  shareMap() {
    // pusherClientService.publishPosition(this.urlCopyField);
    this.viewCtrl.dismiss({mode: 'usepush', results: JSON.stringify(this.assembleJson())});
  }

}
