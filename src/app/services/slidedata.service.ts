import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlidedataService {

      constructor(private mapListElement: any, private slideNumber: number, private mapName: string) {
      }
}
