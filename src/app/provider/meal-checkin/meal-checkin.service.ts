import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MealCheckinService {

  constructor(
    private https: HttpClient
  ) { }

  getFoodYou(pc_id: any): Observable<any> {
    let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    return this.https.get(environment.url + 'meal/socampus/foodnyou?pc_id='+ pc_id +'&curr_datetime=' + datetime);
  }

  mealLocation(pc_id: any, loc_id: any): Observable<any> {
    let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    return this.https.get(environment.url + 'meal/socampus/locationmeals?pc_id='+ pc_id +'&loc_id='+ loc_id + '&curr_datetime=' + datetime);
  }

  checkInMeal(object: object, encryptionId: any): Observable<any> {
    return this.https.post(environment.url + 'meal/engin/mealcheckin/' + encryptionId  , object);
  }

  getPcLocation(pc_code: any): Observable<any> {
    return this.https.get(environment.url + 'shared/get-pc-locations/' + pc_code + '?/for=meal');
  }

  getMealType(pc_code: any): Observable<any> {
    return this.https.get(environment.url + 'meal/meal-type/get/dropdown?pc_id=' + pc_code);
  }

  getRoaster(forms: any): Observable<any> {
    let param = new HttpParams();
      for (const key in forms) {
        if (forms[key] !== '' && forms[key] !== undefined && forms[key] !== null) {
          param = param.append(key, forms[key]);
        }
      }
      param = param.append('limit', '20');
      param = param.append('page', '1');
      return this.https.get(environment.url + 'meal/roaster/list' , {params: param});
  }

}
