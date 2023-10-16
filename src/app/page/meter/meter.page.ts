import { Component, OnInit } from '@angular/core';
import { AddReadingComponent } from './add-reading/add-reading.component';
import { ModalController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CommonService } from 'src/app/provider/common/common.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { MeterService } from 'src/app/provider/meter/meter.service';
@Component({
  selector: 'app-meter',
  templateUrl: './meter.page.html',
  styleUrls: ['./meter.page.scss'],
})
export class MeterPage implements OnInit {
  meterInfo: any = [];
  loading: any;
  formData = new FormData();
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private common: CommonService,
    private loadingController: LoadingController,
    private httpMeter: MeterService
  ) { }

  ngOnInit() {
    this.getPendingWo();
  }

  getPendingWo() {
    this.presentLoading().then(preLoad => {
      this.httpMeter.getPendingWo().subscribe({
        next:(data) => {
          if (data.status) {
            this.meterInfo = data.data;
          }
        },
        error:() => {
          this.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      });
    })
  }

  async addReading() {
    console.log('my site');
    const modal = await this.modalCtrl.create({
      component: AddReadingComponent,
      cssClass: 'my-modal',
      componentProps: { }
    });
    modal.present();
  }

  openPage(url: string) {
    this.router.navigateByUrl(url);
  }

  history() {
    this.router.navigateByUrl('/meter/history');
  }

  updateReading(dat: any, type: any) {
    if (type === 'consumption' ) {
      if (this.checkConsumptionCondition(dat)) {
        const obj = {
          wo_id: dat.wo_id,
          consume_reading: dat.consumption_reading,
        }
        this.save(obj, dat);
      }
    } else if (type === 'generation') {
      if (this.checkGenertionCondition(dat)) {
        const obj = {
          wo_id: dat.wo_id,
          gen_reading: dat.generate_reading
        }
        this.save(obj, dat);
      }
    } else if (type === 'both') {
      if (this.checkConsumptionCondition(dat) && this.checkGenertionCondition(dat)) {
        const obj = {
          wo_id: dat.wo_id,
          consume_reading: dat.consumption_reading,
          gen_reading: dat.generate_reading
        }
        this.save(obj, dat);
      }
    }
  }

  checkConsumptionCondition(dat: any) {
    if (!dat.consumption_reading) {
      alert('Please Enter Consumption Reading');
      return false;
    } else if (dat.is_img_req == 1 && !dat.isConsumptionImg) {
      alert('Consumption Image is Required');
      return false;
    } else {
      return true;
    }
  }

  checkGenertionCondition(dat: any) {
    if (!dat.generate_reading) {
      alert('Please Enter Generate Reading');
      return false;
    } else if (dat.is_img_req == 1 && !dat.isGenerationImg) {
      alert('Generation Image is Required');
      return false;
    } else {
      return true;
    }
  }

  save(obj: any, dat: any) {
    for (let key in obj) {
      this.formData.delete(key);
      this.formData.append(key, obj[key]);
    }
    this.presentLoading().then(preLoad => {
      this.httpMeter.updateReading(this.formData).subscribe({
        next:(data) => {
          if (data.status) {
            this.common.presentToast(data.msg, 'success');
            dat.isRemove = true
            setTimeout(() => {
              this.meterInfo = this.meterInfo.filter((val: any) => val.wo_id !== obj.wo_id);
            }, 500);
          } else {
            this.common.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.common.presentToast(environment.errMsg, 'danger');
          this.dismissloading();
        },
        complete:() => {
          this.dismissloading();
        }
      });
    })
  }

  checkPhotoCondition(dat: any, type: any) {
    if (dat.is_gllry_upld_allwd == 1) {
      this.presentActionSheet(1, dat , type);
    } else if (dat.is_gllry_upld_allwd == 0) {
      this.presentActionSheet(0, dat , type);
    } else {
      alert('Gallery is Undefined ' + dat.is_gllry_upld_allwd);
    }
  }

  async presentActionSheet(val: any, data: any, type: any) {
    const takePicture = async () => {
      const obj = {
        quality: 80,
        allowEditing: false,
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
      }
      if (val == 1) {
        obj.source = CameraSource.Prompt
      } else {
        obj.source = CameraSource.Camera
      }
      const image = await Camera.getPhoto(obj);
      this.readImg(image, data ,type)
    };
    takePicture();
  }

  async readImg(photo: any, data: any,type: any) {
    let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    if (type == 'consumption') {
        this.formData.delete('img1');
        this.formData.append('img1', blob, random);
        data.isConsumptionImg = true;
        for (var i = 0; i < this.meterInfo.length;i++) {
          if (data.wo_id !== this.meterInfo[i].wo_id) {
            this.meterInfo[i].isConsumptionImg = false;
          }
        }
      } else if (type == 'generate_reading') {
        this.formData.delete('img2');
        this.formData.append('img2', blob, random);
        data.isGenerationImg = true;
        for (var i = 0; i < this.meterInfo.length;i++) {
          if (data.wo_id !== this.meterInfo[i].wo_id) {
            this.meterInfo[i].isGenerationImg = false;
          }
        }
      }
      this.presentLoading().then(preLoad => {
        setTimeout(() => {
          this.dismissloading();
        }, 500)
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

  meterReadingHistory(dat: any) {
    this.router.navigate(['meter/reading-history'], {
      queryParams: {
        data: JSON.stringify(dat),
      }
    });
  }
}
