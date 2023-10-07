import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  public barcode!: string;
  constructor(
    private toastController: ToastController
  ) { }

  setBarcode(barcode: string) {
    this.barcode = barcode
  }

  getBarcode() {
    return this.barcode;
  }



  async presentToast(msg: any, clr: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: clr
    });
    toast.present();
  }

  async presentToastWithOk(data: any, clr: any) {
    const toast = await this.toastController.create({
      message: data,
      position: 'bottom',
      color: clr,
      buttons: [{
        text: 'OK',
        role: 'cancel',
        handler: () => {}
      }]
    });
    await toast.present();
    const { role } = await toast.onDidDismiss();
  }

  openDoc(url: any) {
    if (!url) {
      alert('Attachment Not Available');
      return;
    }
    console.log(url);
    let brecked;
    brecked = url.split('.');
    let ext;
    ext = brecked[brecked.length - 1];
    // window.open(url, '_blank', 'location=no,zoom=yes');
    if (ext === 'pdf') {
      window.open(url, '_system', 'location=no,zoom=yes');
    } else {
      window.open(url, '_blank', 'location=no,zoom=yes');
    }
  }
}
