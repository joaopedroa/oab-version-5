import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';

import {Router} from '@angular/router'
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  email:any;
  senha:any;
  constructor(private fire: AngularFireAuth,private router:Router) { }

  ngOnInit() {
  }
  registerUser(){
    //regiser new user
   this.fire.auth.createUserWithEmailAndPassword(this.email,this.senha)
   .then(data =>{

       console.log('got data',data);
       alert('Cadastro criado com sucesso!');
       this.router.navigate([''])
   })
   .catch(error =>{
     console.log('got an error',error)
     alert('Email ou senha inválido para cadastro!');
   });
}
}
