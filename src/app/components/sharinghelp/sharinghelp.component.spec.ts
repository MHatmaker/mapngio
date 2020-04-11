import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SharinghelpComponent } from './sharinghelp.component';

describe('SharinghelpComponent', () => {
  let component: SharinghelpComponent;
  let fixture: ComponentFixture<SharinghelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharinghelpComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SharinghelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
