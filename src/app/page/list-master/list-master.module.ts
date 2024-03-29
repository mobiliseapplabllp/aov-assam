import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListMasterPageRoutingModule } from './list-master-routing.module';

import { ListMasterPage } from './list-master.page';
import { OfflineDataComponent } from './offline-data/offline-data.component';
// import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListMasterPageRoutingModule,
    // SharedModule
  ],
  declarations: [
    ListMasterPage,
    OfflineDataComponent]
})
export class ListMasterPageModule {}
