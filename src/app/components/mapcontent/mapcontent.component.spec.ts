import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapcontentComponent } from './mapcontent.component';

describe('MapcontentComponent', () => {
  let component: MapcontentComponent;
  let fixture: ComponentFixture<MapcontentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapcontentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
