import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComplaintPageRoutingModule } from './complaint-routing.module';

import { ComplaintPage } from './complaint.page';
import { CostCenterComponent } from './cost-center/cost-center.component';
import { ComplaintCardsComponent } from './complaint-cards/complaint-cards.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { ResponseModalComponent } from './response-modal/response-modal.component';
import { SiteDetailComponent } from './site-detail/site-detail.component';
import { TicketHistoryComponent } from './ticket-history/ticket-history.component';
import { TicketTypeComponent } from './ticket-type/ticket-type.component';
import { TicketWorkComponent } from './ticket-work/ticket-work.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { AssignTicketComponent } from './assign-ticket/assign-ticket.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComplaintPageRoutingModule,
    NgOtpInputModule,
    SharedModule
  ],
  declarations: [
    ComplaintPage,
    CostCenterComponent,
    ComplaintCardsComponent,
    CreateTicketComponent,
    ResponseModalComponent,
    SiteDetailComponent,
    TicketHistoryComponent,
    TicketTypeComponent,
    TicketWorkComponent,
    AssignTicketComponent]
})
export class ComplaintPageModule {}
