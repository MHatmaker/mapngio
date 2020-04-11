import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocateselfComponent } from './locateself.component';

describe('LocateselfComponent', () => {
  let component: LocateselfComponent;
  let fixture: ComponentFixture<LocateselfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocateselfComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocateselfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
