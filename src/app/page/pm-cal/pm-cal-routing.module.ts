import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PmCalPage } from './pm-cal.page';
import { PmAssignComponent } from './pm-assign/pm-assign.component';
import { PmReportComponent } from './pm-report/pm-report.component';

const routes: Routes = [
  {
    path: '',
    component: PmCalPage
  },
  {
    path: 'pm-assign',
    component: PmAssignComponent
  },
  {
    path: 'pm-report',
    component: PmReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PmCalPageRoutingModule {}
