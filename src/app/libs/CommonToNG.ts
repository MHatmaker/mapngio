import { DomService } from '../services/dom.service';
import { SharemapService } from '../services/sharemap.service';
import { GmpopoverService } from '../services/gmpopover.service';
import { InfopopService } from '../services/infopop.service';

export interface ICommonToNG {
     domSvc: DomService;
     shareInfoSvc: SharemapService;
     gmpopoverSvc: GmpopoverService;
     infopopSvc: InfopopService;
}

export class CommonToNG  implements ICommonToNG {
  static libs: ICommonToNG;
  domSvc: DomService;
  shareInfoSvc: SharemapService;
  gmpopoverSvc: GmpopoverService;
  infopopSvc: InfopopService;

  // constructor(libs: ICommonToNG) {
  //
  // }
  static setLibs(s: ICommonToNG) {
    CommonToNG.libs = s;
  }
  static getLibs(): ICommonToNG {
      return CommonToNG.libs;
  }
}
