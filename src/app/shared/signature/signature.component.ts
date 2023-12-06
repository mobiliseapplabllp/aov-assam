import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
})
export class SignatureComponent  implements OnInit {
  @ViewChild(SignaturePad, { static: true }) signaturePad!: SignaturePad;
  public signaturePadOptions: Object = {
    minWidth: 2,
    canvasWidth: 800,
    canvasHeight: 300
  };
  constructor(
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  closeModal(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  drawStart() {}

  drawComplete() {}

  submit() {
    console.log('a');
    console.log(this.signaturePad?.toDataURL());

    this.closeModal(this.signaturePad?.toDataURL(), true);
  }

}
