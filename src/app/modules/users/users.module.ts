import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { UsersComponent } from './components/users/users.component';
import {MatToolbarModule} from "@angular/material/toolbar";


@NgModule({
  declarations: [
    UserPageComponent,
    UsersComponent,

  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatToolbarModule

  ]
})
export class UsersModule { }
