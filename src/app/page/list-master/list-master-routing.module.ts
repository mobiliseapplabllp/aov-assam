import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListMasterPage } from './list-master.page';
import { OfflineDataComponent } from './offline-data/offline-data.component';

const routes: Routes = [
  {
    path: '',
    component: ListMasterPage
  }, {
    path: 'offline-data',
    component: OfflineDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListMasterPageRoutingModule {}
