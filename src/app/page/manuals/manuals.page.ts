import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { ManualsService } from 'src/app/provider/manuals/manuals.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manuals',
  templateUrl: './manuals.page.html',
  styleUrls: ['./manuals.page.scss'],
})
export class ManualsPage implements OnInit {
  status = 'manual';
  loading: any;
  manualsList: any = [];
  public manuals!: FormGroup;
  public hns!: FormGroup;
  category: any = [];
  hnsArr: any = [];
  constructor(
    private formbuilder: FormBuilder,
    private httpManual: ManualsService,
    private common: CommonService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.initForm();
    this.initFormHns();
    this.getCategory();
  }

  initForm() {
    this.manuals = this.formbuilder.group({
      equipment_name: ['', Validators.required],
      make: ['' , Validators.required],
      model: ['' , Validators.required],
    });
  }

  initFormHns() {
    this.hns = this.formbuilder.group({
      cat_id: [''],
      cat_desc: ['']
    })
  }

  getCategory() {
    this.httpManual.getCategoryDropdown().subscribe(data => {
      if (data.status) {
        this.category = data.data;
      }
    });
  }

  getManuals() {
    this.presentLoading().then(preLoad => {
      this.httpManual.getManualMaster(this.manuals.value).subscribe(data => {
        this.dismissloading();
        console.log(data);
        if (data.status) {
          this.manualsList = data.data.data;
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      }, err => {
        this.common.presentToast(environment.errMsg, 'danger');
      });
    })
  }

  searchHns() {
    this.hnsArr = [];
    this.presentLoading().then(preLoad => {
      this.httpManual.getHns(this.hns.value).subscribe(data => {
        this.dismissloading();
        console.log(data);
        if (data.status) {
          this.hnsArr = data.data.data
        } else {
          alert(data.msg);
        }
      }, err => {
        this.dismissloading();
        alert('Internal Server Error');
      })
    })
  }

  openDoc(url: string) {
    this.common.openDoc(url);
  }


  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  async dismissloading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  reset() {
    this.manuals.reset();
  }

  resethns() {
    this.hns.reset();
  }

}
