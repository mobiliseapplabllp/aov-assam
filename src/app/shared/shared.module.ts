import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignatureComponent } from './signature/signature.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CameraComponent } from './camera/camera.component';
import { CostCenterComponent } from './cost-center/cost-center.component';
import { QueryCatComponent } from './query-cat/query-cat.component';
import { QuerySubCatComponent } from './query-sub-cat/query-sub-cat.component';
import { QuerySubCat2Component } from './query-sub-cat2/query-sub-cat2.component';
import { BarcodeComponent } from './barcode/barcode.component';
import { AssetPlantComponent } from '../page/add-asset/asset-plant/asset-plant.component';
import { FloorComponent } from './floor/floor.component';
import { LocationComponent } from './location/location.component';
import { DeviceGroupComponent } from './device-group/device-group.component';
import { EmpSearchComponent } from './emp-search/emp-search.component';
@NgModule({
  declarations: [
    SignatureComponent,
    CameraComponent,
    CostCenterComponent,
    QueryCatComponent,
    QuerySubCatComponent,
    QuerySubCat2Component,
    BarcodeComponent,
    AssetPlantComponent,
    FloorComponent,
    LocationComponent,
    DeviceGroupComponent,
    EmpSearchComponent
  ],
  imports: [
    CommonModule,
    SignaturePadModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    SignatureComponent,
    CameraComponent,
    CostCenterComponent,
    QueryCatComponent,
    QuerySubCatComponent,
    QuerySubCat2Component,
    BarcodeComponent,
    AssetPlantComponent,
    FloorComponent,
    LocationComponent,
    DeviceGroupComponent,
    EmpSearchComponent
  ]
})
export class SharedModule { }
