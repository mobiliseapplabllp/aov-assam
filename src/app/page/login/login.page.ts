import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController, Platform } from '@ionic/angular';
import { userInfo } from 'os';
import { CommonService } from 'src/app/provider/common/common.service';
import { LoginService } from 'src/app/provider/login/login.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login = { userid: '', password: ''};
  submitted = false;
  userValue: any = [];
  isHidden = true;
  public loginForms!: FormGroup;
  loading: any;
  isLogin: any = [];
  mypass = 'password';
  isAndroid!: boolean;
  constructor(
    private formbuilder: FormBuilder,
    private platform: Platform,
    private menu: MenuController,
    private loadingController: LoadingController,
    private router: Router,
    private loginPro: LoginService,
    private common: CommonService

  ) {
    this.loginForms = formbuilder.group({
      userid: ['', Validators.required],
      password: ['' , Validators.required],
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log('login');
    if (this.platform.is('android')) {
      this.isAndroid = true;
    }
    this.menu.enable(false);
    const isLogin = localStorage.getItem('loginvalue');
    console.log(isLogin);
    if (isLogin) {
      console.log(JSON.parse(isLogin));
      this.login.userid = this.isLogin.userid;
      this.login.password = this.isLogin.password;
    }

    // this.storage.get('loginvalue').then(res => {
    //   this.isLogin = res;
    //   if (this.isLogin != null) {
    //     this.login.userid = this.isLogin.userid;
    //     this.login.password = this.isLogin.password;
    //   }
    //  });
  }
  ionViewDidLeave() {
    this.menu.enable(true);
  }

  changePass(pass: any) {
    console.log(pass);
    console.log(pass.target.value);
  }

  onLogin() {
    this.isHidden = false;
    this.loginPro.LoginAuth(this.loginForms.value).then(data => {
      setTimeout(() => {
        this.isHidden = true;
      }, 1000);
      console.log(data);
      this.userValue = data;
      if (this.userValue === false) {
        this.common.presentToast(environment.errMsg, 'danger');
      } else {
        if (this.userValue.status === false ) {
          this.common.presentToast(this.userValue.msg, 'warning');
        } else  if (this.userValue.status === true) {
          // this.storage.set('loginvalue', this.loginForms.value);
          // this.storage.set('userInfo', this.userValue.extra);
          localStorage.setItem('userInfo', JSON.stringify(this.userValue.extra));
          localStorage.setItem('loginvalue', JSON.stringify(this.loginForms.value));
          localStorage.setItem('token1', this.userValue.token);
          localStorage.setItem('enc_id', this.userValue.enc_id);
          localStorage.setItem('user', JSON.stringify(this.userValue.user));
          this.router.navigateByUrl('/list-master', { replaceUrl: true });
        }
      }
    } , err => {
      console.log(err);
    });
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

  openPage(url: any) {
    this.router.navigateByUrl(url);
  }

}