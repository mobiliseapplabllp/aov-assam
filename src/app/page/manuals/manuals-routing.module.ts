import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManualsPage } from './manuals.page';

const routes: Routes = [
  {
    path: '',
    component: ManualsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManualsPageRoutingModule {}
