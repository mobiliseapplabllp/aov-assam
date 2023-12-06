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

  ngOnInit() { }

  ionViewDidEnter() {
    if (this.platform.is('capacitor')) {
      this.startScan();
    } else {
      let random = 'https://ifmsuat.mobilisepro.com/#/create-ticket-qr-code/eyJpdiI6Ik1USXpORFUyTnpnNU1UQXhNVEV5TVE9PSIsInZhbHVlIjoiVFBTMTlZVFo2LzdJdHM1VnFwK3V1Q2ZVMUROOWg3a2h1US9ObHVMZEVsZz0iLCJtYWMiOiI1ODc2Y2Q1NGVjMjA2YTE1NWQ0ODZkMmRhMTg0YzIwZDkxZGQwZjA3MDgwM2FlN2QwZmVhODUzZjQ2ZWE5OTM5In0%3D';
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
      const status = await BarcodeScanner.checkPermission({ force: true });
      if(status.denied) {
        const c = confirm('If you want to grant permission for using your camera, enable it in the app settings.');
        if (c) {
          BarcodeScanner.openAppSettings();
        }
      } else {
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
