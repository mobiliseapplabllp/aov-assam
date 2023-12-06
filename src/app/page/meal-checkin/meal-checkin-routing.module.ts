import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MealCheckinPage } from './meal-checkin.page';

const routes: Routes = [
  {
    path: '',
    component: MealCheckinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MealCheckinPageRoutingModule {}
