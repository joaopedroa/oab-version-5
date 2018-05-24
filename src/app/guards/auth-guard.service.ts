import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'


@Injectable()
export class AuthGuardService implements CanActivate {


  user:Observable<firebase.User>;
  authenticated:boolean = false;
  constructor(public fire:AngularFireAuth,private router:Router) {

    this.fire.authState.subscribe((auth) =>{
      console.log(auth)
        if(auth !== null){
          this.user = fire.authState;
          this.authenticated = true;
        }else{
          this.authenticated = false; 
        }
    })
   }




  
  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot

  ):Observable<boolean> | boolean{

    if(this.authenticated){
      return true;
    }else{
      this.router.navigate([""]);
       this.fire.auth.signOut();
      return false;
    }
  


  }

 
}
