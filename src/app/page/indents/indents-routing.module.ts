import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndentsPage } from './indents.page';
import { IndentCardComponent } from './indent-card/indent-card.component';
import { CrIndentComponent } from './cr-indent/cr-indent.component';
import { MaterialComponent } from './material/material.component';
import { UomComponent } from './uom/uom.component';

const routes: Routes = [
  {
    path: '',
    component: IndentsPage
  } , {
    path: 'indent-card',
    component: IndentCardComponent
  }, {
    path: 'cr-indent',
    component: CrIndentComponent
  }, {
    path: 'material',
    component: MaterialComponent
  }, {
    path: 'uom',
    component: UomComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndentsPageRoutingModule {}
