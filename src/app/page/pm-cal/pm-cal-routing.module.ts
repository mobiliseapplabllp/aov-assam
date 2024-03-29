import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PmCalPage } from './pm-cal.page';
import { PmAssignComponent } from './pm-assign/pm-assign.component';
import { PmReportComponent } from './pm-report/pm-report.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { AddResponseComponent } from './add-response/add-response.component';
import { PtwUploadComponent } from './ptw-upload/ptw-upload.component';
import { ClosePmsComponent } from './close-pms/close-pms.component';

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
  },
  {
    path: 'view-report',
    component: ViewReportComponent
  },
  {
    path: 'add-response',
    component: AddResponseComponent
  },
  {
    path: 'upload-ptw',
    component: PtwUploadComponent
  },
  {
    path: 'close-pms',
    component: ClosePmsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PmCalPageRoutingModule {}
