import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import {FloatLabelType} from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  constructor(public formBuilder: UntypedFormBuilder, public router: Router, public authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      "email": ['', Validators.compose([Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])],
      "password": ['', Validators.compose([Validators.required])],
    });
  }

  public onLoginFormSubmit(values: Object): void{
    if(this.loginForm.valid){
      
    }
  }


}
