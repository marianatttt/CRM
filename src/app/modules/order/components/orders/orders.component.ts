import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import { trigger, state, style, animate, transition } from '@angular/animations';
import {MatDialog } from "@angular/material/dialog";

import { OrderService } from "../../../../services";
import { IOrder } from "../../../../interfaces";




@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class OrdersComponent implements OnInit {
  orders: IOrder[] = [];
  currentPage: number;
  itemsPerPage = 25;
  totalItems = 0;
  displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'phone', 'age', 'course', 'course_format', 'status', 'sum', 'alreadyPaid', 'groupId', 'created_at'];
  dataSource:MatTableDataSource<IOrder>;
  expandedElement: IOrder | null;
  sortColumn: string;
  sortDirection: string;



  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
   this._params()
  }


  _params():void{
    this.route.queryParams.subscribe(params => {
      this.currentPage = params['page'] ? +params['page'] : 1;
      this.getOrders();
    });
  }


  getOrders(): void {
    this.orderService.getPaginatedOrders(this.currentPage, this.itemsPerPage, this.sortColumn, this.sortDirection)
      .subscribe((response) => {
        this.orders = response.data;
        this.totalItems = response.total;
        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.sort = this.sort;
      });
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge'
    });
    this.getOrders();
  }


  sortData(column:string):void{
    const direction = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
    this.sortDirection = direction;



    this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page: this.currentPage,
          sortColumn: this.sortColumn,
          sortDirection: this.sortDirection},
          queryParamsHandling: 'merge'
    });
          this.getOrders();
  }


    getColumnLabel(column: string): string {
    switch (column) {
      case 'id':
        return 'ID';
      case 'name':
        return 'Name';
      case 'surname':
        return 'Surname';
      case 'email':
        return 'Email';
      case 'phone':
        return 'Phone';
      case 'age':
        return 'Age';
      case 'course':
        return 'Course';
      case 'course_format':
        return 'Course_format';
      case 'status':
        return 'Status';
      case 'sum':
        return 'Sum';
      case 'alreadyPaid':
        return 'AlreadyPaid';
      case 'groupId':
        return 'Group';
      case 'created_at':
        return 'Created_at';
      case 'manager':
        return 'Manager'
      default:
        return column;
    }
  }

}








