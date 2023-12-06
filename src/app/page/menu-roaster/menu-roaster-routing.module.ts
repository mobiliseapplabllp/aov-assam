import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuRoasterPage } from './menu-roaster.page';

const routes: Routes = [
  {
    path: '',
    component: MenuRoasterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuRoasterPageRoutingModule {}
