import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MsgsetupComponent } from './msgsetup.component';

describe('MsgsetupComponent', () => {
  let component: MsgsetupComponent;
  let fixture: ComponentFixture<MsgsetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgsetupComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MsgsetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
