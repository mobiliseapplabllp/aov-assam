import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DigitalChecklistOfflinePage } from './digital-checklist-offline.page';

describe('DigitalChecklistOfflinePage', () => {
  let component: DigitalChecklistOfflinePage;
  let fixture: ComponentFixture<DigitalChecklistOfflinePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalChecklistOfflinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DigitalChecklistOfflinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
