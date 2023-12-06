import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MealCheckinPageRoutingModule } from './meal-checkin-routing.module';

import { MealCheckinPage } from './meal-checkin.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MealCheckinPageRoutingModule,
    SharedModule
  ],
  declarations: [
    MealCheckinPage
  ]
})
export class MealCheckinPageModule {}
