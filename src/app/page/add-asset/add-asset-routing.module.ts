import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAssetPage } from './add-asset.page';
import { AssetPlantComponent } from './asset-plant/asset-plant.component';
import { AssetDepartmentComponent } from './asset-department/asset-department.component';
import { AssetDevicenameComponent } from './asset-devicename/asset-devicename.component';
import { AssetManufacturerComponent } from './asset-manufacturer/asset-manufacturer.component';

const routes: Routes = [
  {
    path: '',
    component: AddAssetPage
  }, {
    path: 'asset-plant',
    component: AssetPlantComponent
  }, {
    path: 'asset-department',
    component: AssetDepartmentComponent
  }, {
    path: 'asset-devicename',
    component: AssetDevicenameComponent
  }, {
    path: 'asset-manufacturer',
    component: AssetManufacturerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAssetPageRoutingModule {}
