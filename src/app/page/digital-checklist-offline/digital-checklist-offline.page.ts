import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/provider/common/common.service';

@Component({
  selector: 'app-digital-checklist-offline',
  templateUrl: './digital-checklist-offline.page.html',
  styleUrls: ['./digital-checklist-offline.page.scss'],
})
export class DigitalChecklistOfflinePage implements OnInit {
  allData: any = [];
  allDataNew: any = [];
  isInternet!: boolean;
  constructor(
    private router: Router,
    private common: CommonService
  ) { }

  ngOnInit() {
    this.common.checkInternet().then(res => {
      if (res) {
        this.isInternet = true
      } else {
        this.isInternet = false;
      }
    });
  }

  ionViewDidEnter() {
    let temp = localStorage.getItem('checkListData');
    if (temp) {
      this.allData = JSON.parse(temp);
      console.log(this.allData);
    }
  }

  ionViewWilllLeave() {
    this.allData = [];
  }

  openTran(dat: any) {
    console.log(dat);
    this.router.navigate(['digital-checklist-offline/fill-report-offline'], {
      queryParams: {
        data: JSON.stringify(dat),
      }
    });
  }

  uploadToSever() {
    this.allDataNew = JSON.parse(JSON.stringify(this.allData));
    this.allDataNew = this.allDataNew.filter((val: any) =>  val.offlineSave === true);
    for (var i  = 0; i < this.allDataNew.length; i++) {
      delete this.allDataNew[i].backgroundColor;
      delete this.allDataNew[i].barcode;
      delete this.allDataNew[i].location_desc;
      delete this.allDataNew[i].chk_cat_name;
      delete this.allDataNew[i].device_name;
      delete this.allDataNew[i].schedule_unique_id;
      delete this.allDataNew[i].schedule_status;
      for (var j = 0 ; j < this.allDataNew[i].qus.length; j++) {
        delete this.allDataNew[i].qus[j].critical_desc;
        delete this.allDataNew[i].qus[j].options;
        delete this.allDataNew[i].qus[j].q_desc;
        delete this.allDataNew[i].qus[j].q_max_score;
        delete this.allDataNew[i].qus[j].q_type;
        delete this.allDataNew[i].qus[j].question_type;

      }
    }
    if (this.allDataNew.length == 0) {
      this.common.presentToast('Please Save at least one Checklist to Save to server', 'warning');
    } else {
      console.log(this.allDataNew);
    }
  }
}
