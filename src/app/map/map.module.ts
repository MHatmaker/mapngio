import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import { CarouselComponent } from '../components/carousel/carousel.component';
import { PusherConfig } from '../libs/PusherConfig';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule
  ],
  providers: [
    PusherConfig,
  ],
  declarations: [MapPage, CarouselComponent],
})
export class MapPageModule {}
