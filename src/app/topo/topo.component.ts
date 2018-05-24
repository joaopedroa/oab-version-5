import { Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import { EventEmitter } from 'protractor';
import {Router} from '@angular/router'
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';




@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css']
})
export class TopoComponent implements OnInit {
  
  user:Observable<firebase.User>;
  authenticated:boolean = false;
  constructor(public fire:AngularFireAuth,public router:Router) {    
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

  ngOnInit(){
   
   

  }

 
 
    logOut(){
      this.fire.auth.signOut();
      this.router.navigate([""]);
      //this.authenticated = false;
    }
 
}
