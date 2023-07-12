import { Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';

import {IAuth} from "../../interfaces";
import {AuthService, PageResetService} from "../../services";




@Component({
  selector: 'app-header-layout',
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.css'],

})
export class HeaderLayoutComponent implements OnInit{
  user:IAuth|null;



  constructor(
    private authService: AuthService,
    private router: Router,
    private pageResetService: PageResetService

  ) {
  }

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




  deleteToken(): void {
    this.authService.deleteTokens();
    this.router.navigateByUrl('/auth/login');
  }

  resetPage() {
    const currentUrl = this.router.url;

    if (currentUrl.includes('/user')) {

      this.router.navigateByUrl('/order');
    } else if (currentUrl.includes('/order')) {

      this.pageResetService.resetPage();
    }
  }
}








