import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DigitalChecklistPage } from './digital-checklist.page';
import { FillReportComponent } from './fill-report/fill-report.component';

const routes: Routes = [
  {
    path: '',
    component: DigitalChecklistPage
  }, {
    path: 'fill-report/:id/:behalf',
    component: FillReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DigitalChecklistPageRoutingModule {}
