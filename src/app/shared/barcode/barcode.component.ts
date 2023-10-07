import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.scss'],
})
export class BarcodeComponent  implements OnInit {
  barcodeNo: any;
  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private common: CommonService
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    if (this.platform.is('android')) {
      this.startScan();
    } else {
      let random = 'https://ifmsuat.mobilisepro.com/#/complaint-qr-code/eyJpdiI6Ik1USXpORFUyTnpnNU1UQXhNVEV5TVE9PSIsInZhbHVlIjoiUVI2TzdJdWlwQStTcjhyN3Zocmxudz09IiwibWFjIjoiMDFiZmRlMWRmNDdmOWQ4N2M3MzEzZGFmOGYzYmU3YmFkNmRlNjlhMWM2YTIyNjYzNTU2N2I3NjRmYmFjZjZlOSJ9';
      this.barcodeNo = random;
      setTimeout(() => {
        this.common.setBarcode(this.barcodeNo);
        this.navCtrl.pop();
      }, 1000);
    }
  }

  ionViewDidLeave() {
    this.stopScan();
  }

  startScan() {
    const startScan = async () => {
      await BarcodeScanner.checkPermission({ force: true });
      BarcodeScanner.prepare();
      BarcodeScanner.hideBackground();
      document.querySelector('body')?.classList.add('scanner-active');
      const result = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] });
      if (result.hasContent) {
        this.barcodeNo = result.content
        console.log(result.content);
        this.common.setBarcode(this.barcodeNo);
        this.stopScan();
        this.navCtrl.pop();
      }
    };
    startScan();
  }

  stopScan() {
    const stopScan = () => {
      document.querySelector('body')?.classList.remove('scanner-active');
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
    };
    stopScan();
  }

  stopScanner() {
    this.stopScan();
    this.navCtrl.pop();
  }


}
