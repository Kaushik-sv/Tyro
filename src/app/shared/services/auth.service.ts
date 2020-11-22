import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, retry,tap} from 'rxjs/operators';
import {Subject, throwError,BehaviorSubject} from 'rxjs';
import { User } from '../model/user.model';

​
@Injectable({providedIn:'root'})
export class AuthService{
  user=new BehaviorSubject<User>(null);
  loggedIn=false;
​
    constructor(private http:HttpClient){}
    isAuthenticated(){
      const promise=new Promise(
        (resolve,reject)=>{
          setTimeout(() => {
            resolve(this.loggedIn);
          }, 1000);
        }
      );
      return promise;
    }
signup(username:string,email:string,password:string){
  this.loggedIn=true;
 return this.http.post<any>('https://team-knuth-tyro.herokuapp.com/v1/signup'
,{   
    observe:'response',
     username:username,
     email:email,
     password:password
    
}
).pipe(retry(1),catchError(this.handleError)
,tap(resData=>{
  
   this.handleAuthentication(resData.body.id,
    resData.body.username,resData.body.email,resData.headers.get('authorization'));
}));
​
}
handleError(error) {
​
    let errorMessage = 'An unknown error occured!S';
 
    if (error.error instanceof ErrorEvent) {
 
       errorMessage = `Error: ${error.error.message}`;
 
    } else {
 
      errorMessage = `Message: ${error.error.message}`;
 
    }
 
    
 
    return throwError(errorMessage);
 
  }
login(email:string,password:string){
  this.loggedIn=true;
    return this.http.post<any>('https://team-knuth-tyro.herokuapp.com/v1/signin',
    {   
      //  observe: 'response'
      email:email,
        password:password
    },{
       observe:'response' as 'body'
       
    }).pipe(retry(1),catchError(this.handleErrorlogin),tap(resData=>{
        this.handleAuthentication(resData.body.id,
         resData.body.username,resData.body.email,resData.headers.get('authorization'));
     }));
    
}
handleErrorlogin(error) {
​
    let errorMessage = 'An unknown error occured!S';
 
    if (error.error instanceof ErrorEvent) {
 
    
 
      errorMessage = `Error: ${error.error.error}`;
 
    } else {
 
      
 
      errorMessage = `Message: ${error.error.error}`;
 
    }
 
    
    return throwError(errorMessage);
 
  }
  private handleAuthentication(id:string,username:string,email:string,token:string){
    const user=new User(
        id,
        username,
        email,
        token);
    this.user.next(user);
    
   
  }
 
  
  
}