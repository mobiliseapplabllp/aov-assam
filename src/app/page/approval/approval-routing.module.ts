import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApprovalPage } from './approval.page';
import { IndentApprovalComponent } from './indent-approval/indent-approval.component';
import { PoApprovalComponent } from './po-approval/po-approval.component';
import { QueryModalComponent } from './query-modal/query-modal.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovalPage
  }, {
    path: 'indent-approval',
    component: IndentApprovalComponent
  }, {
    path: 'po-approval',
    component: PoApprovalComponent
  }, {
    path: 'query-modal',
    component: QueryModalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalPageRoutingModule {}
