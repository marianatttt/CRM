import {Component, OnInit} from '@angular/core';

import {IAuth} from "../../../../interfaces";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: IAuth

  constructor() {
  }

  ngOnInit(): void {

  }
}
