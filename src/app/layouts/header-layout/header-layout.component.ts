import { Router} from '@angular/router';
import { Location } from '@angular/common';

import {Component, OnInit} from '@angular/core';
import {IAuth} from "../../interfaces";
import {AuthService} from "../../services";


@Component({
  selector: 'app-header-layout',
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.css']
})
export class HeaderLayoutComponent implements OnInit{
user:IAuth|null;


  constructor(
    private authService: AuthService,
    private location: Location,
    private router: Router,



  ) {}

  ngOnInit(): void {
    this.authService.getAuthUser().subscribe((value) => {
      if (value) {
        this.user = value;
      } else {
        this.authService.me().subscribe((value) => {
          this.authService.setAuthUser(value);
          this.user = value;
          console.log(value);
        });
      }
    });
  }




  navigateToHomePage(): void {
    this.router.navigateByUrl('/order', { replaceUrl: true }).then(() => {
      window.location.reload();
    });
  }







  deleteToken(): void {
    this.authService.deleteTokens();
    this.router.navigateByUrl('/auth/login');
  }
}





