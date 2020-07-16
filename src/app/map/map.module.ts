import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import { CarouselComponent } from '../components/carousel/carousel.component';
import { PlacesSearchComponent } from '../components/placessearch/placessearch.component';
import { PositionviewComponent } from '../components/positionview/positionview.component';
import { SlidenavComponent } from '../components/slidenav/slidenav.component';
import { HiddenmapComponent } from '../components/hiddenmap/hiddenmap.component';
import { LocateselfComponent } from '../components/locateself/locateself.component';
import { PushersetupComponent } from '../components/pushersetup/pushersetup.component';
import { MultiCanvasGoogleComponent } from '../components/multicanvas/multicanvasgoogle.component';
import { MultiCanvasEsriComponent } from '../components/multicanvas/multicanvasesri.component';
import { MultiCanvasLeafletComponent } from '../components/multicanvas/multicanvasleaflet.component';
import { GoogleMapComponent } from '../components/googlemap/googlemap.component';
import { EsriMapComponent } from '../components/esrimap/esrimap.component';
import { LeafletMapComponent } from '../components/leafletmap/leafletmap.component';
import { DestselectionComponent } from '../components/destselection/destselection.component';
import { SideMenuContentComponent } from '../components/side-menu-content/side-menu-content.component';
import { AgoitemComponent } from '../components/agoitem/agoitem.component';
import { AgogroupComponent } from '../components/agogroup/agogroup.component';
import { AgodetailComponent } from '../components/agodetail/agodetail.component';
import { InfopopupComponent } from '../components/infopopup/infopopup.component';
import { InfopopComponent } from '../components/infopop/infopop.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SlidenavService } from '../services/slidenav.service';

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
    MultiCanvasGoogleComponent,
    MultiCanvasEsriComponent,
    MultiCanvasLeafletComponent,
    GoogleMapComponent,
    EsriMapComponent,
    LeafletMapComponent,
    DestselectionComponent,
    AgoitemComponent,
    AgogroupComponent,
    AgodetailComponent,
    InfopopupComponent,
    InfopopComponent
  ],
providers: [
    Geolocation
  ],
  declarations: [
    MapPage,
    CarouselComponent,
    PlacesSearchComponent,
    PositionviewComponent,
    SlidenavComponent,
    HiddenmapComponent,
    LocateselfComponent,
    PushersetupComponent,
    MultiCanvasGoogleComponent,
    MultiCanvasEsriComponent,
    MultiCanvasLeafletComponent,
    GoogleMapComponent,
    EsriMapComponent,
    LeafletMapComponent,
    DestselectionComponent,
    AgoitemComponent,
    AgogroupComponent,
    AgodetailComponent,
    InfopopupComponent,
    InfopopComponent
  ],
})
export class MapPageModule {}
