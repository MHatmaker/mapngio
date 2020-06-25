import { Injectable } from '@angular/core';

export interface Islidenav {
  MapName: string;
  showNavButtons: boolean;
  showMapText: boolean;
  host: any;
}

@Injectable({
  providedIn: 'root'
})
export class SlidenavService {

  constructor(
    public MapName: string,
    public showNavButtons: boolean,
    public showMapText: boolean,
    public host: any) { }
}
