import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DigitalChecklistOfflinePage } from './digital-checklist-offline.page';
import { FillReportOfflineComponent } from './fill-report-offline/fill-report-offline.component';

const routes: Routes = [
  {
    path: '',
    component: DigitalChecklistOfflinePage
  }, {
    path: 'fill-report-offline',
    component: FillReportOfflineComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DigitalChecklistOfflinePageRoutingModule {}
