import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SharemapComponent } from './sharemap.component';

describe('SharemapComponent', () => {
  let component: SharemapComponent;
  let fixture: ComponentFixture<SharemapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharemapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SharemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
