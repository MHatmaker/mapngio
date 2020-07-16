import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DomchangeDirective } from './directives/domchange.directive';
// import { MapPage } from './map/map.page';
// import { CarouselComponent } from './components/carousel/carousel.component';
import { MLInjector } from './libs/MLInjector';
import { PusherConfig } from './libs/PusherConfig';
import { Utils } from './libs/utils';
import { HostConfig } from './libs/HostConfig';
import { EsrimapService } from './services/esrimap.service';
import { DomService } from './services/dom.service';
import { MapinstanceService } from './services/mapinstance.service';
import { CanvasService } from './services/canvas.service';
import { SlideshareService } from './services/slideshare.service';
import { SlideviewService } from './services/slideview.service';
import { PositionupdateService } from './services/positionupdate.service';
import { PageService } from './services/page.service';
import { SearchplacesService } from './services/searchplaces.service';
import { EmailerService } from './services/emailer.service';

import { SideMenuContentComponent } from './components/side-menu-content/side-menu-content.component';
import { NewsComponent} from './components/news/news.component';
import { LinkrhelpComponent } from './components/linkrhelp/linkrhelp.component';
import { SharinghelpComponent } from './components/sharinghelp/sharinghelp.component';
import { MsgsetupComponent } from './components/msgsetup/msgsetup.component';
import { AccordionListComponent } from './components/accordion-list/accordion-list.component';
import { MapPageModule } from './map/map.module';

// import { PlacesSearchComponent } from './components/placessearch/placessearch.component';
// import { PositionviewComponent } from './components/positionview/positionview.component';


// import { MapPageModule } from './map/map.module';


@NgModule({
  declarations: [
    AppComponent,
    DomchangeDirective,
    SideMenuContentComponent,
    NewsComponent,
    LinkrhelpComponent,
    SharinghelpComponent,
    MsgsetupComponent,
    AccordionListComponent
  ],
  entryComponents: [
    SideMenuContentComponent,
    NewsComponent,
    LinkrhelpComponent,
    SharinghelpComponent,
    MsgsetupComponent,
    AccordionListComponent
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, MapPageModule, FormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClient,
    PusherConfig,
    Utils,
    HostConfig,
    EsrimapService,
    DomService,
    MapinstanceService,
    CanvasService,
    SlideshareService,
    SlideviewService,
    PositionupdateService,
    PageService,
    SearchplacesService,
    EmailerService,
    Clipboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

    static injector: Injector;
    constructor(injector: Injector) {
        AppModule.injector = injector;
        MLInjector.injector = injector;
    }
}
