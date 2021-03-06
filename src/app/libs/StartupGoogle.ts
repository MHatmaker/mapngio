// import {Injectable} from '@angular/core';
import { MLConfig } from './MLConfig';
// import { PusherConfig } from './PusherConfig';
// import { PusherClientService } from '../../../services/pusherclient.service';
// import { utils } from './utils';
import { MapHosterGoogle } from './MapHosterGoogle';
// import { GoogleMap } from '@agm/core/services/google-maps-types';
import { Startup } from './Startup';
import { PusherConfig } from './PusherConfig';
import { MapinstanceService} from '../services/mapinstance.service';
import { CurrentmaptypeService } from '../services/currentmaptype.service';
import { PusherclientService } from '../services/pusherclient.service';
import { MapLocOptions, MapLocCoords } from '../services/positionupdate.interface';
// import { AppModule } from '../app.module';
import { MLInjector } from '../libs/MLInjector';

// @Injectable()
export class StartupGoogle extends Startup {
    // private hostName: string = 'MapHosterGoogle';

    private gMap: google.maps.Map = null;
    private newSelectedWebMapId = '';
    private pusherChannel = '';
    private pusher: any = null;
    private mapHoster: MapHosterGoogle;
    private mlconfig: MLConfig;
    private pusherConfig: PusherConfig;
    private mapInstanceService: MapinstanceService;
    private pusherClientService: PusherclientService;
    private currentMapTypeService: CurrentmaptypeService;

    constructor(private mapNumber: number, mlconfig: MLConfig) {
        super();
        this.mlconfig = mlconfig;
        this.mlconfig.setMapNumber(mapNumber);
        this.pusherConfig = MLInjector.injector.get(PusherConfig);
        this.currentMapTypeService = MLInjector.injector.get(CurrentmaptypeService);
        this.mapInstanceService = MLInjector.injector.get(MapinstanceService);
        this.pusherClientService = MLInjector.injector.get(PusherclientService);
        this.mlconfig.setUserId(this.pusherConfig.getUserName() + mapNumber);
    }


    getMap() {
        return this.gMap;
    }

    getMapNumber() {
        return this.mapNumber;
    }
    getMapHosterInstance(ndx) {
        return this.mapHoster;
    }

    configure(newMapId: string, mapElement: HTMLElement, mapLocOpts: MapLocOptions): google.maps.Map {

        console.log('StartupGoogle configure with map no. ' + this.mapNumber);
        this.newSelectedWebMapId = newMapId;

        // window.loading = dojo.byId('loadingImg');
        // utils.showLoading();
        const centerLatLng = {lat: mapLocOpts.center.lat, lng: mapLocOpts.center.lng};
        const initZoom = mapLocOpts.zoom;

        // if (mapLocOpts) {
        //     centerLatLng = mapLocOpts.center;
        //     initZoom = mapLocOpts.zoom;
        // }

        const mapGoogleLocOpts: google.maps.MapOptions = {
            center: centerLatLng,
            // center: new google.maps.LatLng(51.50, -0.09),
            zoom: initZoom,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.gMap = new google.maps.Map(mapElement, mapGoogleLocOpts);
        console.log('StartupGoogle ready to instantiate Map Hoster with map no. ' + this.mapNumber);
        this.mapHoster = new MapHosterGoogle(this.mapNumber, this.mlconfig);
        this.mapHoster.configureMap(this.gMap, mapGoogleLocOpts, this.mlconfig);
        google.maps.event.trigger(mapElement, 'resize');
        this.mlconfig.setMapHosterInstance(this.mapHoster);
        this.mlconfig.setRawMap(this.gMap);

        this.mapInstanceService.setMapHosterInstance(this.mapNumber, this.mapHoster);
        this.currentMapTypeService.setCurrentMapType('google');

        this.pusher = this.pusherClientService.createPusherClient(
            this.mlconfig,
            null
        );
        if (!this.pusher) {
            console.log('failed to create Pusher in StartupGoogle');
        }
        return this.gMap;
    }
}
