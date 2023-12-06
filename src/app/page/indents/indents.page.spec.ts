import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IndentsPage } from './indents.page';

describe('IndentsPage', () => {
  let component: IndentsPage;
  let fixture: ComponentFixture<IndentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndentsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IndentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
