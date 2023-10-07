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
@NgModule({
  declarations: [
    SignatureComponent,
    CameraComponent,
    CostCenterComponent,
    QueryCatComponent,
    QuerySubCatComponent,
    QuerySubCat2Component,
    BarcodeComponent,
    AssetPlantComponent
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
    AssetPlantComponent
  ]
})
export class SharedModule { }
