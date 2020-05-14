import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HostConfig } from './libs/HostConfig';
import { MapPage } from './map/map.page';

import { SideMenuContentComponent } from './components/side-menu-content/side-menu-content.component';
import { SideMenuSettings } from './components/side-menu-content/models/side-menu-settings';
import { PageService } from './services/page.service';
import { MenuOptionModel } from './components/side-menu-content/models/menu-option-model';
import { PusherConfig } from './libs/PusherConfig';
// import { Geolocation } from '@ionic-native/geolocation';
import { DomService } from './services/dom.service';
import { CommonToNG } from './libs/CommonToNG';
import { SharemapService } from './services/sharemap.service';
import { GmpopoverService } from './services/gmpopover.service';
import { HttpClient } from '@angular/common/http';
import { InfopopService } from './services/infopop.service';
import { MapinstanceService } from './services/mapinstance.service';
import { CanvasService } from './services/canvas.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
  // templateUrl: './map/map.page.html',
  // styleUrls: ['./map/map.page.scss'],
})
export class AppComponent {
  @ViewChild('mlcontent', {static: false}) nav: NavController; // <--- Reference to the Nav
  // Get the instance to call the public methods
  @ViewChild(SideMenuContentComponent, {static: false}) sideMenu: SideMenuContentComponent;

  public options: Array<MenuOptionModel>;
  public channel: any;
  private userName: string;
  rootPage = AppComponent;

  // Settings for the SideMenuComponent
  public sideMenuSettings: SideMenuSettings = {
    accordionMode: true,
    showSelectedOption: true,
    selectedOptionClass: 'active-side-menu-option',
    subOptionIndentation: {
      md: '56px',
      ios: '64px',
      wp: '56px'
    }
  };
  pages: Array<{title: string, component: any}>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menuCtrl: MenuController, private pageService: PageService, private domsvc: DomService,
    private shareMapInfoSvc: SharemapService, private gmpopoverSvc: GmpopoverService,
    private infopopSvc: InfopopService, private mapInstanceService: MapinstanceService,
    private pusherConfig: PusherConfig, private canvasService: CanvasService,
    private hostConfig: HostConfig
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Maps', component: MapPage }
    ];

    console.log('HostConfig initialization');
    hostConfig.showConfig('MapLinkr App startup before modifying default settings and dojodomReady');

    hostConfig.setLocationPath(location.origin + location.pathname);
    console.log('location.search');
    console.log(location.search);
    hostConfig.setSearch(location.search);
    pusherConfig.setSearch(location.search);
    hostConfig.setprotocol(location.protocol);
    hostConfig.sethost(location.host);
    hostConfig.sethostport(location.port);
    hostConfig.sethref(location.href);

    CommonToNG.setLibs(
      { domSvc: this.domsvc,
      shareInfoSvc: this.shareMapInfoSvc,
      gmpopoverSvc: this.gmpopoverSvc,
      infopopSvc: this.infopopSvc} );

    this.queryForUserName();
    this.queryForPusherKeys();
  }

  setIDsAndNames() {
    if (location.search === '') {
        console.log('starting from url with no location/query data');
        this.hostConfig.setInitialUserStatus(true);
        this.hostConfig.setReferrerId('-99');
        this.pusherConfig.setUserName(this.userName);
    } else {
        console.log('starting from url containing location/query data');
        this.hostConfig.setInitialUserStatus(false);
        this.channel = this.pusherConfig.getChannelFromUrl();
        if (this.channel !== '') {
            this.pusherConfig.setChannel(this.channel);
            this.pusherConfig.setNameChannelAccepted(true);
        }
        this.userName = this.hostConfig.getUserNameFromUrl();
        if (this.userName !== '') {
            this.pusherConfig.setUserName(this.userName);
            this.hostConfig.setReferrerId (this.userName);
        }
    }
  }

async queryForUserName() {
  console.log('ready to await in queryForUserName');
  await this.hostConfig.getUserNameFromServer();
  console.log('finished await in queryForUserName');
  // this.canvasService.addInitialCanvas(this.pusherConfig.getUserName());
  // this.setIDsAndNames();
}

  async queryForPusherKeys() {
    console.log('ready to await in queryForPusherKeys');
    await this.hostConfig.getPusherKeys();
    console.log('finished await in queryForPusherKeys');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // Initialize some options
      this.initializeOptions();
      const sc = document.getElementsByClassName('scroll-content');
      sc[0].classList.add('padzero');
      sc[1].classList.add('padzero');

      const platforms = this.platform.platforms();
      const isApp = (this.platform.is('mobileweb')) ? false : true;
      this.canvasService.setPlatform(isApp);
    });
  }

  private initializeOptions(): void {
    this.options = new Array<MenuOptionModel>();

    this.options.push({
      iconName: 'link',
      displayName: 'Map options',
      subItems: [
        {
          iconName: 'custom-icon',
          displayName: 'google',
          component: MapPage
        },
        {
          iconName: 'globe',
          displayName: 'arcgis',
          component: MapPage
        },
        {
          iconName: 'leaf',
          displayName: 'leaflet',
          component: MapPage
        }
      ]
    });
    this.options.push({
      iconName: 'link',
      displayName: 'MapLinkr',
      subItems: [
        {
          iconName: 'news-icon',
          displayName: 'Latest News',
          component: MapPage
        },
        {
          iconName: 'using-icon',
          displayName: 'Using MapLinkr',
          component: MapPage
        },
        {
          iconName: 'locate-self-icon',
          displayName: 'Locate Self',
          component: MapPage
        },
        {
          iconName: 'searchgroup-icon',
          displayName: 'Search Group',
          component: MapPage
        },
        {
          iconName: 'searchmap-icon',
          displayName: 'Search Map',
          component: MapPage
        },
        {
          iconName: 'share-inst-icon',
          displayName: 'Sharing Instructions',
          component: MapPage
        },
        {
          iconName: 'sharing-icon',
          displayName: 'Share Map',
          component: MapPage
        },
        {
          iconName: 'pusher-icon',
          displayName: 'Pusher Setup',
          component: MapPage
        },
        {
          iconName: 'pusher-icon',
          displayName: 'Remove Map',
          component: MapPage
        }
      ]
    });

/*
		// Load special options
		// -----------------------------------------------
		this.options.push({
			displayName: 'Special options',
			subItems: [
				{
					iconName: 'log-in',
					displayName: 'Login',
					custom: {
						isLogin: true
					}
				},
				{
					iconName: 'log-out',
					displayName: 'Logout',
					custom: {
						isLogout: true
					}
				},
				{
					iconName: 'globe',
					displayName: 'Open Google',
					custom: {
						isExternalLink: true,
						externalUrl: 'http://www.google.com'
					}
				}
			]
		});*/
  }

}
