import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeterPageRoutingModule } from './meter-routing.module';

import { MeterPage } from './meter.page';
import { AddReadingComponent } from './add-reading/add-reading.component';
import { AddMeterComponent } from './add-meter/add-meter.component';
import { HistoryComponent } from './history/history.component';
import { ReadingHistoryComponent } from './reading-history/reading-history.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DaysComponent } from './days/days.component';
import { AssignToComponent } from './assign-to/assign-to.component';
import { EscalateToComponent } from './escalate-to/escalate-to.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MeterPageRoutingModule,
    SharedModule
  ],
  declarations: [
    MeterPage,
    AddReadingComponent,
    AddMeterComponent,
    HistoryComponent,
    ReadingHistoryComponent,
    DaysComponent,
    AssignToComponent,
    EscalateToComponent]
})
export class MeterPageModule {}
