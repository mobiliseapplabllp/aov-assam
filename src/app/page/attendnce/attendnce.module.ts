import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendncePageRoutingModule } from './attendnce-routing.module';

import { AttendncePage } from './attendnce.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AttendanceHistoryComponent } from './attendance-history/attendance-history.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendncePageRoutingModule,
    SharedModule
  ],
  declarations: [
    AttendncePage,
    AttendanceHistoryComponent]
})
export class AttendncePageModule {}
