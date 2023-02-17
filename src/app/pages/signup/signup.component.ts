import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  registerForm: UntypedFormGroup;
  registerCleanerForm: UntypedFormGroup;
  constructor(public formBuilder: UntypedFormBuilder, public router: Router, public authService: AuthService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      "email": ['', Validators.required],
      "password": ['', Validators.required],
      "confirmPassword": ['', Validators.required]
    })

    this.registerCleanerForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      "email": ['', Validators.required],
      "password": ['', Validators.required],
      "confirmPassword": ['', Validators.required]
    })
  }

  public onRegisterFormSubmit(values: any): void{
    if(this.registerForm.valid){
      this.authService.SignUp(values.email, values.password, 'user');
    }
    if(this.registerCleanerForm.valid){
      this.authService.SignUp(values.email, values.password, 'cleaner');
    }
  }

}
