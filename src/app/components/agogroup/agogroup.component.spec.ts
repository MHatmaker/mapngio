import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgogroupComponent } from './agogroup.component';

describe('AgogroupComponent', () => {
  let component: AgogroupComponent;
  let fixture: ComponentFixture<AgogroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgogroupComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgogroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
