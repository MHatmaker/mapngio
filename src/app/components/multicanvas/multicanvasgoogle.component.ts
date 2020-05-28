import { Component, OnDestroy, OnInit } from '@angular/core';
import { CanvasService } from '../../services/canvas.service';
import { SlideviewService } from '../../services/slideview.service';

@Component({
  selector: 'multi-canvas-google',
  templateUrl: './multicanvasgoogle.component.html'
})

export class MultiCanvasGoogle implements OnDestroy, OnInit {
    // private el: string = null;
    private currentSubscription;
    private ndx = 0;
    public slidevisibility = null; // 'multi-can-current';
    public mcactive = {
      position: 'absolute',
      display: 'none',
      top: '500px',
      height: '100%'
    };
    public mccurrent = {
      position: 'absolute',
      display: 'block'
    };

    constructor(private canvasService: CanvasService, private slideViewService: SlideviewService) {
    }
    ngOnInit() {
        this.ndx  = this.canvasService.getIndex();
        console.log('ndx is ' + this.ndx);
        this.currentSubscription = this.canvasService.setCurrent.subscribe((sn: number) => {
            console.log(`subscriber ndx ${this.ndx} received id ${sn}`);
            if (sn === this.ndx) {
              this.slidevisibility = this.mccurrent;
            } else {
              this.slidevisibility = this.mcactive;
            }
        });
    }
    ngOnDestroy() {
        this.currentSubscription.unsubscribe();
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
