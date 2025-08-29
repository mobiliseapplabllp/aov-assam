import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndentsPageRoutingModule } from './indents-routing.module';

import { IndentsPage } from './indents.page';
import { IndentCardComponent } from './indent-card/indent-card.component';
import { CrIndentComponent } from './cr-indent/cr-indent.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialComponent } from './material/material.component';
import { UomComponent } from './uom/uom.component';
import { IndAckComponent } from './ind-ack/ind-ack.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    IndentsPageRoutingModule,
    SharedModule
  ],
  declarations: [
    IndentsPage,
    IndentCardComponent,
    CrIndentComponent,
    MaterialComponent,
    UomComponent,
    IndAckComponent
  ]
})
export class IndentsPageModule {}
