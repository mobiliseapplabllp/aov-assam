import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeterPage } from './meter.page';

describe('MeterPage', () => {
  let component: MeterPage;
  let fixture: ComponentFixture<MeterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
