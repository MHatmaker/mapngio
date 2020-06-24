import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import { CarouselComponent } from '../components/carousel/carousel.component';
import { SlidenavComponent } from '../components/slidenav/slidenav.component';
import { PlacesSearchComponent } from '../components/placessearch/placessearch.component';
import { PositionviewComponent } from '../components/positionview/positionview.component';
import { HiddenmapComponent } from '../components/hiddenmap/hiddenmap.component';
import { LocateselfComponent } from '../components/locateself/locateself.component';
import { PushersetupComponent } from '../components/pushersetup/pushersetup.component';
import { MultiCanvasGoogle } from '../components/multicanvas/multicanvasgoogle.component';
import { MultiCanvasEsri } from '../components/multicanvas/multicanvasesri.component';
import { GoogleMapComponent } from '../components/googlemap/googlemap.component';
import { EsriMapComponent } from '../components/esrimap/esrimap.component';
import { DestselectionComponent } from '../components/destselection/destselection.component';
import { SideMenuContentComponent } from '../components/side-menu-content/side-menu-content.component';
import { AgoitemComponent } from '../components/agoitem/agoitem.component';
import { AgodetailComponent } from '../components/agodetail/agodetail.component';
import { InfopopupComponent } from '../components/infopopup/infopopup.component';
import { InfopopComponent } from '../components/infopop/infopop.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    LocateselfComponent,
    PushersetupComponent,
    MultiCanvasGoogle,
    MultiCanvasEsri,
    GoogleMapComponent,
    EsriMapComponent,
    DestselectionComponent,
    AgoitemComponent,
    AgodetailComponent,
    InfopopupComponent,
    InfopopComponent,
    SlidenavComponent
  ],
providers: [
    Geolocation
  ],
  declarations: [
    MapPage,
    CarouselComponent,
    PlacesSearchComponent,
    PositionviewComponent,
    HiddenmapComponent,
    LocateselfComponent,
    PushersetupComponent,
    MultiCanvasGoogle,
    MultiCanvasEsri,
    GoogleMapComponent,
    EsriMapComponent,
    DestselectionComponent,
    AgoitemComponent,
    AgodetailComponent,
    InfopopupComponent,
    InfopopComponent,
    SlidenavComponent
  ],
})
export class MapPageModule {}
