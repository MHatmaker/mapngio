
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
// import { utils } from '../libs/utils';
// import { CurrentMapTypeService } from '../../../services/currentmaptypeservice';
import { IPositionData, IPositionParams } from '../../services/positionupdate.interface';
import { PositionupdateService } from '../../services/positionupdate.service';

console.log('PositionViewCtrl setup');

interface IViewOption  {
    type: string;
    key: string;
    value: string;
}

@Component({
  selector: 'position-view',
  templateUrl: './positionview.component.html',
  styleUrls: [ './positionview.component.scss']
})
export class PositionviewComponent implements AfterViewInit {
    // private currentTab: string;
    private currentViewOption: IViewOption;
    public positionView: string;
    // private expBtnHeight: number;
    public selectedOption: string;
    public selectOptions: any;
    public curDetails = {
        zm: 'zm',
        scl: 'scl',
        cntrlng: 'cntrlng',
        cntrlat: 'cntrlat',
        evlng: 'evlng',
        evlat: 'evlat'
    };
    private updateDetails = {
        zm:  (opt: IPositionParams) => {this.curDetails.zm = '' + opt.zm; this.curDetails.scl = '' + opt.scl; },
        cntr: (opt: IPositionParams) => {this.curDetails.cntrlng = opt.cntrlng; this.curDetails.cntrlat = opt.cntrlat; },
        coords: (opt: IPositionParams) => {this.curDetails.evlng = opt.evlng; this.curDetails.evlat = opt.evlat; }
    };
    private formatView = {
        zm: (zlevel: IPositionParams) =>  {
            const formatted = 'Zoom: ' + zlevel.zm + ' Scale: ' + zlevel.scl;
            this.positionView = formatted;
        },
        cntr: (cntr: IPositionParams) => {
            const formatted  = cntr.cntrlng + ', ' + cntr.cntrlat;
            this.positionView = formatted;
        },
        coords: (evnt: IPositionParams) => {
            const formatted  = evnt.evlng + ', ' + evnt.evlat;
            // console.log('old: ' + this.positionView + ' new ' + formatted);
            this.positionView = formatted;
        }
    };

    public viewOptions: IViewOption[] = [
        {
            type: 'zoom level',
            key: 'zm',
            value: 'zm, scale'
        },
        {
            type: 'map center',
            key: 'cntr',
            value: 'cntrlng, cntrlat'
        },
        {
            type: 'mouse coords',
            key: 'coords',
            value: 'evlng, evlat'
        }
    ];

    constructor(private positionUpdateService: PositionupdateService, private cdref: ChangeDetectorRef) {
        console.log('PositionViewCtrl - initialize dropdown for position selections');
        // let serv = new CurrentMapTypeService();
        // this.currentTab = serv.getMapTypeKey();

        this.positionUpdateService.positionData.subscribe(
          (data: IPositionData) => {
            // console.log(data);
            this.updatePosition(data.key, data.val);
          });

        // this.expBtnHeight = 1.2; // utils.getButtonHeight(1.5); //'verbageExpandCollapseImgId');
    }

    ngAfterViewInit() {
        this.currentViewOption = this.viewOptions[2];
        this.selectedOption = this.viewOptions[2].key;
        this.selectOptions = {
          mode: 'Popover'
        };
        // this.positionView = 'evlng, evlat';
        this.cdref.detectChanges();
    }

    onChangeSelection(itm: string) {
      this.selectedOption = itm;
      this.formatView[itm](this.curDetails);
    }

    updatePosition(key: string, val: IPositionParams) {
        if (key === 'zm' || key === 'cntr') {
            this.updateDetails.zm(val);
            this.updateDetails.cntr(val);
        } else {
          if (this.selectedOption === 'coords') {
              this.updateDetails[key](val);
          }
        }
        this.formatView[this.selectedOption](this.curDetails);
    }

}
