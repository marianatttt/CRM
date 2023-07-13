import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IGroup, IOrder } from '../../interfaces';
import { GroupService, OrderService } from '../../services';

@Component({
  selector: 'app-group-layout',
  templateUrl: './group-layout.component.html',
  styleUrls: ['./group-layout.component.css']
})
export class GroupLayoutComponent implements OnInit {

  editForm: FormGroup;
  form: FormGroup;



  order: IOrder;
  groups: IGroup[];
  isAddingGroup: boolean = false;

  isNewGroupCreated: boolean = false;




  constructor(
    public dialogRef: MatDialogRef<GroupLayoutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: IOrder },
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private groupService: GroupService
  ) {
    this.order = data.order;
    this.groups = [];

    this.editForm = this.formBuilder.group({
      groupId: [this.order?.groupId],
      status: [this.order?.status],
      name: [this.order?.name],
      sum: [this.order?.sum],
      surname: [this.order?.surname],
      alreadyPaid: [this.order?.alreadyPaid],
      email: [this.order?.email],
      course: [this.order?.course],
      phone: [this.order?.phone],
      course_format: [this.order?.course_format],
      age: [this.order?.age],
      course_type: [this.order?.course_type],

    });

  }

  ngOnInit(): void {
    this.editForm.patchValue(this.order);
    this.getGroups();
    this.initForm()
  }

  getGroups(): void {
    this.groupService.getAllGroup().subscribe(value => {
      this.groups = value;

    });
  }

  initForm(): void {
    this.form = new FormGroup({
      name: new FormControl(null)
    })
  }

  saveGroup(): void {
    this.groupService.createGroup(this.form.getRawValue()).subscribe(() => {
      this.getGroups()
      this.isNewGroupCreated = true;
      this.toggleAddingGroup()

    })
  }



  save(): void {
    if (this.editForm.valid) {
      const updatedOrder: IOrder = this.editForm.value;
      updatedOrder.groupId = updatedOrder.groupId ? +updatedOrder.groupId : null;

      console.log(updatedOrder.groupId)
      this.orderService.updateOrder(this.order.id, updatedOrder).subscribe(
        updated => {
          this.dialogRef.close(updated);
        },
        error => {
          console.error('Помилка при збереженні:', error);
        }
      );
    }
  }




  toggleAddingGroup(): void {
    this.isAddingGroup = !this.isAddingGroup;
  }

}























