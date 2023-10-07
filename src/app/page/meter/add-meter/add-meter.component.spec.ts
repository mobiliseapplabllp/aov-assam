import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddMeterComponent } from './add-meter.component';

describe('AddMeterComponent', () => {
  let component: AddMeterComponent;
  let fixture: ComponentFixture<AddMeterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMeterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
