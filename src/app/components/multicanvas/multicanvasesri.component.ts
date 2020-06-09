import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'multi-canvas-esri',
  templateUrl: './multicanvasesri.component.html',
  styles: ['./multicanvas.component.css']
})

export class MultiCanvasEsri implements OnInit, AfterViewInit {
    // private el: string = null;
    private ndx: number = null;
    public slidevisibility: any;
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

    constructor(private canvasService: CanvasService, private cd: ChangeDetectorRef) {
        this.ndx = this.canvasService.getIndex();
        console.log('ndx is ' + this.ndx);
        this.canvasService.setCurrent.subscribe((sn: number) => {
            console.log(`subscriber received id ${sn}`);
            if (sn === this.ndx) {
              this.slidevisibility = this.mccurrent;
            } else {
              this.slidevisibility = this.mcactive;
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
      ngOnInit() {
        // this.ndx = this.canvasService.getIndex();
        // console.log('ndx is ' + this.ndx);
      }
      ngAfterViewInit() {
        // this.cd.detectChanges();
        // this.ndx = this.canvasService.getIndex();
        // console.log('ndx is ' + this.ndx);
        // this.cd.detectChanges();
      }

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
