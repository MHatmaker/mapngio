import { Injectable } from '@angular/core';
// import { loadModules } from 'esri-loader';

// if (!String.prototype.format) {
//     String.prototype.format = () {
//         'use strict';
//         var args = arguments;
//         return this.replace(/{(\d+)}/g, (match, number) {
//             return args[number] !== 'undefined' ?
//                     args[number] : match;
//         });
//     };
// }
export interface ILonLatStrings {
  lon: string;
  lat: string;
}
const google: any = null;


@Injectable()
export class Utils {
    constructor() {
      // loadModules([
      //   'esri/core'
      // ]);
    }
    // stringFormat() {
    //     var args = arguments;
    //     return this.replace(/{(\d+)}/g, (match, number) {
    //         return args[number] !== 'undefined' ?
    //                 args[number] : match;
    //     });
    // }

    toFixedOne(val: number, prec: number) {
        const precision = prec || 0,
            neg = val < 0,
            power = Math.pow(10, precision),
            value = Math.round(val * power),
            integral = String((neg ? Math.ceil : Math.floor)(value / power)),
            fraction = String((neg ? -value : value) % power),
            padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
        let sign: string = neg ? '-' : '';

        if (integral[0] === '-') {
            sign = '';
        }
        return sign + (precision ? integral + '.' + padding + fraction : integral);
    }

    toFixedTwo(x: number, y: number, precision: number): ILonLatStrings {
        const fixed = {
            lon: this.toFixedOne(x, precision),
            lat: this.toFixedOne(y, precision)
        };
        return fixed;
    }

    fixCoords(pos: any) {
        return this.toFixedTwo(pos.lng, pos.lat, 5);
    }

    formatCoords(pos: any) {
        const fixed = this.fixCoords(pos),
            formatted = '<div style="color: blue;">' + fixed.lon + ', ' + fixed.lat + '</div>';
        return formatted;
    }

    getDocHeight() {
        // return Math.max(
        // document.body.scrollHeight, document.documentElement.scrollHeight,
        // document.body.offsetHeight, document.documentElement.offsetHeight,
        // document.body.clientHeight, document.documentElement.clientHeight
        // );
        return document.documentElement.offsetHeight; // window.innerHeight;
    }
    getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    getRootElementFontSize() {
        // Returns a number
        const fontSize = parseFloat(
            // of the computed font-size, so in px
            getComputedStyle(
                // for the root <html> element
                document.documentElement
            ).fontSize
        );
        return fontSize;
    }

    convertRem(value: number) {
        return value * this.getRootElementFontSize();
    }

    getButtonHeight(m: number) {
        const btnHeight = this.convertRem(m);
        // btnHeight = btnHeight; // / 16;
        return btnHeight;
    }

    getElemHeight(itm: string) {
        const elem = document.getElementById(itm),
            elemHeight = elem.clientHeight;
        return elemHeight;
    }

    setElementHeight(itm: string, hgt: number, units: string) {
        let elem: HTMLElement = null, hstr = '';
        // var elem = utils.getElemById(itm)[0];
        if (units === undefined) {
            units = 'px';
        }
        elem = document.getElementById(itm);
        // hstr = String.format('{0}{1}", hgt, units);'
        hstr = '{hgt},{units}';
        // elem.css({'height': hstr});
        elem.setAttribute('style', 'height:' + hstr);
    }

    setElementWidth(itm: any, wdth: number, units: string) {
        // var elem, wstr;
        // var elem = utils.getElemById(itm)[0];
        if (units === undefined) {
            units = 'px';
        }
        // elem = document.getElementById(itm);
        // wstr = String.format('{0}{1}', wdth, units);
        // elem.css({'height': hstr});
    }

    getElementDimension(itm: string, dim: string) {
        const elem = document.getElementById(itm),
            ElemDim = dim === 'height' ? elem.clientHeight : elem.clientWidth;
        console.log(itm + ' ' + dim + ' is initially ' + ElemDim);
        return ElemDim;
    }

    setElementDimension(itm: string, dim: string, value: string , units: string) {
        let elem: HTMLElement, dimstr: string;
        if (units === undefined) {
            units = 'px';
        }
        elem = document.getElementById(itm);
        // dimstr = String.format('{0} : {1}{2}', dim, value, units);
        dimstr = '{dim} : {value}{units}';
        console.log('dim string : ' + dimstr);
        elem.setAttribute('style', dimstr);
    }

    getElemById(id: string) {
        // return document.getElementById(id).nativeElement;
        return null;
    }

    setVisible(itm: string, flexnone: string) {
        const elem = document.getElementById(itm);
        // elem.visible = flexnone === 'block' ? 'visible' : 'none';
        elem.style.display = flexnone;
    }

    geoLocate(pos: any, mlmap: any, msg: string) {
        const infoWindow = new google.maps.InfoWindow({
            content : msg
            // map: mlmap
        });
        infoWindow.setPosition(pos);
        infoWindow.setContent(this.formatCoords(pos));
        console.log(msg);
        console.log('geoLocate just happened at ' + pos.lng + ', ' + pos.lat);
    }

    showMap(mpopt: any) {
        // pos = {'lat' : cntr.lat, 'lng' : cntr.lng};
        const pos = {
                lat: mpopt.center.lat(),
                lng: mpopt.center.lng()
            },
            fixed = this.fixCoords(pos),
            mapdiv = document.getElementById('mapdiv'),
            mlmap = new google.maps.Map(mapdiv, mpopt);

        console.log('In showMap: Create map centered at ' + fixed.lon + ', ' + fixed.lat);
        mlmap.setCenter(mpopt.center);
        // console.debug(mpopt.center);
        this.geoLocate(pos, mlmap, 'Calling geoLocate from showMap');
        return mlmap;
    }

    showLoading() {
        console.log('show loading');
        // esri.show(loading);
    }

    hideLoading(error: string) {
        console.log('hide loading');
        // esri.hide(loading);
    }

    getParameterByName(name: string, searchUrl: string) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
            results = regex.exec(searchUrl);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
}
