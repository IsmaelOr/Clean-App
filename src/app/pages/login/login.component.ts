import { Component, OnInit } from '@angular/core';
import { EmailValidator, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;

  constructor(public formBuilder: UntypedFormBuilder, public router: Router, public authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      "email": ['', Validators.required],
      "password": ['', Validators.required],
    });
  }

  public onLoginFormSubmit(values: Object): void{
    if(this.loginForm.valid){
      
    }
  }

}
