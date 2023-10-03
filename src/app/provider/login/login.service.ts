import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userDataTemp: any = [];
  username = new BehaviorSubject([]);
  // private myMenuTemp = new BehaviorSubject(0);
  userData: any = [];
  constructor(
    public https: HttpClient
  ) { }

  LoginAuth(login: any) {
    return new Promise(resolve => {
      const obj = {
        username: login.userid,
        password: login.password
      }
      this.https.post(environment.url + 'login' , obj).subscribe({
        next:(data) => {
          this.userDataTemp = data;
          console.log(this.userDataTemp);
          if (this.userDataTemp.status) {
            this.userData = this.userDataTemp.user;
            console.log(this.userData);
            this.username.next(this.userData);
          }
          resolve(data);
        },
        error:() => {
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
