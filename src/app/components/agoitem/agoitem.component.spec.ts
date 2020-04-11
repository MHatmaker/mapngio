import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgoitemComponent } from './agoitem.component';

describe('AgoitemComponent', () => {
  let component: AgoitemComponent;
  let fixture: ComponentFixture<AgoitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgoitemComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgoitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
