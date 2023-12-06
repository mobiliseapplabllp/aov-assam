import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManualsPageRoutingModule } from './manuals-routing.module';

import { ManualsPage } from './manuals.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ManualsPageRoutingModule
  ],
  declarations: [ManualsPage]
})
export class ManualsPageModule {}
