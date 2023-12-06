import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IndentCardComponent } from './indent-card.component';

describe('IndentCardComponent', () => {
  let component: IndentCardComponent;
  let fixture: ComponentFixture<IndentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndentCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IndentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
