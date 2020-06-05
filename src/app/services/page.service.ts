
import {Injectable, EventEmitter} from '@angular/core';
import { MenuOptionModel } from '../components/side-menu-content/models/menu-option-model';

export interface MenuOpenEvent {
  menuName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PageService {

    currentPage = 'map';
    currentMapType = 'google';
    menuOption = new EventEmitter<MenuOptionModel>();
    menuOpenEvent = new EventEmitter<MenuOpenEvent>();

    constructor() {
    }

    setPage(p: string) {
        this.currentPage = p;
    }

    setMap(m: string) {
        this.currentMapType = m;
    }
}
