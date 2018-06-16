import { Component, OnInit ,ViewChild} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireAuth} from 'angularfire2/auth';
import { XlsxToJsonServiceService } from '../guards/xlsx-to-json-service.service';
import swal from 'sweetalert2';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-simulado',
  templateUrl: './simulado.component.html',
  styleUrls: ['./simulado.component.css']
})
export class SimuladoComponent implements OnInit {


  public results:any ;
  public result:any ;
  private xlsxToJsonService: XlsxToJsonServiceService = new XlsxToJsonServiceService();
  validacao:number = 0;
  validacaoSwal:boolean;
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
  perguntas :Observable<any[]>;
  todasPerguntas : Observable<any[]>;
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
  user:string;
  numeroQuestao:number;
  chaveAno:string;
  aux:Observable<any[]>;
  validaDisciplina:any = [];
  valueChanges:Observable<any[]>
  @ViewChild('valuePath') valuePath; 
   
  constructor(public database:AngularFireDatabase,private modalService: NgbModal, public fire:AngularFireAuth) {
   
   
    this.user = this.fire.auth.currentUser.email;
    this.disciplinas = ['Ética','Filosofia','Constitucional','Direito Humanos','Internacional','Tributário','Administrativo','Ambiental','Civil','ECA','CDC','Empresarial','Processo Civil','Penal','Processo Penal','Direito do Trabalho','Processo do Trabalho']
    this.disciplina = this.disciplinas[0];
    // LISTA AS PERGUNTAS DO FIREBASE
   /* LISTA DE PERGUNTAS
    this.perguntas = this.database.list('simulados/').snapshotChanges().map(arr => {
      let disc =  arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) ).filter(i => i.ano == this.valueYear).map(i => i.questions[this.disciplina]);      
      let discCompleto = [];
      disc[0].forEach(function(element, index, array){
        let eachValue = element;
        eachValue['key'] = index;
        discCompleto.push(eachValue);
        //console.log(element);
      })
      //console.log(disc[0]);
      
      return discCompleto;
    });
  */
 
  this.aux = this.database.list('simulados/').snapshotChanges().map(arr => {
    return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) ).filter(i => i.ano == this.valueYear)
  });
  this.aux.take(1).forEach(item => {
   // console.log('item', item);
    //this.chaveAno = item[0].$key;
    this.getChaveAno(item[0])
    if(item.length > 0){
    this.getChaveAno(item[0]).then((chaveAno) => {
      
        this.perguntas = this.database.list(`simulados/${chaveAno}/questions/${this.disciplina}`).snapshotChanges().map(arr => {
          return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
        });
        this.valueChanges = this.database.list(`simulados/${chaveAno}/questions/${this.disciplina}`).valueChanges();
        this.valueChanges.forEach(e=>{
         
          this.validaDisciplina = e
         // console.log('array', this.validaDisciplina);
        });
       

    
    });
  }else{
    this.perguntas = this.database.list(`simulados/8000/questions/${this.disciplina}`).snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    });
    this.valueChanges = this.database.list(`simulados/8000/questions/${this.disciplina}`).valueChanges();
    this.valueChanges.forEach(e=>{
     
      this.validaDisciplina = e
     // console.log('array', this.validaDisciplina);
    });
    
  }
    
  
  });
  //lista perguntas
  //

    // FOR PARA DADOS DO SELECT YEAR
    for(let x=0;x<20;x++)
    {
      this.year.push(this.dataYear);
      this.dataYear--;
    }

    
}

getChaveAno(chave){
  return new Promise(resolve => {
    console.log('chave',chave);
    if(chave != undefined || chave != null){
    this.chaveAno = chave.$key;
    
    }else{
      this.chaveAno = null;
    }
    resolve(this.chaveAno);
  })
 
}

setDisciplina(item){
  return new Promise(resolve => {
    this.validaDisciplina.push(item);

    resolve(this.validaDisciplina);
  })
 
}



ngOnInit() {



  
}

handleFile(event) {

  let file = event.target.files[0];
  this.xlsxToJsonService.processFileToJson({}, file).subscribe(data => {
    this.results = JSON.stringify(data['sheets']['Planilha1']);
    this.result = JSON.parse(this.results);
  })


}
selectAno(){
  /*
  this.perguntas = this.database.list('simulado/' + this.valueYear + '/' + this.disciplina).snapshotChanges().map(arr => {
    return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
  });
  */

  this.aux = this.database.list('simulados/').snapshotChanges().map(arr => {
    return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) ).filter(i => i.ano == this.valueYear)
  });
  this.aux.take(1).forEach(item => {
    console.log('item', item);
    //this.chaveAno = item[0].$key;
    this.getChaveAno(item[0]);
    if(item.length > 0){
    this.getChaveAno(item[0]).then((chaveAno) => {
     
        this.perguntas = this.database.list(`simulados/${chaveAno}/questions/${this.disciplina}`).snapshotChanges().map(arr => {
          return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
        });
        this.valueChanges = this.database.list(`simulados/${chaveAno}/questions/${this.disciplina}`).valueChanges();
        this.valueChanges.forEach(e=>{
         
          this.validaDisciplina = e
         // console.log('array', this.validaDisciplina);
        });

    });
  }else{
    this.perguntas = this.database.list(`simulados/8000/questions/${this.disciplina}`).snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    });
    this.valueChanges = this.database.list(`simulados/'8000'/questions/${this.disciplina}`).valueChanges();
    this.valueChanges.forEach(e=>{
     
      this.validaDisciplina = e
     // console.log('array', this.validaDisciplina);
     console.log(this.validaDisciplina);
    });
    
  }
  });



}
open(content, item) {

  this.modalService.open(content, { size: 'lg' }).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
  console.log("item:", item);
  this.respostaCorretaBackground = item.resposta_correta;
  this.perguntaEditar = item.pergunta;
  this.resposta1Editar = item.respostas.a.descricao
  this.resposta2Editar = item.respostas.b.descricao
  this.resposta3Editar = item.respostas.c.descricao
  this.resposta4Editar = item.respostas.d.descricao
  this.respostaCorretaEditar = item.resposta_correta
  
  this.justificativaresposta1Editar = item.respostas.a.justificativa 
  this.justificativaresposta2Editar = item.respostas.b.justificativa 
  this.justificativaresposta3Editar = item.respostas.c.justificativa 
  this.justificativaresposta4Editar = item.respostas.d.justificativa 

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

    var updates = {};
    updates[`pergunta`] = this.perguntaEditar;
    updates[`resposta_correta`] = this.respostaCorretaEditar;
    updates[`respostas`] = {
      'a': {
        'descricao': this.resposta1Editar,
        'justificativa': this.justificativaresposta1Editar
      },
      'b': {
        'descricao': this.resposta2Editar,
        'justificativa': this.justificativaresposta2Editar
      },
      'c': {
        'descricao': this.resposta3Editar,
        'justificativa': this.justificativaresposta3Editar
      },
      'd': {
        'descricao': this.resposta4Editar,
        'justificativa': this.justificativaresposta4Editar
      }
    };

    this.database
      .list(`simulados/${this.chaveAno}/questions/${this.disciplina}`)
      .update(this.keyEditar, updates).then(() => {
        swal(
          'Atualizado!',
          'A pergunta foi atualizada com sucesso!.',
          'success'
        );
      })
    

  
  }

  delete(key:string){
   console.log(key);
   let chaveAno =  this.database.list('simulados/',ref => ref.orderByChild('ano').equalTo(this.valueYear)).snapshotChanges().map(arr => {
    return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
  }).take(1).forEach(item => {
    item
  });
    swal({
      title: 'Tem certeza que deseja excluir essa pergunta?',
      text: "Você não poderá reverter isso!!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'gray',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Sim, excluir!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {  
          this.database.list(`simulados/${this.chaveAno}/questions/${this.disciplina}`).remove(key);
        swal(
          'Excluído!',
          'A pergunta foi deletada com sucesso!.',
          'success'
        )
      }
    })
  }

// MUDAR DE PÁGINA
  
next(number:number){
  if(this.pergunta !== undefined && this.currentTab === 0 && number !== -1 && this.pergunta !== "" ){
  this.currentTab = this.currentTab + number;
  
  }
  else if(this.resposta1 !== undefined && this.currentTab === 1 && this.resposta1 !== "" &&  this.justificativaresposta1 !== undefined  && this.justificativaresposta1 !== "" && this.justificativaresposta1 !== null){
    this.currentTab = this.currentTab + number;
  }
  else if(this.resposta2 !== undefined && this.currentTab === 2 && this.resposta2 !== "" &&  this.justificativaresposta2 !== undefined  && this.justificativaresposta2 !== "" && this.justificativaresposta2 !== null){
    this.currentTab = this.currentTab + number;
  }
  else if(this.resposta3 !== undefined && this.currentTab === 3 && this.resposta3 !== "" &&  this.justificativaresposta3 !== undefined  && this.justificativaresposta3 !== "" && this.justificativaresposta3 !== null){
    this.currentTab = this.currentTab + number;
    
  }
  else if(this.resposta4 !== undefined && this.currentTab === 4 && this.resposta4 !== ""  &&  this.justificativaresposta4 !== undefined  && this.justificativaresposta4 !== "" && this.justificativaresposta4 !== null){
    this.currentTab = this.currentTab + number;
  }
  else if(this.respostaCorreta !== undefined && this.respostaCorreta !== null && this.respostaCorreta !== "" && this.currentTab === 5){
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
    
    /*
    let dados = "{" +
      "'ano':" + this.valueYear + ',' +
      "'questions':{" +
        "'"+this.disciplina + "'" + ":{" +
        "'"+this.numeroQuestao+"'" + ":{" +
            "'pergunta':" +this.pergunta + "," + 
            "'resposta_correta':" + this.respostaCorreta + "," +
            "'respostas': {" + 
              "'a': {" + 
                "'descricao':" + this.resposta1 + ',' +
                "'justificativa':" +  this.justificativaresposta1 + 
              "} ," +
              "'b':" +  "{"+
                "'descricao':" + this.resposta2 + ',' + 
                "'justificativa':" +  this.justificativaresposta2 + 
              "} ," +
              "'c':" + "{" +
                "'descricao':" + this.resposta3 + ',' +
                "'justificativa':" + this.justificativaresposta3 + 
              "} ," +
              "'d':{" + 
                "'descricao':" + this.resposta4 + ',' +
                "'justificativa':" +  this.justificativaresposta4  +
              "} "+
            "}" +
          "}"+
        "}"+
      "}"+
    "}";
    */

    let dados = {  
      "ano": this.valueYear,
      "questions":{  
         [`${this.disciplina}`]:[{  
            
               "pergunta":this.pergunta,
               "resposta_correta":this.respostaCorreta,
               "respostas":{  
                  "a":{  
                     "descricao":this.resposta1,
                     "justificativa":this.justificativaresposta1
                  },
                  "b":{  
                     "descricao":this.resposta2,
                     "justificativa":this.justificativaresposta2
                  },
                  "c":{  
                     "descricao":this.resposta3,
                     "justificativa":this.justificativaresposta3
                  },
                  "d":{  
                     "descricao":this.resposta4,
                     "justificativa":this.justificativaresposta4
                  }
               }
            
         }]
      }
   }
/*
   let ano = this.database.list('simulados/').snapshotChanges().map(arr => {
    return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
  }).take(1).forEach(v => {
    v.filter(i => i.ano == this.valueYear);
    if(v[0].ano == this.valueYear){
      this.database.list('simulados/' + this.valueYear + '/question/' + this.disciplina).snapshotChanges().map(arr => {
        return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
      }).take(1).forEach(v => {
        if(v.length === null || v.length === undefined){
         this.numeroQuestao = 1;
         this.database.object('simulados/' + this.valueYear + '/question/' + this.disciplina +'/'+ this.numeroQuestao).set(
           dados
         )
       }else{
         this.numeroQuestao = v.length + 1;
         this.database.object('simulados/' + this.valueYear + '/question/' + this.disciplina +'/'+ this.numeroQuestao).set(
           dados
         )
       }
   
       })
    }
  });
antes
  let chaveAno =  this.database.list('simulados/').snapshotChanges().map(arr => {
    return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) ).filter(i => i.ano == this.valueYear)
  }).take(1).forEach(item =>{
    let questions = []; 
    if(item.length > 0){
      if(item[0].questions.hasOwnProperty(this.disciplina)){
        questions = item[0].questions[this.disciplina];
      }
      let all = questions.length;
      questions[all] = this.retornaJSON();  
      this.database.object('simulados/'+item[0].$key + '/questions/' + this.disciplina).set(questions);
    } else {
      let novo = {
        ano: this.valueYear,
        questions: {
          [`${this.disciplina}`]: [
            this.retornaJSON()
          ]
        }
      }
      this.database.list('simulados/').push(novo);
    }
  });
  */


  if(this.chaveAno == undefined || this.chaveAno == null){
    this.database.list('simulados/').push(
      dados
    )
  }
  else {
    
   if(this.validaDisciplina.length>0){
 
    //this.validaDisciplina.push(teste);

   // this.database.object('simulados/' + this.chaveAno + '/questions/' + this.disciplina).set(
     
    //  this.validaDisciplina
   // )
   this.setDisciplina(this.retornaJSONValida()).then(resolve =>{
     console.log(this.validaDisciplina);
   
     this.database.object('simulados/' + this.chaveAno + '/questions/' + this.disciplina).set(
      
      this.validaDisciplina
     )
     
   })
   
    
  }else{
    this.database.object('simulados/' + this.chaveAno + '/questions/' + this.disciplina).set(
      
      this.retornaJSON()
     )
  }
  }
  
/*
   let pergunta;
   pergunta = this.database.list('simulados/').snapshotChanges().map(arr => {
     return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
   }).take(1).forEach(v => {
     if(v.length === null || v.length === undefined){
      this.numeroQuestao = 1;
      this.database.list('simulados/').push(
        
        this.retornaJSON(this.numeroQuestao)
      );
      console.log(dados);
    }else{
      this.numeroQuestao = v.length + 1;
      this.database.list('simulados/' ).push(
        this.retornaJSON(this.numeroQuestao)
      );
      console.log(dados);
    }
    });
   */
  this.selectAno();
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
    this.selectAno();
  }

  retornaJSON(){
    let dados = [{  
               "pergunta":this.pergunta,
               "resposta_correta":this.respostaCorreta,
               "respostas":{  
                  "a":{  
                     "descricao":this.resposta1,
                     "justificativa":this.justificativaresposta1
                  },
                  "b":{  
                     "descricao":this.resposta2,
                     "justificativa":this.justificativaresposta2
                  },
                  "c":{  
                     "descricao":this.resposta3,
                     "justificativa":this.justificativaresposta3
                  },
                  "d":{  
                     "descricao":this.resposta4,
                     "justificativa":this.justificativaresposta4
                  }
               }
    }]
   return dados;
  }
  retornaJSONValida(){
    let dados = {  
               "pergunta":this.pergunta,
               "resposta_correta":this.respostaCorreta,
               "respostas":{  
                  "a":{  
                     "descricao":this.resposta1,
                     "justificativa":this.justificativaresposta1
                  },
                  "b":{  
                     "descricao":this.resposta2,
                     "justificativa":this.justificativaresposta2
                  },
                  "c":{  
                     "descricao":this.resposta3,
                     "justificativa":this.justificativaresposta3
                  },
                  "d":{  
                     "descricao":this.resposta4,
                     "justificativa":this.justificativaresposta4
                  }
               }
    }
   return dados;
  }

  retornaJSONExecel(x){
    let dados = {  
      "pergunta":this.result[x].Pergunta,
      "resposta_correta": this.result[x].respostaCorreta,
      "respostas":{  
         "a":{  
            "descricao":this.result[x].resposta1,
            "justificativa":this.result[x].justificativaresposta1 || null
         },
         "b":{  
            "descricao":this.result[x].resposta2,
            "justificativa":this.result[x].justificativaresposta2 || null
         },
         "c":{  
            "descricao":this.result[x].resposta3,
            "justificativa":this.result[x].justificativaresposta3 || null
         },
         "d":{  
            "descricao":this.result[x].resposta4,
            "justificativa":this.result[x].justificativaresposta4 || null
         }
      }
    }
   return dados;
  }
  enviarPerguntaUpload(){
    
     
        for(let x in this.result){
          
       

         
            let dados1 = {  
                       "pergunta":this.result[x].Pergunta,
                       "resposta_correta": this.result[x].respostaCorreta,
                       "respostas":{  
                          "a":{  
                             "descricao":this.result[x].resposta1,
                             "justificativa":this.result[x].justificativaresposta1 || null
                          },
                          "b":{  
                             "descricao":this.result[x].resposta2,
                             "justificativa":this.result[x].justificativaresposta2 || null
                          },
                          "c":{  
                             "descricao":this.result[x].resposta3,
                             "justificativa":this.result[x].justificativaresposta3 || null
                          },
                          "d":{  
                             "descricao":this.result[x].resposta4,
                             "justificativa":this.result[x].justificativaresposta4 || null
                          }
                       }
                    }
           
          
        
         
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
          }else 
          if(
              (this.result[x].justificativaresposta1 == null || this.result[x].justificativaresposta1 == undefined || this.result[x].justificativaresposta1 == "") ||
              (this.result[x].justificativaresposta2 == null || this.result[x].justificativaresposta2 == undefined || this.result[x].justificativaresposta2 == "") ||
              (this.result[x].justificativaresposta3 == null || this.result[x].justificativaresposta3 == undefined || this.result[x].justificativaresposta3 == "") ||
              (this.result[x].justificativaresposta4 == null || this.result[x].justificativaresposta4 == undefined || this.result[x].justificativaresposta4 == "") 
            ){
              this.validacao = 1;
          }
          else{
            
              this.validacao = 2;

              let dados = {  
                "ano": this.valueYear,
                "questions":{  
                   [`${this.disciplina}`]:[
                     {  
                      
                    "pergunta":this.result[x].Pergunta,
                    "resposta_correta": this.result[x].respostaCorreta,
                    "respostas":{  
                       "a":{  
                          "descricao":this.result[x].resposta1,
                          "justificativa":this.result[x].justificativaresposta1 || null
                       },
                       "b":{  
                          "descricao":this.result[x].resposta2,
                          "justificativa":this.result[x].justificativaresposta2 || null
                       },
                       "c":{  
                          "descricao":this.result[x].resposta3,
                          "justificativa":this.result[x].justificativaresposta3 || null
                       },
                       "d":{  
                          "descricao":this.result[x].resposta4,
                          "justificativa":this.result[x].justificativaresposta4 || null
                       }
                    }
                      
                   }]
                }
             }

           
  
  if(this.chaveAno == undefined || this.chaveAno == null){
   
   this.getKey(dados);
  
  }
  
  else {
    this.updateValidaDisiciplina();   
    console.log(this.validaDisciplina);
   if(this.validaDisciplina.length>0){
 
    //this.validaDisciplina.push(teste);

   // this.database.object('simulados/' + this.chaveAno + '/questions/' + this.disciplina).set(
     
    //  this.validaDisciplina
   // )
   this.setDisciplina(this.retornaJSONExecel(x)).then(resolve =>{
     console.log(this.validaDisciplina);
     
     this.database.object('simulados/' + this.chaveAno + '/questions/' + this.disciplina).set(
      
      this.validaDisciplina
     )
     
   })
   
    
  }else{
    this.validaDisciplina.push(this.retornaJSONExecel(x));
    this.database.object('simulados/' + this.chaveAno + '/questions/' + this.disciplina).set(
      
      this.validaDisciplina
     )
  }

  }
  
          /*
        this.database.list('simulados/' + this.chaveAno).push({
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
      */
     /*
     let chaveAno =  this.database.list('simulados/').snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) ).filter(i => i.ano == this.valueYear)
    }).take(this.result.length).forEach(item =>{
      let questions = []; 
      if(item.length > 0){
        if(item[0].questions.hasOwnProperty(this.disciplina)){
          questions = item[0].questions[this.disciplina];
        }
        let all = questions.length;
        questions[all] = dados;  
        this.database.object('simulados/'+item[0].$key + '/questions/' + this.disciplina).set(questions);
      } else if(x == '0') {
        let novo = {
          ano: this.valueYear,
          questions: {
            [`${this.disciplina}`]: [
             dados
            ]
          }
        }
        this.database.list('simulados/').push(novo);
      }
      console.log('i', item)
    });
    */

  }}}

  getKey(dados){
    return new Promise(resolve => {
      let retorno = this.database.list('simulados/').push(
            dados
          ).key;
      this.chaveAno = retorno;
      resolve(this.chaveAno);
    });
  }

  updateValidaDisiciplina(){
    return new Promise(resolve => {
      
      this.valueChanges = this.database.list(`simulados/${this.chaveAno}/questions/${this.disciplina}`).valueChanges();
      this.valueChanges.forEach(e=>{
       
        this.validaDisciplina = e
        console.log('array', this.validaDisciplina);
      });


      resolve(this.validaDisciplina);
    });
  }

}