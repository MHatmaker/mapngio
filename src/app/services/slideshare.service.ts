
import { Injectable, EventEmitter } from '@angular/core';
import { ISlideData } from './slidedata.interface';

@Injectable({
  providedIn: 'root'
})

export class SlideshareService {
    slideData = new EventEmitter<ISlideData>();
    slideRemove = new EventEmitter();
}
