import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userDataTemp: any = [];
  username = new BehaviorSubject([]);
  userData: any = [];
  constructor(
    public https: HttpClient,
    private common: CommonService
  ) { }

  LoginAuth(login: any) {
    return new Promise(resolve => {
      const obj = {
        username: login.userid,
        password: login.password,
        is_app: 'is_app'
      }
      this.https.post(environment.url + 'login' , obj).subscribe({
        next:(data) => {
          this.userDataTemp = data;
          if (this.userDataTemp.status) {
            this.userData = this.userDataTemp.user;
            this.username.next(this.userData);
          }
          resolve(data);
        },
        error:(err) => {
          console.log(err);
          if (err.status === 403) {
            this.common.presentToast(err.error.msg, 'warning');
            resolve('1');
          }
          resolve(false);
        },
        complete:() => {

        }
      });
    });
  }

  getUserDataObs() {
    return this.username;
  }

  getLoginUserValue() {
    return this.userData;
  }

  refreshToken(): Observable<any> {
    return this.https.get(environment.url + 'refresh');
  }

  changePassword(userid: any, otp1: any, pass: any ) {
    return new Promise(resolve => {
      this.https.post(environment.url + 'change_password_otp', {user_id: userid, otp: otp1, password: pass, cpassword: pass }).subscribe({
        next:(data)=> {
          resolve(data);
        },
        error:() => {
          resolve(false);
        }
      });
    });
  }

  forgotPass(userid: any) {
    return new Promise(resolve => {
      this.https.post(environment.url + 'send_otp', {username: userid}).subscribe({
        next:(data) => {
          resolve(data);
        },
        error:() => {
          resolve(false);
        }
      });
    });
  }

  validateOtp(userid: any, otp1: any) {
    return new Promise(resolve => {
      this.https.post(environment.url + 'validate_otp', {user_id: userid, otp: otp1}).subscribe({
        next:(data) => {
          resolve(data);
        },
        error:() => {
          resolve(false);
        }
      });
    });
  }
}
