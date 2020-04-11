import {
    Injectable
} from '@angular/core';

import { PusherConfig } from './PusherConfig';
import { PusherClientService } from '../services/pusherclient.service';
import { Utils } from './utils';
import { PositionUpdateService } from '../services/positionupdate.service';
import { GeoCodingService } from '../services/geocoding.service';
import { PusherEventHandler } from './PusherEventHandler';

import { CurrentMapTypeService } from '../services/currentmaptypeservice';
import { MapInstanceService } from '../services/mapinstance.service';
import { PophandlerService } from '../services/pophandler.service';


export interface IGeoPusher {
    utils: utils,
    pusherConfig: PusherConfig,
    geoCoder: GeoCodingService,
    positionUpdateService: PositionUpdateService,
    pusherClientService: PusherClientService,
    currentMapTypeService: CurrentMapTypeService,
    mapInstanceService: MapInstanceService,
    pophandlerProvider : PophandlerProvider
}

@Injectable()
export class GeoPusherSupport {
    IgeoPusher : IGeoPusher;

    constructor(protected utils: utils, protected pusherConfig: PusherConfig, protected geoCoder: GeoCodingService,
        protected positionUpdateService: PositionUpdateService, protected pusherClientService: PusherClientService,
        protected currentmaptypeservice: CurrentMapTypeService,
        protected mapInstanceService: MapInstanceService, protected pophandlerProvider : PophandlerProvider) {

        this.IgeoPusher = {
            utils: utils,
            pusherConfig: pusherConfig,
            geoCoder: geoCoder,
            positionUpdateService: positionUpdateService,
            pusherClientService: pusherClientService,
            currentMapTypeService: currentmaptypeservice,
            mapInstanceService: mapInstanceService,
            pophandlerProvider: pophandlerProvider
        }
/*
        this.IgeoPusher.utils = utils; //new utils();
        this.IgeoPusher.pusherConfig = pusherConfig; //new PusherConfig();
        this.IgeoPusher.geoCoder = geoCoder; //new GeoCodingService();
        // this.IgeoPusher.pusherClientService = new PusherClientService();
        // this.IgeoPusher.pusherEventHandler = new PusherEventHandler();
        this.IgeoPusher.positionUpdateService = positionUpdateService; // new PositionUpdateService();
        this.IgeoPusher.currentMapTypeService = currentmaptypeservice; //new CurrentMapTypeService();
        this.IgeoPusher.mapInstanceService = mapInstanceService; //new MapInstanceService();
*/
    }

    getGeoPusherSupport() : IGeoPusher {
        return this.IgeoPusher;
    }
}
