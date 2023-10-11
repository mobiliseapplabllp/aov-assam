import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonContent, IonSlides, LoadingController, NavController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { LoginService } from 'src/app/provider/login/login.service';
import { PmCalService } from 'src/app/provider/pm-cal/pm-cal.service';
import { environment } from 'src/environments/environment';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-pm-report',
  templateUrl: './pm-report.component.html',
  styleUrls: ['./pm-report.component.scss'],
})
export class PmReportComponent  implements OnInit {
  @ViewChild(IonContent, {static: true}) content!: IonContent;
  @ViewChildren("a") private itemlist!: QueryList<ElementRef>;
  @ViewChild('slides', {static: false}) slide!: IonSlides;
  requestedData: any = [];
  myCategory: any = [];
  myWorkBook: any = [
    {sub_category: '', workdone: '', workdate: ''}
  ];
  loading: any;
  result: any;
  renderedUsers: any;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false
   };
   showSkip: any;
   isSlideStart: any;
   activeSlideIndex = 1;
   totalRow: any;
   submitArr: any = [];
   userData: any = [];
   myOtherCategory: any = [];
   questionAttachment: any;
   pageName!: string;
   myAssets: any = [];
  constructor(
    private httpLogin: LoginService,
    private activeroute: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private httpPmCal: PmCalService,
    private httpCommon: CommonService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.userData = this.httpLogin.getLoginUserValue();
    this.activeroute.queryParams.subscribe((res) => {
      this.requestedData = JSON.parse(res['data']);
      this.pageName = this.requestedData.reportName;
      console.log(this.requestedData);
      this.getAsset();
      this.getScheduleQuestion();
    });
  }

  getScheduleQuestion() {
    this.presentLoading('Please Wait').then(preLoad => {
      this.httpPmCal.getScheduleQuestion(this.requestedData.wo_id).subscribe(data => {
        this.dismissloading();
        this.myCategory = data.data.categories;
        this.myCategory.forEach((element: any) => {
          element.isResponseShow = false;
          element.qus.forEach((el: any) => {
            if(el.response) {
              el.remark = el.response.remark;
              el.attachment = el.response.attachment1;
              if(el.q_type == '226') {
                el.rspns = el.response.optn_id;
                if (el.rspns) {
                  const obj = el.options.filter((val: any) => val.optn_id === el.rspns)[0];
                  el.is_doc_mandatory = obj.is_doc_mandatory;
                  el.is_rmrk_mandatory = obj.is_rmrk_mandatory;
                }
              } else {
                el.rspns = el.response.rspns;
              }
            } else {
              el.response = {}
            }
          });
        });
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    });
  }

  getAsset() {
    this.httpPmCal.getAssets(this.requestedData.wo_id).subscribe(dat => {
      console.log(dat);
      if (dat.status)
      this.myAssets = dat.data;
    });
  }

  async notApplicable(dat: any) {
    console.log(dat);
    const alert = await this.alertController.create({
      header: 'Confirm!!!',
      message: 'Are you sure want to NA "' + dat.cat_desc + '"',
      buttons: [{
        text: 'No',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'YES',
        handler: () => {
          console.log('Confirm Okay', dat);
          this.notApplicableAction(dat);
        }
      }]
    });
    await alert.present();
  }

  notApplicableAction(data: any) {
    const obj = {
      cat_id: data.cat_id,
      is_applicable: 3,
      rspns_source: environment.source,
      wo_id: this.requestedData.wo_id,
    };
    this.presentLoading('Please Wait.').then(preLoad => {
      this.httpPmCal.checkListCategoryStatus(obj).subscribe(dat => {
        this.dismissloading();
        if (dat.status) {
          data.isAssestShow = false;
          data.isResponseShow = false;
          data.is_applicable = 3;
          this.httpCommon.presentToast(dat.msg, 'success');
        } else {
          this.httpCommon.presentToast(dat.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    });
  }

  expand(data: any, ind: any) {
    if (data.qus.length > 0 && data.is_applicable !== 1) {
      for (var i = 0 ; i < data.qus.length; i ++) {
        data.qus[i].rspns = '';
      }
    }

    const obj = {
      cat_id: data.cat_id,
      is_applicable: 1,
      rspns_source: environment.source,
      wo_id: this.requestedData.wo_id,
    };

    this.presentLoading('Please Wait..').then(preLoad => {
      this.httpPmCal.checkListCategoryStatus(obj).subscribe(dat => {
        console.log(dat);
        this.dismissloading();
        if (dat.status) {
          data.isAssestShow = true;
          data.isResponseShow = true;
          data.is_applicable = 1;
          this.httpCommon.presentToast(dat.msg, 'success');
          for (let i = 0; i < this.myCategory.length; i++) {
            if (i !== ind) {
              this.myCategory[i].isView = false;
            }
          }
          this.scroll(ind);
        } else {
          this.httpCommon.presentToast(dat.msg, 'warning');
        }

      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      })
    });
  }

  viewMore(dat: any, ind: any) {
    this.presentLoading('Loading...').then(preLoad => {
      dat.isResponseShow = !dat.isResponseShow;
      this.scroll(ind);
      setTimeout(() => {
        this.dismissloading();
      }, 1500);
    })
  }

  scrollCategory(data: any) {
    let indexFound;
    for(var i = 0 ; i < this.myCategory.length;i++) {
      if (this.myCategory[i].cat_desc == data.cat_head) {
        indexFound = i;
        this.myCategory[i].isResponseShow = true;
        for (var j = 0 ; j < this.myCategory[i].qus.length; j++) {
          if (data.cat_ques == this.myCategory[i].qus[j].q_desc) {
            this.myCategory[i].qus[j].isNotFill = true;
            break;
          } else {
            this.myCategory[i].qus[j].isNotFill = false;
          }
        }
        this.scroll(indexFound);
      } else {
        this.myCategory[i].isResponseShow = false;
      }
    }
  }


  scroll(indexFound: any) {
    setTimeout(() => {
      const userToScrollOn = this.itemlist.toArray();
      userToScrollOn[indexFound].nativeElement.scrollIntoView({
        behavior: 'smooth'
      }, (err: any) => {
        console.log(err);
      });
    }, 500);
  }

  changeOptionResponse(data: any, ev: any) {
    if (!data.rspns) {
      return;
    }
    console.log(data);
    if (data.response && data.rspns == data.response.optn_id) {
      console.log('already saved');
      return;
    }
    const obj = {
      wo_id: this.requestedData.wo_id,
      rspns: data.rspns,
      q_id: data.q_id,
      q_type: data.q_type,
      q_max_score: data.q_max_score,
      rspns_source: environment.source
    }
    this.presentLoading('Please Wait!').then(preLoad => {
      this.httpPmCal.scheduleResponseAction(obj).subscribe({
        next:(dat) =>{
          if (dat.status) {
            this.httpCommon.presentToast(dat.msg, 'success');
            data.response.optn_id = data.rspns;
            const obj = data.options.filter((val: any) => val.optn_id === ev.target.value)[0];
            data.is_doc_mandatory = obj.is_doc_mandatory;
            data.is_rmrk_mandatory = obj.is_rmrk_mandatory;
          } else {
            data.rspns = '';
            this.httpCommon.presentToast(dat.msg, 'warning');
          }
        },
        error:() => {
          data.rspns = '';
          this.dismissloading();
          this.httpCommon.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      });
    });
  }

  changeRemark(data: any) {
    const obj1 = {
      wo_id: this.requestedData.wo_id,
      remark: data.remark,
      q_id: data.q_id,
      rspns_source: environment.source
    };
    this.presentLoading('Please Wait!!').then(preLoad => {
      this.httpPmCal.scheduleResponseActionRem(obj1).subscribe({
        next:(dat) => {
          if (dat.status) {
            this.httpCommon.presentToast(dat.msg, 'success');
          } else {
            this.httpCommon.presentToast(dat.msg, 'warning');
          }
        },
        error:() => {
          this.dismissloading();
          this.httpCommon.presentToast(environment.errMsg, 'warning');
        },
        complete:() => {
          this.dismissloading();
        }
      });
    });
  }

  async presentActionSheet(data: any) {
    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      this.readImg(image, data)
    };
    takePicture();
  }

  async readImg(photo: any, data: any) {
    let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    let formData = new FormData();
    formData.append('wo_id', this.requestedData.wo_id);
    formData.append('q_id',  data.q_id);
    formData.append('rspns_source', environment.source);
    formData.append('attachment2', blob, random);
    data.imagename = '';
    this.presentLoading('Please Wait!!!').then(preLoad => {
      this.httpPmCal.scheduleResponseActionDoc(formData).subscribe(dat => {
        console.log(dat);
        this.dismissloading();
        if (dat.status) {
          data.imagename = 'Uploaded';
          this.httpCommon.presentToast(dat.msg, 'success');
        } else {
          this.httpCommon.presentToast(dat.msg, 'warning');
        }
      }, err => {
        this.dismissloading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
        alert(JSON.stringify(err));
      });
    });
  }

  finalSubmit() {
    const obj = {
      status: 2,
      wo_id: this.requestedData.wo_id,
      source: environment.source
    };
    console.log(this.myCategory);
    for (let i = 0; i < this.myCategory.length; i++) {
      if (this.myCategory[i].is_applicable != 3) {
        for (let j = 0; j < this.myCategory[i].qus.length; j++) {
          if (!this.myCategory[i].qus[j].rspns) {
            this.httpCommon.presentToastWithOk(`Please add Response for Question No ${ j + 1} from Category ${ this.myCategory[i].cat_desc }`, 'warning');
            this.myCategory[i].qus[j].isNotFill = true;
            this.myCategory[i].isResponseShow = true;
            this.scroll(i);
            return;
          } else {
            this.myCategory[i].isResponseShow = false;
            this.myCategory[i].qus[j].isNotFill = false;
          }
        }
      }
    }

    this.presentLoading('Saving Data').then(preLoad => {
      this.httpPmCal.finalSubmitCheckList(obj).subscribe(data => {
        this.dismissloading();
        if (data.status) {
          this.httpCommon.presentToast(data.msg, 'success');
          this.navCtrl.pop();
        } else {
          this.httpCommon.presentToastWithOk(data.msg, 'warning');
          if (data.cat_head && data.cat_ques) {
            this.scrollCategory(data);
          } else {
            console.log('cat not found');
          }
        }
      }, err => {
        this.dismissloading();
        alert(JSON.stringify(err));
      });
    });
  }


  viewDocs(url: string) {
    this.httpCommon.openDoc(url);
  }

  async presentLoading(msg: string) {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: msg,
      duration: 8000
    });
    await this.loading.present();
  }

  async dismissloading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

}
