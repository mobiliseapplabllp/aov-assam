import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuRoasterPageRoutingModule } from './menu-roaster-routing.module';

import { MenuRoasterPage } from './menu-roaster.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuRoasterPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [MenuRoasterPage]
})
export class MenuRoasterPageModule {}
