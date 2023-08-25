import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAssetPageRoutingModule } from './add-asset-routing.module';

import { AddAssetPage } from './add-asset.page';
import { AssetPlantComponent } from './asset-plant/asset-plant.component';
import { AssetDepartmentComponent } from './asset-department/asset-department.component';
import { AssetDevicenameComponent } from './asset-devicename/asset-devicename.component';
import { AssetManufacturerComponent } from './asset-manufacturer/asset-manufacturer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddAssetPageRoutingModule
  ],
  declarations: [
    AddAssetPage,
    AssetPlantComponent,
    AssetDepartmentComponent,
    AssetDevicenameComponent,
    AssetManufacturerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddAssetPageModule {}
