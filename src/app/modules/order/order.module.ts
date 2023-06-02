import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from "ngx-pagination";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";

import { OrderRoutingModule } from './order-routing.module';
import { OrderPageComponent } from './pages/order-page/order-page.component';
import { OrdersComponent } from './components/orders/orders.component';



@NgModule({
  declarations: [
    OrderPageComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    NgxPaginationModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,



  ]
})
export class OrderModule { }
