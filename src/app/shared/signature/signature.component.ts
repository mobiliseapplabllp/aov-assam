import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
})
export class SignatureComponent  implements OnInit {
  @ViewChild(SignaturePad, {static: true}) signaturePad: SignaturePad | undefined;
  // tslint:disable-next-line: ban-types
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
    this.closeModal(this.signaturePad?.toDataURL(), true);
    // if (this.signaturePad?.toDataURL()) {

    // }
  }

}
