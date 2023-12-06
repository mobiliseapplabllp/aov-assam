import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeterPage } from './meter.page';
import { AddReadingComponent } from './add-reading/add-reading.component';
import { AddMeterComponent } from './add-meter/add-meter.component';
import { HistoryComponent } from './history/history.component';
import { ReadingHistoryComponent } from './reading-history/reading-history.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeterPageRoutingModule {}
