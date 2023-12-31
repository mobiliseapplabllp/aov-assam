import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { DigitalChecklistService } from 'src/app/provider/digital-checklist/digital-checklist.service';
import { SignatureComponent } from 'src/app/shared/signature/signature.component';
import { environment } from 'src/environments/environment';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
@Component({
  selector: 'app-fill-report',
  templateUrl: './fill-report.component.html',
  styleUrls: ['./fill-report.component.scss'],
})
export class FillReportComponent  implements OnInit {
  @ViewChildren("a") private itemlist!: QueryList<ElementRef>;
  schedule_id: any;
  scheduleArr: any = [];
  loading: any;
  remark: any;
  signatureBase64!: string;
  checkListUniqeId!: string;
  schedule_status: any;
  sign_attachment: any;
  cc_desc: any;
  pc_location: any;
  // on_behalf=1
  on_behalf: any;
  remarkErr = false;
  arr: any = [];
  offlineId: any = [];
  isAlreadySaved!: boolean;
  selectedLanguage =  'en';
  index: any;
  qusList: any = [];
  loop = false;
  constructor(
    private activeRoute: ActivatedRoute,
    private httpDigital: DigitalChecklistService,
    private common: CommonService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.schedule_id = this.activeRoute.snapshot.paramMap.get('id');
    this.on_behalf = this.activeRoute.snapshot.paramMap.get('behalf');
    console.log(this.activeRoute.snapshot.paramMap.get('behalf'));
    console.log(this.schedule_id);
    let check = this.offlineId.filter((val: any) => val === this.schedule_id);
    if(check.length > 0) {
      this.isAlreadySaved = true
    } else {
      this.isAlreadySaved = false;
    }
    if (this.platform.is('capacitor')) {
      this.permission();
    }
    this.getScheduleQuestion();
  }

  ionViewDidLeave() {
    this.loop = false;
    this.removeListen();
  }

  removeListen() {
    SpeechRecognition.removeAllListeners();
  }

  permission() {
    SpeechRecognition.requestPermissions().then(res => {
      console.log(res);
    })
  }

  getScheduleQuestion() {
    this.presentLoading().then(preLoad => {
      this.httpDigital.getScheduleQuestion(this.schedule_id).subscribe({
        next:(data) => {
          console.log(data);
          if (data.status) {
            this.arr = data.data;
            this.scheduleArr = data.data.categories;
            this.checkListUniqeId = data.data.schedule_unique_id;
            this.schedule_status = data.data.schedule_status;
            this.cc_desc = data.data.ccName;
            this.pc_location = data.data.location_desc
            if (!data.data.isUpdate) {
              this.common.presentToastWithOk('You can not fill the checklist, before the scheduled time.', 'warning');
              this.navCtrl.pop();
              return;
            }
            if (this.schedule_status == 'attended' || this.schedule_status == '2') {
              this.remark = data.data.sign_remark;
              this.sign_attachment = data.data.sign_attachment
            }
            this.scheduleArr.forEach((element: any) => {
              element.isResponseShow = true;
              element.qus.forEach((el: any) => {
                if(el.response) {
                  el.remark = el.response.remark;
                  el.attachment = el.response.attachment1;
                  if(el.q_type == '226') {
                    el.rspns = el.response.optn_id;
                    if (el.rspns) {
                      const obj = el.options.filter((val: any) => val.optn_id === el.rspns)[0];
                      el.isRemarkMandatory = obj.is_rmrk_mandatory;
                      el.isDocMandatory = obj.is_doc_mandatory;
                    }
                  } else {
                    el.rspns = el.response.rspns;
                  }
                } else {
                  el.response = {}
                }
              })
            });
          } else {
            this.common.presentToast(data.msg, 'warning');
          }
        },error:()=> {
          this.common.presentToast(environment.errMsg, 'danger');
          this.dismissloading();
        },complete:() => {
          this.dismissloading();
        }
      })
    })
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 8000
    });
    await this.loading.present();
  }

  async dismissloading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  viewDocs(url: any) {
    this.common.openDoc(url);
  }

  changeBackground(ind: any) {
    for (var i = 0; i < this.scheduleArr.length;i++) {
      for (var j = 0 ; j < this.scheduleArr[i].qus.length;j++) {
        if (ind == j) {
          this.scheduleArr[i].qus[j].bgcolor = true;
        } else {
          this.scheduleArr[i].qus[j].bgcolor = false;
        }
      }
    }
  }

  speakCondition(val: any, ind: any) {
    this.index = ind;
    val.tempoutput = 'response';
    val.listen = false;
    this.loop = true;
    val.bgcolor = true;
    if (!val.tempoutput || val.tempoutput === 'response') {
      val.q_desc_temp = val.q_desc
    }
    this.changeBackground(ind);
    this.scroll(ind);
    this.speak(val);

  }

  speak(val: any) {
    const speak = async () => {
      await TextToSpeech.speak({
        text: val.q_desc_temp,
        lang: this.selectedLanguage,
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      }).finally(() => {
        val.speak = true;
        if (val.tempoutput === 'document') {
          this.presentActionSheet(val, 2);
        } else if (val.tempoutput === 'final') {
          return;
        } else {
          this.listen(val);
        }
      });
    };
    speak();
  }

  listenCondition(val: any) {
    val.speak = false;
    val.listen = true
    val.tempoutput = 'remark';
    this.loop = false;
    this.listen(val);
  }

  listen(val: any) {
    console.log(val);
    SpeechRecognition.start({
      language: 'en',
      maxResults: 2,
      prompt: val.q_desc,
      partialResults: true,
      popup: true,
    }).then(res => {
      console.log(res);
      let respns, voiceResponse, obj, option: any;
      voiceResponse = res.matches[0].toLocaleLowerCase();
      if (!val.tempoutput || val.tempoutput === 'response') {
        if (voiceResponse === 'yes' || voiceResponse === 'yess' || voiceResponse === 'yeees' || voiceResponse === 'yaaa' || voiceResponse === 'ha') {
          option = val.options.filter((ops: any) => ops.optn_desc === 'Yes')[0];
          respns = option.optn_id;
        } else if (voiceResponse === 'no' || voiceResponse === 'nooo' || voiceResponse === 'naaa' || voiceResponse === 'na' || voiceResponse === 'nhi') {
          option = val.options.filter((ops: any) => ops.optn_desc === 'No')[0];
          respns = option.optn_id;
        } else {
          val.tempoutput = 'response';
          val.q_desc_temp = 'We Accept Only yes, no and NA';
          this.speak(val);
          return;
        }
        val.rspns = respns;
        val.response.optn_id = val.rspns;
        val.listen = true
        obj = {
          wo_id: this.schedule_id,
          rspns: val.rspns,
          q_id: val.q_id,
          q_type:val.q_type,
          q_max_score:val.q_max_score,
          rspns_source: environment.source,
          on_behalf : this.on_behalf,
        }
        this.submitResponseAction(obj, val);
      } else if (val.tempoutput === 'remark') {
        val.remark = voiceResponse
        obj = {
          wo_id:this.schedule_id,
          remark: val.remark,
          q_id: val.q_id,
          rspns_source: environment.source,
          on_behalf : this.on_behalf,
          optn_id: val.rspns
        }
        this.submitRemark(obj);
      } else if (val.tempoutput === 'document') {
        this.presentActionSheet(val, 2);
      }
    });
  }

  changeResponseAction(val: any) {
    console.log(val);
    if (val.response && val.rspns == val.response.optn_id) {
      return;
    }
    val.isNotFill = false;
    val.speak = false;
    val.listen = false;
    this.loop = false;
    const obj = {
      wo_id: this.schedule_id,
      rspns: val.rspns,
      q_id: val.q_id,
      q_type:val.q_type,
      q_max_score:val.q_max_score,
      rspns_source: environment.source,
      on_behalf : this.on_behalf
    }
    this.submitResponseAction(obj, val);
  }

  submitResponseAction(obj: any, val: any) {
    this.presentLoading().then(preLoad => {
      this.httpDigital.scheduleResponseAction(obj).subscribe({
        next:(data) => {
          if (data.status) {
            this.common.presentToast(data.msg, 'success');
            console.log(val);
            const obj = val.options.filter((val1: any) => val1.optn_id === val.rspns)[0];
            console.log(obj);
            val.response.optn_id = val.rspns;
            val.isRemarkMandatory = obj.is_rmrk_mandatory;
            val.isDocMandatory = obj.is_doc_mandatory;
            if (val.isRemarkMandatory && val.speak) {
              val.tempoutput = 'remark';
              val.q_desc_temp = 'Please Speak Remark';
              this.scroll(this.index);
              this.speak(val);
            } else if (!val.isRemarkMandatory && val.speak) {
              this.repeatLoop();
            }
          } else if(data.status == false) {
            this.common.presentToast(data.msg, 'warning');
          } else {
            this.common.presentToast('Unknown Response From Server', 'dark');
          }
        },
        error:() => {
          this.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      })
    })
  }

  changeRemark(val: any) {
    console.log(val);
    this.loop = false;
    const obj = {
      wo_id:this.schedule_id,
      remark: val.remark,
      q_id: val.q_id,
      rspns_source: environment.source,
      on_behalf : this.on_behalf,
      optn_id: val.rspns
    }
    console.log(obj);
    this.submitRemark(obj);
  }

  submitRemark(obj: any) {
    this.presentLoading().then(preLoad => {
      this.httpDigital.schuleRemarkAction(obj).subscribe({
        next:(data) => {
          if (data.status) {
            this.common.presentToast(data.msg , 'success');
            if (this.loop) {
              const tmp = this.scheduleArr[0].qus[this.index];
              if (tmp.isDocMandatory) {
                tmp.tempoutput = 'document';
                tmp.q_desc_temp = 'Please Upload Photo';
                this.scroll(this.index);
                this.speak(tmp);
              } else {
                this.repeatLoop();
              }
            }
          } else if (data.status == false){
            this.common.presentToast(data.msg , 'warning');
          } else {
            this.common.presentToast('Unknown Response From Server' , 'dark');
          }
        },
        error:() => {
          this.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      })
    });
  }

  repeatLoop() {
    let ind = this.index+1;
    console.log(ind);
    console.log(this.scheduleArr[0].qus.length)
    if (this.loop && this.index < this.scheduleArr[0].qus.length - 1) {
      const val = this.scheduleArr[0].qus[ind];
      this.speakCondition(val, ind);
    } else if (ind == this.scheduleArr[0].qus.length) {
      const val: any = {};
      val.tempoutput = 'final';
      val.q_desc_temp = 'All Checklist is Completed, Please Enter Final Remark and Signature, Thankyou';
      this.changeBackground(ind);
      this.speak(val);
    }

  }

  // changePhoto(event: any, val: any): void {
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     const formData = new FormData();
  //     formData.append('wo_id', this.schedule_id);
  //     formData.append('attachment2', file);
  //     formData.append('q_id', val.q_id);
  //     formData.append('rspns_source', environment.source);
  //     formData.append('on_behalf', this.on_behalf);
  //     this.presentLoading().then(preLoad => {
  //       this.httpDigital.scheduleDocAction(formData).subscribe({
  //         next:(data) => {
  //           console.log(data);
  //         },
  //         error:() => {
  //           this.dismissloading();
  //         },
  //         complete:() => {
  //           this.dismissloading();
  //         }
  //       })
  //     })
  //   }
  // }

  async presentActionSheet(val: any, ind: any) {
    var obj: any = {}
    if (ind === 1) {
      obj = {
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      }
    } else {
      obj = {
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      }
    }
    const takePicture = async () => {
      const image = await Camera.getPhoto(obj);
      this.readImg(image, val)
    };
    takePicture();
  }

  async readImg(photo: any, val: any) {
    let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    let formData = new FormData();
    formData.append('wo_id', this.schedule_id);
    formData.append('q_id',  val.q_id);
    formData.append('rspns_source', environment.source);
    formData.append('attachment2', blob, random);
    formData.append('on_behalf', this.on_behalf);
    val.imagename = '';
    this.presentLoading().then(preLoad => {
      this.httpDigital.scheduleDocAction(formData).subscribe({
        next:(data) => {
          if (data.status) {
            this.common.presentToast(data.msg, 'success');
            val.imagename = 'Uploaded';
            this.repeatLoop();
          } else {
            this.common.presentToast(data.msg, 'warning');
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
    });
  }

  finalSubmit() {
    this.remarkErr = false;
    if (!this.remark) {
      this.common.presentToast('Remark is Required', 'warning');
      this.remarkErr = true;
      return;
    }
    if (!this.signatureBase64) {
      this.common.presentToast('Please Write Signature', 'warning');
      return;
    }
    const obj = {
      status: 2,
      wo_id: this.schedule_id,
      source: environment.source,
      signattachment: this.signatureBase64,
      signremark: this.remark,
      on_behalf: this.on_behalf,
    };
    for (let i = 0; i < this.scheduleArr.length; i++) {
      if (this.scheduleArr[i].is_applicable != 3) {
        for (let j = 0; j < this.scheduleArr[i].qus.length; j++) {
          if (!this.scheduleArr[i].qus[j].rspns) {
            this.common.presentToastWithOk(`Please add Response for Question No ${ j + 1} from Category ${ this.scheduleArr[i].cat_desc }`, 'warning');
            this.scheduleArr[i].qus[j].isNotFill = true;
            this.scheduleArr[i].isResponseShow = true;
            this.scroll(j);
            return;
          } else {
            this.scheduleArr[i].qus[j].isNotFill = false;
          }
        }
      }
    }
    this.presentLoading().then(preLoad => {
      this.httpDigital.finalSubmitCheckList(obj).subscribe({
        next:(data) => {
          if (data.status) {
            this.common.presentToast(data.msg, 'success');
            this.navCtrl.pop();
          } else {
            this.common.presentToastWithOk(data.msg, 'warning');
            if (data.cat_head && data.cat_ques) {
              // this.scrollCategory(data);
            } else {
              console.log('cat not found');
            }
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
    });
  }

  scroll(indexFound: any) {
    setTimeout(() => {
      const userToScrollOn: any = this.itemlist.toArray();
      userToScrollOn[indexFound].nativeElement.scrollIntoView({
        behavior: 'smooth'
      }, (err: any) => {
        console.log(err);
      });
    }, 500);
  }

  async openSign() {
    const modal = await this.modalCtrl.create({
      component: SignatureComponent,
      cssClass: 'my-modal',
      componentProps: {  }
    });
    modal.onWillDismiss().then(async disModal => {
      if (disModal.role) {
        let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg';
        this.signatureBase64 = disModal.data;
      }
    });
    modal.present();
  }

  changeLan(lang: string) {
    var question: any = [], temp: any;
    temp = this.scheduleArr[0].qus;
    for (var i = 0 ; i < temp.length; i++) {
      question.push(temp[i].q_desc);
    }
    this.translate(question, lang);
  }

  translate(data: any, lang: string) {
    this.presentLoading().then(preLoad => {
      this.httpDigital.googleTranslate(data, lang).subscribe({
        next:(translateText) => {
          console.log(translateText.data.translations[1].translatedText);
          for (var i = 0 ; i < this.scheduleArr.length;i++) {
            for (var j = 0 ; j < this.scheduleArr[i].qus.length; j++) {
              this.scheduleArr[i].qus[j].q_desc = translateText.data.translations[j].translatedText
            }
          }
          this.selectedLanguage = lang;
        },
        error:(err) => {
          console.log(err);
          this.dismissloading();
          this.common.presentToastWithOk(JSON.stringify(err), 'warning');
        },
        complete:() => {
          this.dismissloading();
        }
      })
    });
  }
}
