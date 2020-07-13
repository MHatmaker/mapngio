import { Component, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-accordion-list',
  templateUrl: './accordion-list.component.html',
  styleUrls: ['./accordion-list.component.scss'],
})

export class AccordionListComponent {
   @ViewChild('expandWrapper', {static: false, read: ElementRef}) expandWrapper: ElementRef;
    @Input('expanded') expanded: boolean;

    constructor(public renderer: Renderer2) {

    }

    // ngAfterViewInit(){
        // this.renderer.setElementStyle(this.expandWrapper.nativeElement, 'height', 'auto'); //this.itemExpandHeight + 'px');
      // if(this.expandHeight){
      //   this.renderer.setElementStyle(this.wrapper.nativeElement, 'height', this.expandHeight + 'px');
      // }
    // }

}
