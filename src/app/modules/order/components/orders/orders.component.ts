import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import { trigger, state, style, animate, transition } from '@angular/animations';
import {MatDialog } from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras } from '@angular/router';

import {CommentService, OrderService} from "../../../../services";
import { IComment, IOrder} from "../../../../interfaces";




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

  isExpansionDetailRow = (i: number, row: any) => row.hasOwnProperty('detailRow');

  orders: IOrder[] = [];
  currentPage: number;
  itemsPerPage = 25;
  totalItems = 0;
  displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'phone', 'age', 'course', 'course_format','course_type', 'status', 'sum', 'alreadyPaid', 'groupId', 'created_at', 'manager'];
  dataSource:MatTableDataSource<IOrder>;
  expandedElement: IOrder | null;
  sortColumn: string;
  sortDirection: string;

  comments: { [orderId: number]: IComment[] } = {};
  orderId:string;

  order: IOrder | null ;
  commentForm: FormGroup;
  commentForms: { [key: number]: FormGroup } = {};
  filters: any = {};

  filteredOrders: any[] = [];
  filterForm: FormGroup;
  filterParams: any = {};



  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private commentService: CommentService,
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
  ) {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    });
    this.filterForm = this.formBuilder.group({
      Name: [''],
      Surname: [''],
      Email: [''],
      Phone: [''],
      Age: [''],
      Course: [''],
      Course_format: [''],
      Course_type: [''],
      Status: [''],
      StartDate: [''],
      EndDate: ['']
    });

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = params['page'] ? +params['page'] : 1;
      this.filterForm.patchValue(params)
      this.getOrders();
    });
  }

  getOrders(): void {
    this.orderService.getPaginatedOrders(
      this.currentPage,
      this.itemsPerPage,
      this.sortColumn,
      this.sortDirection,
      this.filterParams,
  )
      .subscribe(response => {
        this.orders = response.data;
        this.totalItems = response.total;
        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.sort = this.sort;
        this.filterOrders();
        this.dataSource.data = this.filteredOrders;
        this.filterParams = this.filters
        this.getOrdersWithComments();
      });
    console.log('Filter Params:', this.filterParams)
  }


  filterOrders() {
    const filters = this.filterForm.value;
    this.filteredOrders = this.orders.filter((order: IOrder) => {
      const startDate = filters.StartDate ? new Date(filters.StartDate) : null;
      const endDate = filters.EndDate ? new Date(filters.EndDate) : null;
      const orderDate = new Date(order.created_at);
      const validStartDate = startDate ? startDate : new Date("1970-01-01");
      const validEndDate = endDate ? endDate : new Date();
      return (
        (!filters.Name || order.name.toLowerCase().includes(filters.Name.toLowerCase())) &&
        (!filters.Surname || order.surname.toLowerCase().includes(filters.Surname.toLowerCase())) &&
        (!filters.Email || order.email.toLowerCase().includes(filters.Email.toLowerCase())) &&
        (!filters.Phone || order.phone.toLowerCase().includes(filters.Phone.toLowerCase())) &&
        (!filters.Age || order.age.toString() === filters.Age) &&
        (!filters.Course || order.course === filters.Course) &&
        (!filters.Course_format || order.course_format === filters.Course_format) &&
        (!filters.Course_type || order.course_type === filters.Course_type) &&
        (!filters.Status || order.status === filters.Status) &&
        (!filters.StartDate || orderDate >= validStartDate) &&
        (!filters.EndDate || orderDate <= validEndDate)
      );
    });
  }

  onFilterChange() {
    const filters = this.filterForm.value;
    console.log('StartDate:', filters.StartDate);
    console.log('EndDate:', filters.EndDate);
    const queryParams: any = { page: this.currentPage };
    Object.keys(filters).forEach(key => {

      if (filters.hasOwnProperty(key) && filters[key]) {
        if (key === 'StartDate' || key === 'EndDate') {
          const date = new Date(filters[key]);
          queryParams[key] = date.toISOString().split('T')[0];
        } else {
          queryParams[key] = filters[key];
        }
      } else {
        queryParams[key] = null;
      }
    });

    const navigationExtras: NavigationExtras = {
      queryParams,
      queryParamsHandling: 'merge',
    };
    this.router.navigate([], navigationExtras).then(() => {
      this.getOrders();
    });
  }

  sortData(column:string):void{
    const direction = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
    this.sortDirection = direction;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sortColumn: this.sortColumn,
        sortDirection: this.sortDirection,},
      queryParamsHandling: 'merge'
    });
    this.getOrders();
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


  addComment(orderId: number) {
    const commentControl = this.commentForm.get('comment');
    if (commentControl) {
      const comment = commentControl.value;
      this.commentService.addCommentToOrder(orderId, comment).subscribe(newComment => {
        const order = this.orders.find(order => order.id === orderId);
        if (order) {
          order.comments.push(newComment);
        }
        this.commentForm.reset();
      });
    }
  }

  getOrdersWithComments(): void {
    this.commentService.getOrdersWithComments(this.orders)
      .subscribe(ordersWithComments => {
        this.orders = ordersWithComments;
      });
  }

  getCommentsByOrderId(orderId: number): IComment[] {
    const order = this.orders.find(order => order.id === orderId);
    return order ? order.comments : [];
  }

  getManagerFullName(manager: any): string {
    if (manager && manager.firstName && manager.lastName) {
      return manager.firstName + ' ' + manager.lastName;
    } else {
      return 'null';
    }
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
        return 'Manager';
      case 'course_type':
        return 'Course_type'
      default:
        return column;
    }
  }
}
