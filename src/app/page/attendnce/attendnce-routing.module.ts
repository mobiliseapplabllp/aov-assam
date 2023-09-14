import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendncePage } from './attendnce.page';
import { AttendanceHistoryComponent } from './attendance-history/attendance-history.component';

const routes: Routes = [
  {
    path: '',
    component: AttendncePage
  }, {
    path: 'attendance-history',
    component: AttendanceHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendncePageRoutingModule {}
