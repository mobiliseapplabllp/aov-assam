import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApprovalPageRoutingModule } from './approval-routing.module';

import { ApprovalPage } from './approval.page';
import { IndentApprovalComponent } from './indent-approval/indent-approval.component';
import { PoApprovalComponent } from './po-approval/po-approval.component';
import { QueryModalComponent } from './query-modal/query-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApprovalPageRoutingModule
  ],
  declarations: [
    ApprovalPage,
    IndentApprovalComponent,
    PoApprovalComponent,
    QueryModalComponent]
})
export class ApprovalPageModule {}
