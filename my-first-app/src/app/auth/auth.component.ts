import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from './user.model';



@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoading = false;
  authForm:FormGroup;
  isLoginMode = true;
  error:string='';
  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit(): void {
    this.authForm = new FormGroup({
      'email': new FormControl('', Validators.email),
      'password': new FormControl('', Validators.required)
    })

  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(){
    if(this.authForm.invalid){
      return;
    }
    this.isLoading = true;
    const {email,password} = this.authForm.value;
    let authObs: Observable<any>;
    if(this.isLoginMode){
      authObs = this.authService.login(email,password);
    }
    else{
      authObs = this.authService.signup(email,password);
    }

    authObs.subscribe({
      next:(response)=>{
      console.log(response);
      this.router.navigate(['/recipes'])
      }, error: (errorMessage)=>{
        this.error = errorMessage;
        console.log(errorMessage);
        this.isLoading = false;
      }
   })

    this.authForm.reset()
  }

}
