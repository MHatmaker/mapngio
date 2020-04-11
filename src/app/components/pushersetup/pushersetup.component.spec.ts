import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PushersetupComponent } from './pushersetup.component';

describe('PushersetupComponent', () => {
  let component: PushersetupComponent;
  let fixture: ComponentFixture<PushersetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushersetupComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PushersetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
