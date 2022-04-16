import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError,tap } from "rxjs/operators";
import { User } from "./user.model";

export interface AuthResponseData {
  kind:string,
  idToken:string,
  email:string,
  refreshToken:string,
  localId:string,
  expiresIn:string,
  registered?:boolean
}


@Injectable({providedIn:'root'})
export class AuthService {
  userSubject:BehaviorSubject<User|null> = new BehaviorSubject<User>(null);
  private tokenTimer:any;
  constructor(private http:HttpClient, private router:Router){}

  signup(email:string, password:string){
   return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDZkfBP7spyoGDXAjCtAfsRdBEw2D1BkDk',
    {email, password, returnSecureToken:true}).pipe(catchError(this.handleError), tap(resData=>{
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken,
        +resData.expiresIn,
        );
    }))
  }

  login(email:string, password:string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDZkfBP7spyoGDXAjCtAfsRdBEw2D1BkDk',{email,password, returnSecureToken:true})
    .pipe(catchError(this.handleError),tap(resData=>{
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken,
        +resData.expiresIn,
        );
    }))
  }

  logout(){
    localStorage.removeItem('userData')
    this.userSubject.next(null)
    this.router.navigate(['/auth'])
    if(this.tokenTimer){
      clearTimeout(this.tokenTimer)
    }
  }

  autoLogout(expirattionDuration:number){
    this.tokenTimer = setTimeout(()=> {
      this.logout()
    },expirattionDuration)
  }

  autoLogin(){
    const user:{
      email:string,
      id:string,
      _token:string,
      _tokenExpiration:string
    } = JSON.parse(localStorage.getItem('userData'));
    if(!user){
      return;
    }
    const loadedUser = new User(user.email, user.id, user._token, user._tokenExpiration )
    if(loadedUser.token){
      const expirationDuration = new Date(new Date(+user._tokenExpiration).getTime() - new Date().getTime()).getTime()
      this.autoLogout(expirationDuration)
      this.userSubject.next(loadedUser);
    }
  }

  private handleAuthentication (email:string,userId:string, token:string, expiresIn:number){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000).getTime().toString();
    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );
    this.userSubject.next(user)
    this.autoLogout(expiresIn * 1000)
    localStorage.setItem('userData',JSON.stringify(user))
  }

  private handleError(err:HttpErrorResponse){
    console.log(err);
    let errorRes = 'An unknown error occured!';
     if(!err.error || !err.error.error){
       return throwError(errorRes)
     }
     switch(err.error.error.message){
       case 'EMAIL_EXISTS':
          errorRes = 'This email exists already!';
          break;
       case 'OPERATION_NOT_ALLOWED':
         errorRes = 'Password sign-in disabled!';
         break;
       case 'TOO_MANY_ATTEMPTS_TRY_LATER':
         errorRes = 'Too many requests!';
         break;
       case 'EMAIL_NOT_FOUND':
         errorRes = 'No user with such email!';
         break;
      case 'INVALID_PASSWORD':
        errorRes = 'Invalid credentials!';
        break;
      case 'USER_DISABLED':
        errorRes = 'This user is blocked!';
        break;
     }
      return throwError(errorRes)
  }
}
