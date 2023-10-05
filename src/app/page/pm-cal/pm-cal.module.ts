import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PmCalPageRoutingModule } from './pm-cal-routing.module';

import { PmCalPage } from './pm-cal.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PmAssignComponent } from './pm-assign/pm-assign.component';
import { PmReportComponent } from './pm-report/pm-report.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PmCalPageRoutingModule,
    SharedModule
  ],
  declarations: [
    PmCalPage,
    PmAssignComponent,
    PmReportComponent]
})
export class PmCalPageModule {}
