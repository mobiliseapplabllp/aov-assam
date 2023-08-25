import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { MyAssetGetService } from 'src/app/provider/my-asset-get/my-asset-get.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-asset-devicename',
  templateUrl: './asset-devicename.component.html',
  styleUrls: ['./asset-devicename.component.scss'],
})
export class AssetDevicenameComponent  implements OnInit {
  myDeviceName: any = [];
  myDeviceNameCopy: any = [];
  loading:any;
  grp_id: any;
  constructor(
    public modalCtrl: ModalController,
    public loadingController: LoadingController,
    public httpAsset: MyAssetGetService,
  ) { }

  ngOnInit() {
    console.log(this.grp_id);
    this.getDeviceName();
  }

  getDeviceName() {
    this.presentLoading().then(preLaod => {
      this.httpAsset.getDeviceName(this.grp_id).subscribe(data => {
        this.dismissloading();
        if (data.status) {
          this.myDeviceName = data.data;
          this.myDeviceNameCopy = data.data
        }
      }, err => {
        alert(environment.errMsg);
        this.dismissloading();
      })
    })

  }

  closeModal(val: any, status: any) {
    this.modalCtrl.dismiss(val, status);
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
    this.myDeviceName = this.myDeviceNameCopy;
    if (val && val.trim() !== '') {
      this.myDeviceName = this.myDeviceName.filter((dat: any) => {
        if ((dat.label.toLowerCase().indexOf(val.toLowerCase()) > -1)) {
          return (dat.label.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
        return
      });
    }
  }


}
