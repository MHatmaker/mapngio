import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DomchangeDirective } from './directives/domchange.directive';

// import { MapPageModule } from './map/map.module';


@NgModule({
  declarations: [AppComponent, DomchangeDirective],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule], // MapPageModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

    static injector: Injector;
    constructor(injector: Injector) {
        AppModule.injector = injector;
    }
}
