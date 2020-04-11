import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LinkrhelpComponent } from './linkrhelp.component';

describe('LinkrhelpComponent', () => {
  let component: LinkrhelpComponent;
  let fixture: ComponentFixture<LinkrhelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkrhelpComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkrhelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
