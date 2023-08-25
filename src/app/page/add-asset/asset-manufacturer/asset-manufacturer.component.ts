import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { MyAssetGetService } from 'src/app/provider/my-asset-get/my-asset-get.service';

@Component({
  selector: 'app-asset-manufacturer',
  templateUrl: './asset-manufacturer.component.html',
  styleUrls: ['./asset-manufacturer.component.scss'],
})
export class AssetManufacturerComponent  implements OnInit {
  manufacturer: any = [];
  manufacturerCopy: any = [];
  loading: any;
  constructor(
    private modalCtrl: ModalController,
    private httpAsset: MyAssetGetService,
    private loadingController: LoadingController) { }

  ngOnInit() {
    this.getManufacturer();
  }


  ionViewDidLeave() {
    this.dismissloading();
  }

  closeModal(val: any, status: any) {
    this.modalCtrl.dismiss(val, status);
  }

  getManufacturer() {
    this.presentLoading().then(preLod => {
      this.httpAsset.getManufacturer().subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.manufacturer = data.data;
          this.manufacturerCopy = data.data;
        }
      }, err => {
        this.dismissloading();
      });
    })

  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
    await this.loading.present();
  }

  async dismissloading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  search(ev: any) {
    let val: any;
    console.log(ev.target.value);
    val = ev.target.value;
    this.manufacturer = this.manufacturerCopy;
    if (val && val.trim() !== '') {
      this.manufacturer = this.manufacturer.filter((dat: any) => {
        if ((dat.mnfctrer_desc.toLowerCase().indexOf(val.toLowerCase()) > -1)) {
          return (dat.mnfctrer_desc.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
        return
      });
    }
  }

}
