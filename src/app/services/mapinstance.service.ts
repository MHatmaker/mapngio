
import {Injectable} from '@angular/core';
import { MLConfig } from '../libs/MLConfig';
import { MapHoster } from '../libs/MapHoster';

@Injectable({
  providedIn: 'root'
})
export class MapinstanceService {
    nextSlideNumber = 0;
    isFirstInstance = true;
    currentSlideNumber = 0;
    configInstances: Map<string, MLConfig> = new Map<string, MLConfig>();
    mapHosterInstances: Map<string, MapHoster> = new Map<string, MapHoster>();
    hiddenMap: any;

    constructor() {
        console.log('service to return nextSlideNumber');
        // this.isFirstInstance = true;
        // this.nextSlideNumber = 0;
        // this.currentSlideNumber = 0;
        // this.configInstances = new MLConfig(new ConfigParams(-1, '', '', null));
    }

    getNextSlideNumber(): number {
        return this.nextSlideNumber;
    }
    incrementMapNumber(): void {
        this.nextSlideNumber += 1;
        console.log('incrementMapNumber nextSlideNumber to ' + this.nextSlideNumber);
    }
    getNextMapNumber(): number {
        if (this.isFirstInstance) {
            this.isFirstInstance = false;
        }
        return this.nextSlideNumber;
    }
    removeInstance(slideToRemove: number): void {
        if (slideToRemove === this.nextSlideNumber - 1) {
            this.nextSlideNumber -= 1;
        }
    }
    setConfigInstanceForMap(ndx: number, cfg: MLConfig) {
        // this.configInstances['cfg' + ndx] = cfg;
        this.configInstances.set('cfg' + ndx, cfg);
    }
    getConfigInstanceForMap(ndx: number): MLConfig {
        return this.configInstances.get('cfg' + ndx);
    }
    hasConfigInstanceForMap(ndx: number): boolean {
        const instname = 'cfg' + ndx,
            test = this.configInstances[instname] === null;
        console.log('hasConfigInstanceForMap for ' + instname);
        console.log('test ' + test);

        return (this.configInstances[instname]) ? true : false;
    }
    setCurrentSlide(ndx: number): void {
        this.currentSlideNumber = ndx;
    }
    getCurrentSlide(): number {
        return this.currentSlideNumber;
    }
    getConfigForMap(ndx: number): MLConfig {
        return this.configInstances.get('cfg' + ndx);
    }
    setMapHosterInstance(ndx: number, inst: MapHoster) {
        const cfgndx = 'cfg' + ndx;
        // this.mapHosterInstances[cfgndx] = inst; //setMapHosterInstance(inst);
        // incrementMapNumber();
        this.mapHosterInstances.set(cfgndx, inst);
    }
    getMapHosterInstance(ndx: number): MapHoster {
        return this.mapHosterInstances.get('cfg' + ndx);
    }
    getMapHosterInstanceForCurrentSlide(): MapHoster {
        return this.mapHosterInstances.get('cfg' + this.currentSlideNumber);
    }
    setHiddenMap(map: any) {
        this.hiddenMap = map;
    }
    getHiddenMap() {
        return this.hiddenMap;
    }
    removeConfigInstances(slideNo: number) {
      const cfgName: string = 'cfg' + slideNo;
      console.log('remove configInstances: ' + cfgName);
      console.log(this.configInstances);
      if (this.configInstances.has(cfgName)) { // [cfgName]) {
        console.log('got it');
        this.configInstances.delete(cfgName);
        this.mapHosterInstances.delete(cfgName);
      }
      console.log(this.configInstances);
    }
    getRecentConfig(): MLConfig {
      let retval = null;
      if (this.configInstances.size > 0) {
        const values = this.configInstances.values();
        let v = values.next();
        while (v.done === false) {
          retval = v.value;
          v = values.next();
        }
      }
      return retval;
    }
}
