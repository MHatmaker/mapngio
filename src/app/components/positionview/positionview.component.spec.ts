import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PositionviewComponent } from './positionview.component';

describe('PositionviewComponent', () => {
  let component: PositionviewComponent;
  let fixture: ComponentFixture<PositionviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionviewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PositionviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
