import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndentsPage } from './indents.page';
import { IndentCardComponent } from './indent-card/indent-card.component';

const routes: Routes = [
  {
    path: '',
    component: IndentsPage
  } , {
    path: 'indent-card',
    component: IndentCardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndentsPageRoutingModule {}
