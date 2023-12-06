import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DigitalChecklistPageRoutingModule } from './digital-checklist-routing.module';

import { DigitalChecklistPage } from './digital-checklist.page';
import { FillReportComponent } from './fill-report/fill-report.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DigitalChecklistPageRoutingModule,
    SharedModule
  ],
  declarations: [
    DigitalChecklistPage,
    FillReportComponent]
})
export class DigitalChecklistPageModule {}
