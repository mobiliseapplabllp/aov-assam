import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { AttendanceService } from 'src/app/provider/attendance/attendance.service';
import { CommonService } from 'src/app/provider/common/common.service';
import { CostCenterComponent } from 'src/app/shared/cost-center/cost-center.component';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
declare var google: any;
@Component({
  selector: 'app-attendnce',
  templateUrl: './attendnce.page.html',
  styleUrls: ['./attendnce.page.scss'],
})
export class AttendncePage implements OnInit {
  latitude: any;
  longitude: any;
  today = moment().format('DD MMM YYYY');
  yesterday = moment().subtract(1, 'day').format('DD MMM YYYY');
  tommorow = moment().add(1, 'day').format('DD MMM YYYY');;
  userData: any = [];
  cameraOptions: any;
  map: any;
  loading: any;
  attendanceStatus: any;
  gpsStatus = false;
  formData = new FormData();
  result: any = [];
  currentDay = moment().format('DD MMM');
  currentTime = moment().format('HH:mm:ss');
  clrInt!: any;
  costCenter: any = [];
  isAndroid!: boolean;
  att_id: any;
  checkLastAttendanceStatus!: boolean;
  constructor(
    private loadingController: LoadingController,
    private modalController: ModalController,
    private common: CommonService,
    private navCtrl: NavController,
    private router: Router,
    private httpAttendance: AttendanceService,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.clrInt = setInterval(() => {
      this.currentTime = moment().format('HH:mm:ss');
    }, 1050);
    if (this.platform.is('capacitor')) {
      this.getLocation();
    } else {
      this.initMap(28.611213483920366, 77.26949959721436)
    }
  }

  ionViewDidEnter() {
    // this.checkAttendance();
  }

  ionViewDidLeave() {
    clearInterval(this.clrInt);
  }
  async getLocation() {
    await Geolocation.getCurrentPosition({enableHighAccuracy: true}).then((res: any) => {
      this.latitude = res.coords.latitude;
      this.longitude = res.coords.longitude;
      this.initMap(this.latitude, this.longitude);
    }, (err: any) => {
      alert(JSON.stringify(err) + ' Err');
    });
  }


  async initMap(lat: any, lng: any) {
    this.gpsStatus = true;
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: lat, lng: lng },
      zoom: 15,
    });
    this.addMarker(lat, lng);
  }

  addMarker(lat: any , long: any) {
    const position = new google.maps.LatLng(lat, long);
    const marker = new google.maps.Marker({ position, title: 'Mobilise' });
    marker.setMap(this.map);
  }

  checkAttendance(pc_id: any) {
    this.presentLoading().then(() => {
      this.httpAttendance.checkTodayAttendance(pc_id).subscribe(data => {
        this.dismissloading();
        this.checkLastAttendanceStatus = true;
        if (data.status) {
          if (data.data.att_type === 1) {
            this.att_id = data.data.id;
            this.attendanceStatus = true
          } else  {
            this.attendanceStatus = false
          }
        } else {
          this.attendanceStatus = false;
        }
      }, err => {
        this.checkLastAttendanceStatus = true;
        this.dismissloading();
        this.common.presentToast(environment.errMsg, 'danger');
      });
    });
  }

  attendanceHistory() {
    this.router.navigateByUrl('app/attendance/attendance-history');
  }

  checkGPSValidation(val: any) {
    if (!this.costCenter) {
      alert('Please Select RO');
      return;
    }
    if (this.gpsStatus === false) {
      this.common.presentToast('your GPS Location not working please turn on your GPS Location', 'warning');
    } else {
      this.presentActionSheet(val);
    }
  }

  async presentActionSheet(val: any) {
    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
      });
      this.readImg(image, val)
    };
    takePicture();
  }

  async readImg(photo: any, val: any) {
    let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
      this.formData.delete('photo',);
      this.formData.delete('emp_id');
      this.formData.delete('att_date');
      this.formData.delete('att_lattitude');
      this.formData.delete('att_longitude');
      this.formData.delete('att_time');
      this.formData.delete('att_type');

      this.formData.append('photo', blob, random);
      this.formData.append('emp_id', this.userData.id);
      this.formData.append('att_date', moment().format('yyyy-MM-DD'));
      this.formData.append('att_lattitude', this.latitude);
      this.formData.append('att_longitude', this.longitude);
      this.formData.append('att_time', this.currentTime);
      this.formData.append('att_type', val);
      if (val === 'OUT') {
        this.formData.append('id', this.att_id);
      }
      this.presentLoading().then(preLoad => {
        this.httpAttendance.punchInOutAction(this.formData).then((res: any) => {
          this.dismissloading();
          this.result = res;
          if (this.result === false) {
            this.common.presentToast(environment.errMsg, 'danger');
          } else {
            if (this.result.status === true) {
              this.common.presentToast(this.result.msg, 'success');
              if (val === 'IN') {
                this.attendanceStatus = true;
              } else if (val === 'OUT') {
                this.attendanceStatus = false;
              }
              this.navCtrl.pop();
            } else if (this.result.status === false) {
              this.common.presentToast(this.result.msg, 'warning');
            }
          }
        });
      });

  }



  punchInOut(val: any) {
    // const options: CameraOptions = {
    //   quality: 50,
    //   destinationType: this.camera.DestinationType.FILE_URI,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   correctOrientation: true,
    //   targetHeight: 768,
    //   targetWidth: 1024
    // };
    // this.camera.getPicture(options).then((imageData) => {
    //   this.file.resolveLocalFilesystemUrl(imageData).then((entry: FileEntry) => {
    //     entry.file(file => {
    //       console.log(file);
    //       this.read(file, val);
    //     });
    //   }, err => {
    //     alert(JSON.stringify(err) + 'Err File');
    //   });
    // }, err => {
    //   let errres = JSON.stringify(err);
    //   if (errres == '20') {
    //     alert('Plese Allow Camera Permission');
    //   } else {
    //     alert(JSON.stringify(err) + 'ERR Camera');
    //   }
    // });
  }

  read(file: any, val: any) {
    // const reader = new FileReader();
    // reader.readAsArrayBuffer(file);
    // reader.onload = () => {
    //   const blob = new Blob([reader.result], {
    //     type: file.type
    //   });

    //   this.formData.delete('photo',);
    //   this.formData.delete('emp_id');
    //   this.formData.delete('att_date');
    //   this.formData.delete('att_lattitude');
    //   this.formData.delete('att_longitude');
    //   this.formData.delete('att_time');
    //   this.formData.delete('att_type');

    //   this.formData.append('photo', blob, file.name);
    //   this.formData.append('emp_id', this.userData.id);
    //   this.formData.append('att_date', moment().format('yyyy-MM-DD'));
    //   this.formData.append('att_lattitude', this.latitude);
    //   this.formData.append('att_longitude', this.longitude);
    //   this.formData.append('att_time', this.currentTime);
    //   this.formData.append('att_type', val);
    //   if (val === 'OUT') {
    //     this.formData.append('id', this.att_id);
    //   }
    //   this.presentLoading().then(preLoad => {
    //     this.httpAttendance.punchInOutAction(this.formData).then((res: any) => {
    //       this.dismissloading();
    //       this.result = res;
    //       if (this.result === false) {
    //         this.common.presentToast(environment.errMsg, 'danger');
    //       } else {
    //         if (this.result.status === true) {
    //           this.common.presentToast(this.result.msg, 'success');
    //           if (val === 'IN') {
    //             this.attendanceStatus = true;
    //           } else if (val === 'OUT') {
    //             this.attendanceStatus = false;
    //           }
    //           this.navCtrl.pop();
    //         } else if (this.result.status === false) {
    //           this.common.presentToast(this.result.msg, 'warning');
    //         }
    //       }
    //     });
    //   });
    // };
  }

  // uploadAttendance(event: any, val: any): void {
  //   let lat, lng, id;
  //   lat = 28.436913269756705;
  //   lng = 77.31605195124482;
  //   id = 40;
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];

  //     this.formData.delete('photo',);
  //     this.formData.delete('emp_id');
  //     this.formData.delete('att_date');
  //     this.formData.delete('att_lattitude');
  //     this.formData.delete('att_longitude');
  //     this.formData.delete('att_time');
  //     this.formData.delete('att_type');
  //     this.formData.delete('id');

  //     this.formData.append('photo', file);
  //     this.formData.append('emp_id', this.userData.id);
  //     this.formData.append('att_date', moment().format('yyyy-MM-DD'));
  //     this.formData.append('att_lattitude', lat);
  //     this.formData.append('att_longitude', lng);
  //     this.formData.append('att_time', this.currentTime);
  //     this.formData.append('att_type', val);
  //     if (val == 'OUT') {
  //       this.formData.append('id', this.att_id);
  //     }
  //     this.presentLoading().then(preLoad => {
  //       this.httpAttendance.punchInOutAction(this.formData).then(res => {
  //         this.dismissloading();
  //         this.result = res;
  //         if (this.result === false) {
  //           this.common.presentToast(environment.errMsg, 'danger');
  //         } else {
  //           if (this.result.status === true) {
  //             this.common.presentToast(this.result.msg, 'success');
  //             if (val === 'IN') {
  //               this.attendanceStatus = true;
  //             } else if (val === 'OUT') {
  //               this.attendanceStatus = false;
  //             }
  //           } else if (this.result.status === false) {
  //             this.common.presentToast(this.result.msg, 'warning');
  //           }
  //         }
  //       });
  //     });
  //   }
  // }

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

  async openRoName() {
    const modal = await this.modalController.create({
      component: CostCenterComponent,
      cssClass: 'my-modal',
      componentProps : { }
    });
    modal.onWillDismiss().then((disModal: any) => {
      console.log(disModal);
      if (disModal.role) {
        this.costCenter = disModal.data.label;
        this.formData.delete('pc_ext_id');
        this.formData.delete('pc_desc');
        this.formData.delete('pc_id');

        this.formData.append('pc_ext_id', disModal.data.pc_ext_id);
        this.formData.append('pc_desc', disModal.data.pc_desc);
        this.formData.append('pc_id', disModal.data.value);
        this.costCenter = disModal.data.label;
        this.checkAttendance(disModal.data.value);
      }
    });
    return await modal.present();
  }



}
