import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import { trigger, state, style, animate, transition } from '@angular/animations';
import {MatDialog } from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Subject } from 'rxjs';

import {AuthService, CommentService, OrderService} from "../../../../services";
import {IComment, IOrder} from "../../../../interfaces";




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
export class OrdersComponent implements OnInit  {

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
  expandedRowIndex: number | null = null;
  comments: Record<number, IComment[]> = {};
  orderId:string;
  order: IOrder | null ;
  commentForm: FormGroup;
  commentForms: { [key: number]: FormGroup } = {};
  filteredOrders: any[] = [];
  filterForm: FormGroup;
  filterParams: any = {};
  startDate= new FormControl(new Date());
  endDate= new FormControl(new Date());
  currentUser: any;
  queryParams: any = {};

  filterTimeout: any;
  filterChanged: Subject<void> = new Subject<void>()

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private commentService: CommentService,
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private authService: AuthService,



) {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    });
    this.filterForm = this.formBuilder.group({
      name: [''],
      surname: [''],
      email: [''],
      phone: [''],
      age: [''],
      course: [''],
      course_format: [''],
      course_type: [''],
      status: [''],
      groupId:[''],
      startDate: [''],
      endDate: ['']
    });
    this.expandedElement = null;

  }



  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // this.currentPage = params['page'] ? +params['page'] : 1;

      this.filterForm.patchValue(params);
      this.sortColumn = params['sortColumn'] ; // Отримати поточне значення стовпця сортування з параметрів запиту
      this.sortDirection = params['sortDirection'] ; // Отримати поточне значення напрямку сортування з параметрів запиту


    });
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      if (this.orderId) {
        this.loadComments(+this.orderId);
      }
    });
    this.authService.me().subscribe(user => {
      this.currentUser = user;
    });

    this.onFilterChange();


  }


  getOrders(): void {
    this.orderService.getPaginatedOrders(
      this.currentPage,
      this.itemsPerPage,
      this.sortColumn,
      this.sortDirection,
      this.filterParams,
      this.filterForm.value.startDate,
      this.filterForm.value.endDate
    )
      .subscribe(response => {
        this.orders = response.data;
        this.totalItems = response.total;
        this.dataSource = new MatTableDataSource(this.orders);

        });


  }


  loadComments(orderId: number): void {
    this.commentService.getAllCommentsByOrderId(orderId)
      .subscribe(comments => {
        this.comments[orderId] = comments;
      });
  }

  setExpandedElement(element: IOrder): void {
    if (this.expandedElement === element) {
      this.expandedElement = null;
    } else {
      this.expandedElement = element;
      this.loadComments(element.id);
    }
  }



  addComment(orderId: number) {
    const commentControl = this.commentForm.get('comment');
    if (commentControl) {
      const comment = commentControl.value;
      this.commentService.addCommentToOrder(orderId, comment).subscribe(newComment => {
        if (this.comments[orderId]) {
          this.comments[orderId].push(newComment);
        } else {
          this.comments[orderId] = [newComment];
        }
        this.commentForm.reset();

      });
    }
  }





  getManagerFullName(manager: any): string {
    if (manager && manager.firstName && manager.lastName) {
      return manager.firstName + ' ' + manager.lastName;
    } else {
      return 'null';
    }
  }

  getCommentAuthor(comment: IComment): string {
    const order = this.orders.find(order => order.id === comment.orderId);
    if (order && order.manager && order.manager.id === comment.userId) {
      return `${order.manager.firstName} ${order.manager.lastName}`;
    }
    return 'Unknown';
  }


  isMyOrder(order: any): boolean {
    if (!this.currentUser) {
      return false;
    }
    if (order.userId === this.currentUser.userId || order.managerId === this.currentUser.userId || order.managerId === null) {
      return true;
    }
    return false;
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


  onFilterChange() {
    clearTimeout(this.filterTimeout); // Скасувати попередню затримку

    this.filterTimeout = setTimeout(() => {
  const filterParams: any = {};

  if (this.filterForm.value.name) {
    filterParams['name'] = `like:${this.filterForm.value.name}`;
  }

  if (this.filterForm.value.surname) {
    filterParams['surname'] = `like:${this.filterForm.value.surname}`;
  }

  if (this.filterForm.value.email) {
    filterParams['email'] = `like:${this.filterForm.value.email}`;
  }

  if (this.filterForm.value.phone) {
    filterParams['phone'] = `like:${this.filterForm.value.phone}`;
  }

  if (this.filterForm.value.age) {
    filterParams['age'] = `eq:${this.filterForm.value.age}`;
  }

  if (this.filterForm.value.course) {
    filterParams['course'] = this.filterForm.value.course;
  }

  if (this.filterForm.value.course_type) {
    filterParams['course_type'] = this.filterForm.value.course_type;
  }

  if (this.filterForm.value.course_format) {
    filterParams['course_format'] = this.filterForm.value.course_format;
  }

  if (this.filterForm.value.status) {
    filterParams['status'] = this.filterForm.value.status;
  }

  if (this.filterForm.value.groupId) {
    filterParams['groupId'] = this.filterForm.value.groupId;
  }

  if (this.filterForm.value.startDate) {
    const startDate = new Date(this.filterForm.value.startDate);
    filterParams['startDate'] = startDate.toISOString();
  }

  if (this.filterForm.value.endDate) {
    const endDate = new Date(this.filterForm.value.endDate);
    filterParams['endDate'] = endDate.toISOString();
  }

  this.filterParams = { ...filterParams };
  this.currentPage = 1;

  const queryParams: any = {
    page: this.currentPage,
    sortColumn: this.sortColumn,
    sortDirection: this.sortDirection,
    ...filterParams,

  };

  for (const key in filterParams) {
    if (filterParams.hasOwnProperty(key)) {
      const value = filterParams[key];
      if (value || value === 0) { // Перевіряємо, чи значення не пусте або невизначене
        if (value.startsWith('like:')) {
          queryParams[key] = value.substring(5);
        } else if (value.startsWith('eq:')) {
          queryParams[key] = value.substring(3);
        } else {
          if (key === 'startDate' || key === 'endDate') {
            const date = new Date(value);
            queryParams[key] = date.toISOString().substring(0, 10);
          } else {
            queryParams[key] = value;
          }
        }
      }
    }
  }

      const navigationExtras: NavigationExtras = {
        queryParams,
      };

      this.router.navigate([], navigationExtras);

      this.getOrders(); // Переміщено сюди
    }, 400);
  }


  sortData(column: string): void {
    const direction = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
    this.sortDirection = direction;

    this.currentPage = 1;

    const queryParams: any = {
      ...this.route.snapshot.queryParams,
      page: this.currentPage,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,

    };

    const navigationExtras: NavigationExtras = {
      queryParams,
    };

    this.router.navigate([], navigationExtras);

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











}








// onFilterChange() {
//   this.filterForm.valueChanges
//     .pipe(
//       debounceTime(300),
//       distinctUntilChanged()
//     )
//     .subscribe(() => {
//       this.currentPage = 1;
//       this.getOrders();
//
//       const filterParams: any = {};
//
//       if (this.filterForm.value.name) {
//         filterParams['name'] = `like:${this.filterForm.value.name}`;
//       }
//
//       if (this.filterForm.value.surname) {
//         filterParams['surname'] = `like:${this.filterForm.value.surname}`;
//       }
//
//       if (this.filterForm.value.email) {
//         filterParams['email'] = `like:${this.filterForm.value.email}`;
//       }
//
//       if (this.filterForm.value.phone) {
//         filterParams['phone'] = `like:${this.filterForm.value.phone}`;
//       }
//
//       if (this.filterForm.value.age) {
//         filterParams['age'] = `eq:${this.filterForm.value.age}`;
//       }
//
//       if (this.filterForm.value.course) {
//         filterParams['course'] = this.filterForm.value.course;
//       }
//
//       if (this.filterForm.value.course_type) {
//         filterParams['course_type'] = this.filterForm.value.course_type;
//       }
//
//       if (this.filterForm.value.course_format) {
//         filterParams['course_format'] = this.filterForm.value.course_format;
//       }
//
//       if (this.filterForm.value.status) {
//         filterParams['status'] = this.filterForm.value.status;
//       }
//
//       if (this.filterForm.value.groupId) {
//         filterParams['groupId'] = this.filterForm.value.groupId;
//       }
//
//       if (this.filterForm.value.startDate) {
//         const startDate = new Date(this.filterForm.value.startDate);
//         filterParams['startDate'] = startDate.toISOString() ;
//       }
//
//
//       if (this.filterForm.value.endDate) {
//         const endDate = new Date(this.filterForm.value.endDate);
//         filterParams['endDate'] = endDate.toISOString();
//       }
//
//
//
//
//
//       this.filterParams = { ...filterParams };
//       this.currentPage = 1;
//
//       const queryParams: any = {
//         page: this.currentPage,
//         sortColumn: this.sortColumn,
//         sortDirection: this.sortDirection,
//         ...filterParams,
//
//       };
//
//       for (const key in filterParams) {
//         if (filterParams.hasOwnProperty(key)) {
//           const value = filterParams[key];
//           if (value || value === 0) {
//             if (value.startsWith('like:')) {
//               queryParams[key] = value.substring(5);
//             } else if (value.startsWith('eq:')) {
//               queryParams[key] = value.substring(3);
//             } else {
//               if (key === 'startDate' || key === 'endDate') {
//                 const date = new Date(value);
//                 queryParams[key] = date.toISOString().substring(0, 10);
//               } else {
//                 queryParams[key] = value;
//               }
//             }
//           }
//         }
//       }
//
//       const navigationExtras: NavigationExtras = {
//         queryParams,
//       };
//
//       this.router.navigate([], navigationExtras).then(() => {
//         // Отримання відфільтрованих даних після переходу на нову сторінку
//         this.getOrders();
//       });
//     });
// }
