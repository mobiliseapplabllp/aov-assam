import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddReadingComponent } from './add-reading.component';

describe('AddReadingComponent', () => {
  let component: AddReadingComponent;
  let fixture: ComponentFixture<AddReadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReadingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
