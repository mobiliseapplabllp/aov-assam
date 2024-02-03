import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './service/interceptor/token.interceptor';
import { provideUserIdleConfig } from 'angular-user-idle';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideUserIdleConfig({ idle:2, timeout: 10000, ping: 1 }),
    SQLite
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
