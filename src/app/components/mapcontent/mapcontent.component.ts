import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapcontent',
  templateUrl: './mapcontent.component.html',
  styleUrls: ['./mapcontent.component.scss'],
})
export class MapcontentComponent implements OnInit {
  @Input() hasPusherKeys: any;

  constructor() {
    console.log('mapcontent ctor');
}

  ngOnInit() {
    console.log('mapcontent onInit');
  }

}
