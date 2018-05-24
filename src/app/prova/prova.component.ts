import { Component, OnInit,ViewChild } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router'
import { XlsxToJsonServiceService } from '../guards/xlsx-to-json-service.service';
@Component({
  selector: 'app-prova',
  templateUrl: './prova.component.html',
  styleUrls: ['./prova.component.css']
})
export class ProvaComponent implements OnInit {



  public results:any ;
  public result:any ;
  private xlsxToJsonService: XlsxToJsonServiceService = new XlsxToJsonServiceService();
  validacao:number = 0;
  
  //DECLARAÇÃO DAS VARIAVEIS
  currentTab:number = 0;
  pergunta:string;
  resposta1:string;
  resposta2:string;
  resposta3:string;
  resposta4:string;
  justificativaresposta1:string = null;
  justificativaresposta2:string = null;
  justificativaresposta3:string = null;
  justificativaresposta4:string = null;
  active = 'active';
  finish = 'finish';
  perguntas : Observable<any[]>;
  dataYear:any = new Date().getFullYear();
  year:any = [];
  valueYear:number = this.dataYear;
  closeResult: string;
  perguntaEditar:string;
  resposta1Editar:string;
  resposta2Editar:string; 
  resposta3Editar:string;
  resposta4Editar:string;
  justificativaresposta1Editar:string;
  justificativaresposta2Editar:string;
  justificativaresposta3Editar:string;
  justificativaresposta4Editar:string;
  keyEditar:string;
  usuario:any;
  disciplinas:any;
  disciplina:any;
  respostaCorreta:string;
  respostaCorretaEditar:string;
  respostaCorretaBackground:string;
  @ViewChild('valuePath') valuePath; 
   
  constructor(public database:AngularFireDatabase,private modalService: NgbModal, public fire:AngularFireAuth) {
   
   

    this.disciplinas = ['Ética','Filosofia','Constitucional','Direito Humanos','Internacional','Tributário','Administrativo','Ambiental','Civil','ECA','CDC','Empresarial','Processo Civil','Penal','Processo Penal','Direito do Trabalho','Processo do Trabalho']
    this.disciplina = this.disciplinas[0];
    // LISTA AS PERGUNTAS DO FIREBASE
    this.perguntas = this.database.list('prova/' + this.valueYear + '/' + this.disciplina).snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    });

    // FOR PARA DADOS DO SELECT YEAR
    for(let x=0;x<20;x++)
    {
      this.year.push(this.dataYear);
      this.dataYear--;
    }
    
}
ngOnInit() {
 
  
}

handleFile(event) {

  let file = event.target.files[0];
  this.xlsxToJsonService.processFileToJson({}, file).subscribe(data => {
    this.results = JSON.stringify(data['sheets']['Planilha1']);
    console.log(this.result);
    console.log(JSON.parse(this.results));
    this.result = JSON.parse(this.results);
  })


}
selectAno(){
  this.perguntas = this.database.list('prova/' + this.valueYear + '/' + this.disciplina).snapshotChanges().map(arr => {
    return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
  });
}
open(content, item) {

  this.modalService.open(content, { size: 'lg' }).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
  this.respostaCorretaBackground = item.respostaCorreta;
  this.perguntaEditar = item.pergunta;
  this.resposta1Editar = item.respostas.resposta1
  this.resposta2Editar = item.respostas.resposta2
  this.resposta3Editar = item.respostas.resposta3
  this.resposta4Editar = item.respostas.resposta4
  this.respostaCorretaEditar = item.respostaCorreta
  if(item.justificativas !== undefined){
  this.justificativaresposta1Editar = item.justificativas.justificativaresposta1 
  this.justificativaresposta2Editar = item.justificativas.justificativaresposta2 
  this.justificativaresposta3Editar = item.justificativas.justificativaresposta3 
  this.justificativaresposta4Editar = item.justificativas.justificativaresposta4 
}
  this.keyEditar = item.$key;
  
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return  `with: ${reason}`;
  }
}

  update(){
  
    if(this.justificativaresposta1Editar === undefined || this.justificativaresposta1Editar === "" ){
      this.justificativaresposta1Editar = null;
    }
    if(this.justificativaresposta2Editar === undefined || this.justificativaresposta2Editar === ""){
      this.justificativaresposta2Editar = null;
    }
    if(this.justificativaresposta3Editar === undefined || this.justificativaresposta3Editar === ""){
      this.justificativaresposta3Editar = null;
    }
    if(this.justificativaresposta4Editar === undefined || this.justificativaresposta4Editar === ""){
      this.justificativaresposta4Editar = null;
    }
  
   
    this.database.list('prova/' + this.valueYear + '/' + this.disciplina).update(this.keyEditar,{


      pergunta: this.perguntaEditar, 
      respostas: {        
        resposta1: this.resposta1Editar,
        resposta2: this.resposta2Editar,
        resposta3: this.resposta3Editar,
        resposta4: this.resposta4Editar
      },
      respostaCorreta: this.respostaCorretaEditar,
      justificativas:{
        justificativaresposta1: this.justificativaresposta1Editar,
        justificativaresposta2: this.justificativaresposta2Editar,
        justificativaresposta3: this.justificativaresposta3Editar,
        justificativaresposta4: this.justificativaresposta4Editar
      }, 
      ModificadaPor: this.fire.auth.currentUser.email
    });
  
  }

  delete(key:string){
    let validacao = confirm('Deseja realmente exluir esse item?')
    if(validacao === true){
    this.database.list('prova/' + this.valueYear + '/' + this.disciplina).remove(key)
    }
  }

// MUDAR DE PÁGINA

  next(number:number){
          if(this.pergunta !== undefined && this.currentTab === 0 && number !== -1 && this.pergunta !== "" ){
          this.currentTab = this.currentTab + number;
          
          }
          else if(this.resposta1 !== undefined && this.currentTab === 1 && this.resposta1 !== ""){
            this.currentTab = this.currentTab + number;
          }
          else if(this.resposta2 !== undefined && this.currentTab === 2 && this.resposta2 !== ""){
            this.currentTab = this.currentTab + number;
          }
          else if(this.resposta3 !== undefined && this.currentTab === 3 && this.resposta3 !== ""){
            this.currentTab = this.currentTab + number;
            
          }
          else if(this.resposta4 !== undefined && this.currentTab === 4 && this.resposta4 !== "" && this.respostaCorreta !== "" || this.respostaCorreta !== undefined){
            this.currentTab = this.currentTab + number;
            // INSERIR DADOS NO FIREBASE
            if(this.justificativaresposta1 === undefined || this.justificativaresposta1 === ""){
              this.justificativaresposta1 = null;
            }
            if(this.justificativaresposta2 === undefined || this.justificativaresposta2 === ""){
              this.justificativaresposta2 = null;
            }
            if(this.justificativaresposta3 === undefined || this.justificativaresposta3 === ""){
              this.justificativaresposta3 = null;
            }
            if(this.justificativaresposta4 === undefined || this.justificativaresposta4 === ""){
              this.justificativaresposta4 = null;
            }
            
            this.database.list('prova/' + this.valueYear + '/' + this.disciplina).push({
                  pergunta: this.pergunta, 
                  ano: this.valueYear,
                  criadaPor: this.fire.auth.currentUser.email,
                  ModificadaPor: this.fire.auth.currentUser.email,
                  respostaCorreta: this.respostaCorreta,
                  respostas: {
                            resposta1: "a)" + this.resposta1,
                            resposta2: "b)" +  this.resposta2,
                            resposta3: "c)" + this.resposta3,
                            resposta4: "d)" + this.resposta4
                          },
                   justificativas: {
                            justificativaresposta1: this.justificativaresposta1,
                            justificativaresposta2: this.justificativaresposta2,
                            justificativaresposta3: this.justificativaresposta3,
                            justificativaresposta4: this.justificativaresposta4
                          }
                 

              })
          }else if (number === -1 &&  this.currentTab > 0 ){
            this.currentTab = this.currentTab + number;
          }
   
  }
  // INSERIR NOVA PERGUNTA
  novaPergunta(){
    this.currentTab = 0;
    this.resposta1= undefined
    this.resposta2= undefined
    this.resposta3= undefined
    this.resposta4= undefined
    this.pergunta = undefined
    this.justificativaresposta1 = undefined
    this.justificativaresposta2 = undefined
    this.justificativaresposta3 = undefined
    this.justificativaresposta4 = undefined
    this.respostaCorreta = undefined
  }

  enviarPerguntaUpload(){
      let y = 0;
     let validacao;
        for(let x in this.result){

          if(this.result[x].Pergunta == null || this.result[x].Pergunta == undefined || this.result[x].Pergunta == "" ){
            
            this.validacao = 1;
          }else 
          if(
              (this.result[x].resposta1 == null || this.result[x].resposta1 == undefined || this.result[x].resposta1 == "") ||
              (this.result[x].resposta2 == null || this.result[x].resposta2 == undefined || this.result[x].resposta2 == "") ||
              (this.result[x].resposta3 == null || this.result[x].resposta3 == undefined || this.result[x].resposta3 == "") ||
              (this.result[x].resposta4 == null || this.result[x].resposta4 == undefined || this.result[x].resposta4 == "") 
            ){
              this.validacao = 1;
          }else
          if(this.result[x].respostaCorreta == null || this.result[x].respostaCorreta == undefined || this.result[x].respostaCorreta == "" ){
            this.validacao = 1;
          }else{
            if(y ==0){
             validacao = confirm('Deseja inserir o arquivo na base de dados?');
          }
            if(validacao === true){
              this.validacao = 2;
        this.database.list('prova/' + this.valueYear + '/' + this.disciplina).push({
          pergunta: this.result[x].Pergunta, 
          ano: this.valueYear,
          criadaPor: this.fire.auth.currentUser.email,
          ModificadaPor: this.fire.auth.currentUser.email,
          respostaCorreta: this.result[x].respostaCorreta,
          respostas: {
                    resposta1: "a)" + this.result[x].resposta1,
                    resposta2: "b)" +  this.result[x].resposta2,
                    resposta3: "c)" + this.result[x].resposta3,
                    resposta4: "d)" + this.result[x].resposta4
                  },
          justificativas: {
                    justificativaresposta1: this.result[x].justificativaresposta1 || null ,
                    justificativaresposta2: this.result[x].justificativaresposta2  || null ,
                    justificativaresposta3: this.result[x].justificativaresposta3   || null,
                    justificativaresposta4: this.result[x].justificativaresposta4   || null
                  }
        

      })
    }
    }
    y++;
  }
  
  }

  
}
