import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';
import { environment } from 'src/environments/environment';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AssignTicketComponent } from '../assign-ticket/assign-ticket.component';
import { SignatureComponent } from 'src/app/shared/signature/signature.component';

@Component({
  selector: 'app-ticket-work',
  templateUrl: './ticket-work.component.html',
  styleUrls: ['./ticket-work.component.scss'],
})
export class TicketWorkComponent  implements OnInit {
  segmentStatus = 'ticket';
  public workSpace!: FormGroup;
  assetInfo: any = {};
  ticketStages: any = [];
  loading: any;
  formData:any = new FormData();
  fileName!: string;
  isSpinner!: boolean;
  isImageUpload!: boolean;
  ticket_id: any;
  result:any = [];
  isOtpSent!: boolean;
  isVerifyOtp = false;
  requestedData: any = [];
  mobile: any;
  hasWip: any;
  // ptwApproved: any;
  countStatus = false;
  countTime!: number;
  mm!: number;
  ss!: number;
  myinterval!: any;
  defaultCountTime = 300;
  engSigImg!: string;
  cusSigImg!: string;
  engineerBase64!: string;
  customerBase64!: string;
  enter_otp: any;
  isFormDisabled!: boolean;
  ticketPriority: any = [];
  isPriority: any;
  // selectPriority: string;
  changePriorityObj: any = {};
  isPtwMandatory!: boolean;
  arr: any = [];
  scopeOfWorkArr: any = [];
  constructor(
    public activeRoute: ActivatedRoute,
    public formbuilder: FormBuilder,
    public httpComplaint: ComplaintService,
    public httpCommon: CommonService,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    public router: Router,
    public loadingController: LoadingController,
    public platform: Platform
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((res) => {
      this.requestedData = JSON.parse(res['data']);
      this.ticket_id = this.requestedData.tkts_id;
      this.mobile = this.requestedData.mobile
      this.initForm();
    });
    this.getTicketStages();
  }

  initForm() {
    this.workSpace = this.formbuilder.group({
      status: ['' , Validators.required],
      remark: [''],
      source: [environment.source],
      ticketId: [this.ticket_id],
      problem_reported: [''],
      action_taken: [''],
      scope_of_work: [''],
      phone_no: [''],
      otp: [''],
    });

  }

  testOtp() {
    this.workSpace.get('enter_otp')?.setValue('');
  }

  changePhoto(event: any): void {
    this.fileName = '';
    let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.delete('img[]');
      this.formData.append('img[]', file, random);
      this.fileName = random;
      this.isOtpSent = false;
      this.presentLoading().then(preLoad => {
        this.dismissLoading();
      });
      console.log(file);
    }
  }

  getSpecificTicket(ticket_id: any) {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getSpecificTicket(ticket_id).subscribe(data => {
        console.log(data);
        this.dismissLoading();
        if (data.status) {
          this.arr = data.data;
          // this.hasWip = data.data.hasWIP;
          // this.ptwApproved = data.data.ptwApproved;
          this.isPriority = data.can_priority;
          this.isPtwMandatory = data.ptw_mandatory;
          this.ticketPriority = data.priority_list;
          // this.selectPriority = data.data.tkt_priority_id;
          this.formData.delete('ptwApproved');
          this.formData.append('ptwApproved', data.data.ptwApproved);
          this.formData.delete('pc_id');
          this.formData.append('pc_id', data.data.pc_id);
          if (this.arr.hasWIP == 1 && data.data.ptwApproved == 0 && data.ptwPending == true ) {
            this.isFormDisabled = true;
          } else {
            this.isFormDisabled = false;
          }
          if (this.isPtwMandatory) {
            if ((this.arr.hasWIP == 0 || this.arr.ptwApproved == 0)) {
              this.ticketStages = this.ticketStages.filter((val: any) => val.stage_id != 4);
              console.log(this.ticketStages);
            }
          } else {
            if ((this.arr.hasWIP == 0)) {
              this.ticketStages = this.ticketStages.filter((val: any) => val.stage_id != 4);
            }
          }
          if (data.data.assets) {
            this.assetInfo = data.data.assets;
          }
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissLoading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    });
  }

  async presentAlert(ev: any) {
    if (ev.target.value == this.arr.tkt_priority_id) {
      return;
    }
    const confirm = await this.alertCtrl.create({
      message: 'Are you Sure want to Confirm',
      buttons: [{
        text: 'Disagree',
        handler: () => {
          console.log('Disagree clicked');
        }
      }, {
        text: 'Agree',
        handler: () => {
          this.changePriority(ev)
          console.log('Agree clicked');
        }
      }]
    });
    await confirm.present();
  }

  changePriority(ev: any) {
    console.log(ev.target.value);
    const obj = {
      id: ev.target.value,
      ticket_id: this.ticket_id,
    }
    this.presentLoading().then(preLoad => {
      this.httpComplaint.changePriority(obj).subscribe(data => {
        this.dismissLoading();
        if (data.status) {
          this.httpCommon.presentToast(data.msg, 'success');
          this.arr.attend_time = data.data.attend_time;
          this.arr.resolve_time = data.data.resolve_time;
          // this.changePriorityObj = data.data;
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissLoading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    });

  }

  getPriority() {
    this.httpComplaint.getTicketPriority(this.ticket_id).subscribe(data => {
      console.log(data);
      if (data.status) {
        this.ticketPriority = data.data;
      } else {
        this.httpCommon.presentToast(data.msg, 'warning');
      }
    }, err => {
      this.httpCommon.presentToast(environment.errMsg, 'danger');
    })
  }

  getTicketStages() {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getTicketStages().subscribe(data => {
        this.dismissLoading();
        if (data.status) {
          this.ticketStages = data.data;
          setTimeout(() => {
            this.workSpace.get('status')?.setValue(3);
          }, 1000);
        }
        this.getSpecificTicket(this.ticket_id);
      });
    })
  }
  segmentChanged(ev: any) {
    console.log(ev.target.value);
    if(ev.target.value === 'asset') {

    }
  }

  submitTicket() {
    for(let key in this.workSpace.value) {
      this.formData.delete(key);
      this.formData.append(key, this.workSpace.value[key]);
    }
    if (this.workSpace.value.status == 4) {
      if (this.arr.tkts_issue_id == 1 && !this.isVerifyOtp) {
        this.httpCommon.presentToast('OTP is Mandatory for Asset Ticket', 'warning');
        return;
      }
      if (!this.fileName && !this.isVerifyOtp) {
        this.httpCommon.presentToast('Please Add Attachment or Verify OTP to resolve Ticket', 'warning');
        return
      }
      if (!this.workSpace.value.problem_reported) {
        this.httpCommon.presentToast('Please Enter Problem Reported By Customer', 'warning');
        return;
      }
      if (!this.workSpace.value.action_taken) {
        this.httpCommon.presentToast('Plese Enter Action Taken By Engineer', 'warning');
        return;
      }
      if (!this.workSpace.value.scope_of_work) {
        this.httpCommon.presentToast('Please Select Scope of Work', 'warning');
        return;
      }
      this.formData.delete('remark');
      this.formData.append('remark', this.workSpace.value.action_taken);
      this.formData.delete('otpVerify');
      this.formData.append('otpVerify', this.isVerifyOtp);
    }

    if(this.workSpace.value.status == 3 && !this.fileName && this.arr.hasWIP == 0 && this.isPtwMandatory) {
      alert('Please Add Attachment');
      return;
    }

    this.presentLoading().then(preLoad => {
      this.httpComplaint.submitTicketTransaction(this.formData).subscribe(data => {
        console.log(data);
        this.dismissLoading();
        if (data.status) {
          this.httpCommon.presentToast(data.msg, 'success');
          this.navCtrl.pop();
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.dismissLoading();
        this.httpCommon.presentToast(environment.errMsg, 'danger');
      });
    })

  }

  async assignTicket() {
    const modal = await this.modalCtrl.create({
      component: AssignTicketComponent,
      cssClass: 'my-modal',
      componentProps: {
        ticket_id: this.ticket_id
      }
    });
    modal.onWillDismiss().then(async disModal => {
      console.log(disModal);
      if (disModal.role) {
        this.navCtrl.pop();
      }
    });
    modal.present();
  }

  changeStatus(ev: any) {
    if (ev.target.value === 'assign') {
      this.assignTicket();
      return;
    }
    if (ev.target.value === 4 && this.scopeOfWorkArr.length == 0) {
      this.getScopeOfWork();
    }
    this.workSpace.get('remark')?.setValue('');
    this.workSpace.get('problem_reported')?.setValue('');
    this.workSpace.get('action_taken')?.setValue('');
    this.workSpace.get('phone_no')?.setValue('');
    this.workSpace.get('otp')?.setValue('');
  }

  getScopeOfWork() {
    this.presentLoading().then(preLoad => {
      this.httpComplaint.getScopeOfWork().subscribe({
        next:(data) => {
          if (data.status) {
            this.scopeOfWorkArr = data.data;
          } else {
            this.httpCommon.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.httpCommon.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissLoading();
        }
      })
    });
  }

  submit() {
  }

  changeEmp(ev: any) {
  }

  async presentActionSheet() {
    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      this.readImg(image)
    };
    takePicture();
  }

  async readImg(photo: any) {
    let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg'
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    this.formData.delete('img[]');
    this.formData.append('img[]', blob, random);
    this.fileName = random;
    this.presentLoading().then(preLoad => {
      this.dismissLoading();
    })
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  viewAttachment(img: string) {
    this.httpCommon.openDoc(img);
  }


  sendOtp() {
    console.log (this.workSpace.value.phone_no.length);
    if (this.workSpace.value.phone_no.length != 10) {
      this.httpCommon.presentToast('Mobile No Should be 10 Digit', 'warning');
      return;
    }
    const obj = {
      phone_no: this.workSpace.value.phone_no,
      ticket_id: this.ticket_id
    }
    this.presentLoading().then(preLoad => {
      this.isOtpSent = false;
      this.httpComplaint.otpSend(obj).subscribe(data => {
        this.dismissLoading();
        if (data.status) {
          this.httpCommon.presentToast(data.msg, 'success');
          this.isOtpSent = true;
          this.countTimefun();
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
          this.isOtpSent = false;
        }
      });
    })
  }

  verifyOtp() {
    const obj = {
      otp: this.workSpace.value.otp,
      ticket_id: this.ticket_id
    }
    this.presentLoading().then(preLoad => {
      this.httpComplaint.verify_otp(obj).subscribe(data => {
        this.dismissLoading();
        if (data.status) {
          this.httpCommon.presentToast(data.msg, 'success');
          this.isVerifyOtp = true;
        } else {
          this.httpCommon.presentToast(data.msg, 'warning');
          this.isVerifyOtp = false;
        }
      })

    })
  }

  changeClosure() {

  }

  createIndent() {
    // this.router.navigateByUrl('/create-indent');
    this.router.navigate(['/create-indent'], {
      queryParams: {
        data: JSON.stringify(this.requestedData),
      }
    });
  }

  async openSign(data: any) {
    const modal = await this.modalCtrl.create({
      component: SignatureComponent,
      cssClass: 'my-modal',
      componentProps: { requestData: data }
    });
    modal.onWillDismiss().then(async disModal => {

      if (disModal.role) {
        let random = Date.now() + Math.floor(Math.random() * 90000) + 10000 + '.jpg';
        if (data === 'engineer') {
          this.engSigImg = 'Uploaded';
          console.log(disModal.data);
          this.engineerBase64 = disModal.data;
          const base64Response = await fetch(disModal.data);
          const blob = await base64Response.blob();
          this.formData.delete('customer_signature');
          this.formData.append('customer_signature', blob, random);
        } else if (data === 'customer') {
          this.cusSigImg = 'Uploaded';
          this.customerBase64 = disModal.data;
          const base64Response = await fetch(disModal.data);
          const blob1 = await base64Response.blob();
          this.formData.delete('engineer_signature');
          this.formData.append('engineer_signature', blob1, random);
        }
      }
    });
    modal.present();
  }

  countTimefun() {
    this.countTime = this.defaultCountTime;
    clearInterval(this.myinterval);
    this.myinterval = setInterval(() => {
      this.countTime--;
      this.mm = Math.floor(this.countTime / 60);
      this.ss = this.countTime % 60;
      if (this.countTime === 0) {
        this.resetVariable();
      }
    }, 1050);
  }

  resetVariable() {
    console.log('abc');
    this.countTime = this.defaultCountTime;
    this.isOtpSent = false;
    this.isVerifyOtp = false;

    clearInterval(this.myinterval);
  }

  changeNgOtp(ev: any) {
    console.log(ev);
    this.workSpace.get('otp')?.setValue(ev);
  }

  resetOtp() {
    this.isOtpSent = false;
    this.isVerifyOtp = false;
  }

}
