import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeterPage } from './meter.page';
import { AddReadingComponent } from './add-reading/add-reading.component';
import { AddMeterComponent } from './add-meter/add-meter.component';
import { HistoryComponent } from './history/history.component';
import { ReadingHistoryComponent } from './reading-history/reading-history.component';
import { DaysComponent } from './days/days.component';
import { AssignToComponent } from './assign-to/assign-to.component';
import { EscalateToComponent } from './escalate-to/escalate-to.component';

const routes: Routes = [
  {
    path: '',
    component: MeterPage
  }, {
    path: 'add-reading',
    component: AddReadingComponent
  }, {
    path: 'add-meter',
    component: AddMeterComponent
  }, {
    path: 'history',
    component: HistoryComponent
  }, {
    path:'reading-history',
    component: ReadingHistoryComponent
  }, {
    path: 'days',
    component: DaysComponent
  }, {
    path: 'assign-to',
    component: AssignToComponent
  }, {
    path: 'escalate-to',
    component: EscalateToComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeterPageRoutingModule {}
