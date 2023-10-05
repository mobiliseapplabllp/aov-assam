import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { LoginService } from 'src/app/provider/login/login.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  empid!: string;
  result: any = [];
  loading!: any;
  isOtpSent!: boolean;
  isNewPass!: boolean;
  newPassword!: string;
  confirmPassword!: string;
  myOtp!: string;
  requestedData: any = [];
  lastNumber!: string;
  constructor(
    private loadingController: LoadingController,
    private httpLogin: LoginService,
    private httpNotify: CommonService,
    private navCtrl: NavController
  ) {}

  ngOnInit() { }

  sendOtp() {
    this.presentLoading().then(preLoad => {
      this.isOtpSent = false;
      this.httpLogin.forgotPass(this.empid).then(res => {
        this.dismissloading();
        this.result = res;
        if (this.result === false) {
          this.httpNotify.presentToast(environment.errMsg, 'danger');
        } else {
          if (this.result.status === true) {
            this.isOtpSent = true;
            this.lastNumber = this.result.last_number;
            this.httpNotify.presentToast(this.result.msg, 'success');
          } else if (this.result.status === false) {
            this.httpNotify.presentToast(this.result.msg, 'warning');
          }
        }
      });
    });
  }

  getOtpValue(ev: any) {
    let str = ev;
    if (str.length === 4) {
      this.isNewPass = false;
      this.presentLoading().then(preLoad => {
        this.httpLogin.validateOtp(this.empid, ev).then((res: any) => {
          this.dismissloading();
          this.result = res;
          if (this.result === false) {
            this.httpNotify.presentToast(environment.errMsg, 'danger');
          } else {
            if (this.result.status === true) {
              this.httpNotify.presentToast(this.result.msg, 'success');
              this.isNewPass = true;
              this.myOtp = ev;
            } else if (this.result.status === false) {
              this.httpNotify.presentToast(this.result.msg, 'warning');
            } else if (this.result.status === 'eyJpdiI6Ik1USXpORFUyTnpnNU1UQXhNVEV5TVE100') {
              this.httpNotify.presentToast(this.result.msg, 'success');
              this.isNewPass = true;
              this.myOtp = ev;
            } else if (this.result.status === 'eyJpdiI6Ik1USXpORFUyTnpnNU1UQXhNVEV5TVE9') {
              this.httpNotify.presentToast(this.result.msg, 'warning');
            }
          }
        });
      });
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  dismissloading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  changePass() {
    this.confirmPassword = '';
  }

  changePassword() {
    this.presentLoading().then(preLoad => {
      this.httpLogin.changePassword(this.empid, this.myOtp, this.newPassword).then(res => {
        this.dismissloading();
        this.result = res;
        if (this.result === false) {
          this.httpNotify.presentToast(environment.errMsg, 'danger');
        } else {
          if (this.result.status === true) {
            this.httpNotify.presentToast(this.result.msg, 'success');
            this.navCtrl.pop();
          } else {
            this.httpNotify.presentToast(this.result.msg, 'warning');
          }
        }
      });
    });
  }
}
