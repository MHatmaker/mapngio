import { Injectable } from '@angular/core';
import { Startup } from '..//libs/Startup';
import { MapHoster } from '../libs/MapHoster';

interface Imapconfigs {
    maptype: string;
    title: string;
    site: string;
    content: string;
    url: string;
    imgSrc: string;
    imgAlt: string;
    active: boolean;
    disabled: boolean;
  }

@Injectable({
  providedIn: 'root'
})
export class CurrentmaptypeService {

    private mapTypes = {
        google: MapHoster,
        arcgis: MapHoster,
        leaflet: MapHoster
    };
    private mapStartups = {
        google: Startup,
        arcgis: Startup,
        leaflet: Startup
    };
    private currentMapType = 'google';
    private selectedMapType = 'google';
    private previousMapType = 'google';

    private mapRestUrl = {
        google: 'google',
        arcgis: 'arcgis',
        leaflet: 'leaflet',
        GoogleMap: 'google',
        ArcGIS: 'arcgis',
        Leaflet: 'leaflet'

    };

    private mapType2Config = {
        google: 0,
        arcgis: 1,
        leaflet: 2
    };

    mapSystemDct = {
        google: 0,
        arcgis: 1,
        leaflet: 2
    };
    private mapconfigs: Imapconfigs[] = [
        {
            maptype: 'google',
            title: 'Google Maps',
            site: 'Web Site featuring a Google Map',
            content: this.fillContentsText('Google Map', 'a Google map', 'google map content'),
            url: '/partials/google.html',
            imgSrc: 'assets/imgs/googlemap.png',
            imgAlt: 'Google Map',
            active: true,
            disabled: false
        },
        {
            maptype: 'arcgis',
            title: 'ArcGIS Web Maps',
            site: 'Web Site featuring an ArcGIS Online Map',
            content: this.fillContentsText('ArcGIS', 'an ArcGIS Web Map', 'ArcGIS Online content'),
            url: '/partials/arcgis.html',
            imgSrc: 'assets/imgs/arcgis.png',
            imgAlt: 'ArcGIS Web Maps',
            active: false,
            disabled: false
        },
        {
            maptype: 'leaflet',
            title: 'Leaflet/OSM Maps',
            site: 'Web Site featuring a Leaflet Map',
            content: this.fillContentsText('Leaflet/OSM Map',  'a Leaflet/OSM map', 'Leaflet content'),
            url: '/partials/leaflet.html',
            imgSrc:  'assets/imgs/Leaflet.png',
            imgAlt: 'Leaflet/OSM Maps',
            active: false,
            disabled: false
        }
    ];
    private mapsvcScopes: any;
    private fillContentsText(title, map, content) {
        const contentsText =
            `The {title} tab opens a typical web page
            displaying typical web page stuff, including a div with {map}
            programmed with {content} embedded in it.`;
        return contentsText;
    }

  constructor() { }

getMapTypes() {
    const values = Object.keys(this.mapTypes).map(function(key) {
        return {type: key, mph: this.mapTypes[key]};
    });
    return values;

    // var mapTypeValues = [];
    // for (var key in this.mapTypes){
        // mapTypeValues.push(mapTypes[key]);
    // return this.mapTypes;
}
getMapConfigurations() {
    return this.mapconfigs;
}
getCurrentMapConfiguration() {
    return this.mapconfigs[this.mapType2Config[this.currentMapType]];
}
getMapConfigurationForType(type) {
    return this.mapconfigs[this.mapType2Config[type]];
}
getSpecificMapType(key) {
    return this.mapTypes[key];
}
getCurrentMapType() {
    return this.mapTypes[this.currentMapType];
}
getMapStartup() {
    return this.mapStartups[this.currentMapType];
}
getMapTypeKey() {
    return this.selectedMapType;
}
getMapRestUrl() {
    return this.mapRestUrl[this.selectedMapType];
}
getMapRestUrlForType(tp) {
    return this.mapRestUrl[tp];
}
setCurrentMapType(mpt) {
    const data = {
        whichsystem: this.mapconfigs[this.mapSystemDct[mpt]],
    };
        // MapCtrl,
        // scp = this.mapsvcScopes.getScopes()[0];
    this.previousMapType = this.currentMapType;
    this.selectedMapType = mpt;
    this.currentMapType = mpt;
    console.log('selectedMapType set to ' + this.selectedMapType);
    // MapCtrl = MapControllerService.getController();
    // MapCtrl.invalidateCurrentMapTypeConfigured();
    // if (scp) {
    //     scp.$broadcast('SwitchedMapSystemEvent', data);
    // }
}
getPreviousMapType() {
    return this.mapTypes[this.previousMapType];
}
getSelectedMapType() {
    console.log('getSelectedMapType: ' + this.selectedMapType);
    return this.mapTypes[this.selectedMapType];
}

addScope(scope) {
    this.mapsvcScopes.addScope(scope);
}
forceAGO() {
// Simulate a click on ArcGIS Ago mapSystem 'Show the Map' buttons under the map system tabs.
// The listener resets the $locationPath under the ng-view.
// This code should be entered in a new window created by a publish event with the map system
// in the url

    const data = {
        whichsystem: this.mapconfigs[this.mapSystemDct.arcgis],
        newpath: '/views/partials/arcgis'
    },
        scp = this.mapsvcScopes.getScopes()[0];
    if (scp) {
        scp.$broadcast('ForceAGOEvent', data);
    }
    console.log('forceAGO setting path to: ' + data.newpath);
    // window.location.pathname += '/views/partials/GoogleMap';
    // window.location.reload();
}

forceMapSystem(mapSystem) {
// Simulate a click on one of the mapSystem 'Show the Map' buttons under the map system tabs.
// The listener resets the $locationPath under the ng-view.
// This code should be entered in a new window created by a publish event with the map system
// in the url

    const data = {whichsystem: this.mapconfigs[this.mapSystemDct[mapSystem]], newpath: '/views/partials/' + mapSystem},
        scp = this.mapsvcScopes.getScopes()[0];
    if (scp) {
        scp.$broadcast('ForceMapSystemEvent', data);
    }
    console.log('forceMapSystem setting path to: ' + data.newpath);
}
}
