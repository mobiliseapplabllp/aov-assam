import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PmCalPageRoutingModule } from './pm-cal-routing.module';

import { PmCalPage } from './pm-cal.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PmAssignComponent } from './pm-assign/pm-assign.component';
import { PmReportComponent } from './pm-report/pm-report.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { AddResponseComponent } from './add-response/add-response.component';
import { PtwUploadComponent } from './ptw-upload/ptw-upload.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PmCalPageRoutingModule,
    SharedModule
  ],
  declarations: [
    PmCalPage,
    PmAssignComponent,
    PmReportComponent,
    ViewReportComponent,
    AddResponseComponent,
    PtwUploadComponent]
})
export class PmCalPageModule {}
