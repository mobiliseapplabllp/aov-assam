import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/provider/common/common.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private common: CommonService
  ) { }

  ngOnInit() {
  }

  registeredFormSubmit() {
    setTimeout(() => {
      this.common.presentToastWithOk('Dear User, Thank you for registering. Your Account details will be verified by your company Administrator and activation details will be shared on your registered email id. Thank you.', 'success');
    }, 3000);
  }

}
