import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatDialogRef} from "@angular/material/dialog";

import {AuthService} from "../../../../services";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements  OnInit{
  form:FormGroup;
  error:boolean;
  constructor(
    private authService:AuthService,
    private router :Router,
    private dialogRef :MatDialogRef<LoginFormComponent>) {}
  ngOnInit(): void {
    this._initForm()
  }

  _initForm():void{
    this.form = new FormGroup<any>({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  login():void {
    this.authService.login(this.form.getRawValue()).subscribe({
      complete: () => {
        this.error = false
      },
      error: (err) => {
        console.log(err)
        this.error = true
      },
      next: () => {
        this.router.navigate(['/order'])
        this.dialogRef.close()
      }
    })
  }
}
