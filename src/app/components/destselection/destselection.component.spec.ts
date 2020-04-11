import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DestselectionComponent } from './destselection.component';

describe('DestselectionComponent', () => {
  let component: DestselectionComponent;
  let fixture: ComponentFixture<DestselectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestselectionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DestselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
