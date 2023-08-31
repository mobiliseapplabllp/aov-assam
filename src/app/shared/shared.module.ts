import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignatureComponent } from './signature/signature.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SignatureComponent
  ],
  imports: [
    CommonModule,
    SignaturePadModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    SignatureComponent
  ]
})
export class SharedModule { }
