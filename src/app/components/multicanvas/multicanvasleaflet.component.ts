import { Component } from '@angular/core';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'maplinkr-leafletmap',
  templateUrl: './multicanvasleaflet.component.html',
  styleUrls: ['./multicanvas.component.css']
})

export class MultiCanvasLeaflet {
    // private el: string = null;
    private ndx = null;
    private mapcolheight = 510;
    public slidevisibility = 'multi-can-current';

    constructor(private canvasService: CanvasService) {
        this.ndx = this.canvasService.getIndex();
        console.log('ndx is ' + this.ndx);
        this.canvasService.setCurrent.subscribe((sn: number) => {
            console.log(`subscriber received id ${sn}`);
            if (sn === this.ndx) {
              this.slidevisibility = 'multi-can-current';
            } else {
              this.slidevisibility = 'multi-can-active';
            }
        });
    }
    /*
            Canvas.prototype.init = function () {
                var mapParent = document.getElementsByClassName('MapContainer')[0];

                this.el.style.backgroundColor = '#888';
                // this.el.addEventListener('mousedown', this.onMouseDown.bind(this));
                // this.el.addEventListener('mousemove', this.onMouseMove.bind(this));

                mapParent.appendChild(this.el);
            };
      */

    onMouseDown(event) {
        console.log('onMouseDown: '); // , this.el);
        console.log(event.srcElement);
        // event.cancelBubble=true;
        // event.stopPropagation();
    }
    onMouseMove(event) {
        // console.log('onMouseMove: ', this.el);
        event.preventDefault();
        // event.cancelBubble=true;
        // event.stopPropagation();
    }
}
