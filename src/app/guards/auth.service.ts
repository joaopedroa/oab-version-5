import { Injectable } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import { EventEmitter } from 'events';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
@Injectable()
export class AuthService {
  authState
  constructor(private fire: AngularFireAuth,private router:Router) { }

  signInUser(email:string,senha:string) {

    this.fire.auth.signInWithEmailAndPassword(email, senha).then((user) => {
      console.log(user.uid);
      localStorage.setItem('uid',user.uid);      
      //this.authState = user;
      this.router.navigate(['simulado']);
    }) .catch(error => {
      console.log('got an error',error);
     // alert('Email ou Senha incorreto!')
     swal("Erro ao efetuar login!", "Email ou senha incorreto!", "error");
  });
}

authUser(): boolean {
  return localStorage.getItem('uid') !== null && localStorage.getItem('uid') !== undefined ? true : false;
}
}
