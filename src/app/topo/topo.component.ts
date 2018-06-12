import { Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import { EventEmitter } from 'protractor';
import {Router} from '@angular/router'
import * as firebase from 'firebase/app';
import { AuthService } from '../guards/auth.service';
import { Observable } from 'rxjs/Observable';
import { AuthGuardService } from '../guards/auth-guard.service';



@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css']
})
export class TopoComponent implements OnInit {
  
  user:Observable<firebase.User>;
  authenticated:boolean;

  constructor(public fire:AngularFireAuth,public router:Router,public server:AuthGuardService) {
    this.fire.authState.subscribe((auth) =>{
      if(auth !== null){
        this.user = fire.authState;
        this.authenticated = true;
        
      }else{
        this.authenticated = false; 
      }
})
  }

  ngOnInit(){
   
   

  }
 
 
    logOut(){
      this.fire.auth.signOut();
      localStorage.removeItem('uid');
      this.router.navigate([""]);
      //this.authenticated = false;
    }
 
}
