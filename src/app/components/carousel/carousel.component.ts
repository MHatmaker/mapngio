
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgZone} from '@angular/core';
import { MapinstanceService } from '../../services/mapinstance.service';
import { SlideshareService } from '../../services/slideshare.service';
import { ISlideData } from '../../services/slidedata.interface';
import { CanvasService } from '../../services/canvas.service';
import { SlideviewService } from '../../services/slideview.service';
import { DoublyLinkedList, DoublyLinkedListNode } from '../../libs/DoublyLinkedList';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
    // console.log('Carousel : ready to set up Carousel');
    private items: DoublyLinkedList<ISlideData> = new DoublyLinkedList<ISlideData>();
    private activeSlide: DoublyLinkedListNode<ISlideData> = null;
    private MapName = 'no map name';

    private mapcolheight = 510;
    private mapcolWidth: number = window.innerWidth;
    private slidesCount = 0;
    private showNavButtons = false;
    private showMapText = false;
    private ActNoAct = 'active';

  constructor(
    private mapInstanceService: MapinstanceService, private slideshareService: SlideshareService,
    private canvasService: CanvasService, private ngZone: NgZone, private slideViewService: SlideviewService) {
        console.log('Carousel ctor');
        this.mapcolheight = slideViewService.getMapColHeight();
        // this.currentSlide = this.items[0] || null;
        this.slideshareService.slideData.subscribe(
          (data: ISlideData) => {
            console.log(data);
            this.onAddSlide(data);
          });
        this.slideshareService.slideRemove.subscribe(
            (val: number) => {
              console.log('remove a slide');
              this.onRemoveSlide();
        });
    }

    onUpdate(event) {
        console.log('onUpdate in CarouselComponent');
        console.log(event);
      }
    // navigate through the carousel
    private navigate(direction: number) {
        console.log('change activeSlideNumber from ' + this. activeSlide.value.slideNumber);
        // calculate the new position

        if (direction < 0) {
          if (this.activeSlide.prev) {
            this.activeSlide = this.activeSlide.prev;
          } else {
            this.activeSlide = this.items.tail;
          }
        } else {
          if (this.activeSlide.next) {
            this.activeSlide = this.activeSlide.next;
          } else {
            this.activeSlide = this.items.head;
          }
        }
        console.log('to activeSlideNumber ' + this.activeSlide.value.slideNumber);
        this.MapName = this.activeSlide.value.mapName;
        this.canvasService.setCurrent.emit(this.activeSlide.value.slideNumber);
        this.mapInstanceService.setCurrentSlide(this.activeSlide.value.slideNumber);
    }

    onAddSlide(slideData: ISlideData) {
        console.log('Carousel Component onAddSlide to DoublyLinkedList');
        console.log(slideData);
        this.items.add(slideData);
        this.activeSlide = this.items.tail;
        this.canvasService.setCurrent.emit(this.activeSlide.value.slideNumber);
        this.MapName = this.activeSlide.value.mapName;

        this.slidesCount = this.items.listLength();
        this.showNavButtons = this.slidesCount  > 1;
        this.showMapText = this.slidesCount > 0;
    }
    onRemoveSlide(): number {
        const slideToRemove = this.activeSlide.value.slideNumber,
              slideElement = document.getElementById('slide' + slideToRemove).parentElement;
        console.log('remove slide ' + slideToRemove);
        if (slideToRemove > -1) {
            // slide being removed must unsubscribe??????
            // this.items.removeNode(slideToRemove); //splice(slideToRemove, 1);
            console.log(this.items.values());
            // for(let val : DoublyLinkedListNode<ISlideData> of this.items.values) {
            //   if (val)
            const v = this.items.values();
            let itm = v.next();
            while (itm.done === false) {
              console.log(itm.value.mapName);
              itm = v.next();
            }
            const n = this.items.nodes();
            let nd: DoublyLinkedListNode<ISlideData> = this.items.head;
            while (nd) {
              if (nd.value.mapName === this.activeSlide.value.mapName) {
                this.items.removeNode(nd);
                this.mapInstanceService.removeConfigInstances(this.activeSlide.value.slideNumber);
              }
              nd = nd.next;
            }

            this.slidesCount = this.items.listLength();
            this.showNavButtons = this.slidesCount  > 1;
            this.showMapText = this.slidesCount > 0;
            console.log('items length is now ' + this.items.listLength());
            if (slideToRemove) {
                slideElement.remove();
            }
            this.navigate(-1);
            return 0;
        }

    }
    // add event handlers to buttons
    onClickNext() {
        this.navigate(1);
    }
    onClickPrev() {
        this.navigate(-1);
    }

    getCurrentSlideNumber() {
        return this.activeSlide.value.slideNumber;
    }

}
