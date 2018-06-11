import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuardService implements CanActivate {


  user:Observable<firebase.User>;
  authenticated:boolean = false;
  constructor(public fire:AngularFireAuth,private router:Router,public server:AuthService) {
   
   }
   canActivate(): Observable<boolean> {
    return this.fire.authState
      .take(1)
      .map(authState => !!authState)
      .do(authenticated => {
        if (!authenticated) {
          this.router.navigate(['']);
        }
      });
  }


/*
  
  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot

  ):Observable<boolean> | boolean{


  if (localStorage.getItem('uid') !== undefined || localStorage.getItem('uid') !== null){
  return true;    
}
  else {
  console.log('You must be logged in');
  this.router.navigate(['']);
  return false;
}
  }
  */

 
}
