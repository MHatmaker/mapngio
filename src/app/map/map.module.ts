import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import { CarouselComponent } from '../components/carousel/carousel.component';
import { PlacesSearchComponent } from '../components/placessearch/placessearch.component';
import { PositionviewComponent } from '../components/positionview/positionview.component';
import { HiddenmapComponent } from '../components/hiddenmap/hiddenmap.component';
import { LocateselfComponent } from '../components/locateself/locateself.component';
import { PushersetupComponent } from '../components/pushersetup/pushersetup.component';
import { MultiCanvasGoogle } from '../components/multicanvas/multicanvasgoogle.component';
import { MapcontentComponent } from '../components/mapcontent/mapcontent.component';

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
    MapcontentComponent
  ],
  providers: [
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
    MapcontentComponent
  ],
})
export class MapPageModule {}
