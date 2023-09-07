import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignatureComponent } from './signature/signature.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CameraComponent } from './camera/camera.component';



@NgModule({
  declarations: [
    SignatureComponent,
    CameraComponent
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
    CameraComponent
  ]
})
export class SharedModule { }
