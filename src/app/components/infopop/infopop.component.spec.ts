import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfopopComponent } from './infopop.component';

describe('InfopopComponent', () => {
  let component: InfopopComponent;
  let fixture: ComponentFixture<InfopopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfopopComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfopopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
