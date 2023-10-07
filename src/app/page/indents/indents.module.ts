import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndentsPageRoutingModule } from './indents-routing.module';

import { IndentsPage } from './indents.page';
import { IndentCardComponent } from './indent-card/indent-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IndentsPageRoutingModule
  ],
  declarations: [
    IndentsPage,
    IndentCardComponent]
})
export class IndentsPageModule {}
