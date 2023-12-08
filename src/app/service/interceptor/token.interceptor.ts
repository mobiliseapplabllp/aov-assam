import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { App } from '@capacitor/app';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    public alertController: AlertController) {
    }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!localStorage.getItem('token1')) {
      return next.handle(request);
    } else {
      if (request.url != 'https://translate.googleapis.com/language/translate/v2?key=AIzaSyDJjHphpheVQM7CRYNqHHdJqMqAgt0IY70') {
        const userToken = localStorage.getItem('token1');
        const modifiedReq = request.clone({headers: request.headers.set('Authorization', `Bearer ${userToken}`).set('Accept', 'application/json')});
        return next.handle(modifiedReq).pipe(tap(() => {},
          (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
            return;
            }
            alert('Your Session is timeout please login again');
            this.router.navigateByUrl('/login',{replaceUrl: true});
          }
        }));
      } else {
        const userToken = localStorage.getItem('token1');
        const modifiedReq = request.clone({headers: request.headers.set('Accept', 'application/json')});
        return next.handle(modifiedReq).pipe(tap(() => {},
          (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
            return;
            }
            alert('Your Session is timeout please login again');
            this.router.navigateByUrl('/login',{replaceUrl: true});
          }
        }));
      }

    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'You Login on Mobile Or Desktop',
      buttons: [{
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');
        }
      }]
    });
    await alert.present();
  }
}
