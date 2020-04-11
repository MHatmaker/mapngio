"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
// import { loadModules } from 'esri-loader';
// if (!String.prototype.format) {
//     String.prototype.format = () {
//         "use strict";
//         var args = arguments;
//         return this.replace(/{(\d+)}/g, (match, number) {
//             return args[number] !== 'undefined' ?
//                     args[number] : match;
//         });
//     };
// }
var utils = /** @class */ (function () {
    function utils() {
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
    utils.prototype.toFixedOne = function (val, prec) {
        var precision = prec || 0, neg = val < 0, power = Math.pow(10, precision), value = Math.round(val * power), integral = String((neg ? Math.ceil : Math.floor)(value / power)), fraction = String((neg ? -value : value) % power), padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0'), sign = neg ? "-" : "";
        if (integral[0] === '-') {
            sign = "";
        }
        return sign + (precision ? integral + '.' + padding + fraction : integral);
    };
    utils.prototype.toFixedTwo = function (x, y, precision) {
        var fixed = {
            lon: this.toFixedOne(x, precision),
            lat: this.toFixedOne(y, precision)
        };
        return fixed;
    };
    utils.prototype.fixCoords = function (pos) {
        return this.toFixedTwo(pos.lng, pos.lat, 5);
    };
    utils.prototype.formatCoords = function (pos) {
        var fixed = this.fixCoords(pos), formatted = '<div style="color: blue;">' + fixed.lon + ', ' + fixed.lat + '</div>';
        return formatted;
    };
    utils.prototype.getDocHeight = function () {
        // return Math.max(
        // document.body.scrollHeight, document.documentElement.scrollHeight,
        // document.body.offsetHeight, document.documentElement.offsetHeight,
        // document.body.clientHeight, document.documentElement.clientHeight
        // );
        return document.documentElement.offsetHeight; //window.innerHeight;
    };
    utils.prototype.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    utils.prototype.getRootElementFontSize = function () {
        // Returns a number
        var fontSize = parseFloat(
        // of the computed font-size, so in px
        getComputedStyle(
        // for the root <html> element
        document.documentElement).fontSize);
        return fontSize;
    };
    utils.prototype.convertRem = function (value) {
        return value * this.getRootElementFontSize();
    };
    utils.prototype.getButtonHeight = function (m) {
        var btnHeight = this.convertRem(m);
        // btnHeight = btnHeight; // / 16;
        return btnHeight;
    };
    utils.prototype.getElemHeight = function (itm) {
        var elem = document.getElementById(itm), elemHeight = elem.clientHeight;
        return elemHeight;
    };
    utils.prototype.setElementHeight = function (itm, hgt, units) {
        var elem, hstr;
        // var elem = utils.getElemById(itm)[0];
        if (units === undefined) {
            units = 'px';
        }
        elem = document.getElementById(itm);
        // hstr = String.format("{0}{1}", hgt, units);
        hstr = "{hgt},{units}";
        // elem.css({"height": hstr});
        elem.setAttribute("style", "height:" + hstr);
    };
    utils.prototype.setElementWidth = function (itm, wdth, units) {
        // var elem, wstr;
        // var elem = utils.getElemById(itm)[0];
        if (units === undefined) {
            units = 'px';
        }
        // elem = document.getElementById(itm);
        // wstr = String.format("{0}{1}", wdth, units);
        // elem.css({"height": hstr});
    };
    utils.prototype.getElementDimension = function (itm, dim) {
        var elem = document.getElementById(itm), ElemDim = dim === 'height' ? elem.clientHeight : elem.clientWidth;
        console.log(itm + ' ' + dim + ' is initially ' + ElemDim);
        return ElemDim;
    };
    utils.prototype.setElementDimension = function (itm, dim, value, units) {
        var elem, dimstr;
        if (units === undefined) {
            units = 'px';
        }
        elem = document.getElementById(itm);
        // dimstr = String.format("{0} : {1}{2}", dim, value, units);
        dimstr = "{dim} : {value}{units}";
        console.log("dim string : " + dimstr);
        elem.setAttribute("style", dimstr);
    };
    utils.prototype.getElemById = function (id) {
        // return document.getElementById(id).nativeElement;
        return null;
    };
    utils.prototype.setVisible = function (itm, flexnone) {
        var elem = document.getElementById(itm);
        // elem.visible = flexnone === 'block' ? 'visible' : 'none';
        elem.style.display = flexnone;
    };
    utils.prototype.geoLocate = function (pos, mlmap, msg) {
        var infoWindow = new google.maps.InfoWindow({
            content: msg
            // map: mlmap
        });
        infoWindow.setPosition(pos);
        infoWindow.setContent(this.formatCoords(pos));
        console.log(msg);
        console.log('geoLocate just happened at ' + pos.lng + ", " + pos.lat);
    };
    utils.prototype.showMap = function (mpopt) {
        // pos = {'lat' : cntr.lat, 'lng' : cntr.lng};
        var pos = {
            'lat': mpopt.center.lat(),
            'lng': mpopt.center.lng()
        }, fixed = this.fixCoords(pos), mapdiv = document.getElementById('mapdiv'), mlmap = new google.maps.Map(mapdiv, mpopt);
        console.log("In showMap: Create map centered at " + fixed.lon + ", " + fixed.lat);
        mlmap.setCenter(mpopt.center);
        //console.debug(mpopt.center);
        this.geoLocate(pos, mlmap, "Calling geoLocate from showMap");
        return mlmap;
    };
    utils.prototype.showLoading = function () {
        console.log("show loading");
        // esri.show(loading);
    };
    utils.prototype.hideLoading = function (error) {
        console.log("hide loading");
        // esri.hide(loading);
    };
    utils.prototype.getParameterByName = function (name, searchUrl) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(searchUrl);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    utils = __decorate([
        core_1.Injectable()
    ], utils);
    return utils;
}());
exports.utils = utils;
