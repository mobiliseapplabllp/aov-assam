import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DigitalChecklistOfflinePageRoutingModule } from './digital-checklist-offline-routing.module';

import { DigitalChecklistOfflinePage } from './digital-checklist-offline.page';
import { FillReportOfflineComponent } from './fill-report-offline/fill-report-offline.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DigitalChecklistOfflinePageRoutingModule,
    SharedModule
  ],
  declarations: [
    DigitalChecklistOfflinePage,
    FillReportOfflineComponent]
})
export class DigitalChecklistOfflinePageModule {}
