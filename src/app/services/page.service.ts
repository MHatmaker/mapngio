
import {Injectable, EventEmitter} from '@angular/core';
import { MenuOptionModel } from '../components/side-menu-content/models/menu-option-model';

@Injectable({
  providedIn: 'root'
})
export class PageService {

    currentPage = 'map';
    currentMapType = 'google';
    menuOption = new EventEmitter<MenuOptionModel>();

    constructor() {
    }

    setPage(p: string) {
        this.currentPage = p;
    }

    setMap(m: string) {
        this.currentMapType = m;
    }
}
