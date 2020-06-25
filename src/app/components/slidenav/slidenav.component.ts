import { Component, Input } from '@angular/core';
import { Islidenav } from '../../services/slidenav.service';

@Component({
  selector: 'app-slidenav',
  templateUrl: './slidenav.component.html',
  styleUrls: ['./slidenav.component.scss'],
})

export class SlidenavComponent {
  @Input() slideNav: Islidenav;

}
