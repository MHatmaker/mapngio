import { Injectable, EventEmitter } from '@angular/core';
import { IPositionData } from './positionupdate.interface'

@Injectable({
  providedIn: 'root'
})
export class PositionupdateService {
    positionData = new EventEmitter<IPositionData>();

  constructor() { }
}
