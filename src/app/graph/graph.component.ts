import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  tipoCaderno:string = "simulado";
  itemYear:any = [];
  year:string = this.itemYear[0];
  perguntas: Observable<any[]>;
  //======chart bar======
  graficoLegend: Observable<any[]>;
  graficoData: Observable<any[]>;
  dadosLegenda:Array<any> = [];
  dadosSeries:Array<any> = [];
  series = [];
  showChart:boolean = false;
  //======================
  //======chart line======
  graficoLegendLineSimulado: Observable<any[]>;
  graficoLegendLineProva: Observable<any[]>;
  seriesLine = [];
  categoryLine = [];
  categoryLine2 = [];



   //================
   
    
  constructor(public database:AngularFireDatabase,private modalService: NgbModal) { 

 // =============SELECT===================

   this.perguntas = this.database.list(this.tipoCaderno).snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    }); 

this.perguntas.forEach(item => { 
  
  for(let x in item){        
    this.itemYear.push(item[x].$key);        
    }   
    this.year = item[0].$key;
});



}

consultar(){
  ///===========BARRA===========
  this.showChart = true;
  this.dadosLegenda = [];
  this.dadosSeries = [];
  this.series = [];
  this.seriesLine = [];
  this.categoryLine = [];
 
this.graficoLegend = this.database.list(this.tipoCaderno + '/',ref => ref.orderByKey().equalTo(this.year)).snapshotChanges().map(arr => {
  return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
});
this.graficoLegend.forEach(item => { 

  let aux = Object.keys(item[0]).length - 1;
  
  for(let x=0;x<aux;x++) {
   
        if( Object.keys(item[0])[x] !== '$key'){
          this.dadosLegenda.push(Object.keys(item[0])[x]);
          let my_obj = Object.create({}, { getFoo: { value: function() { return this.nome, this.valor;  } } });        
          my_obj.nome = Object.keys(item[0])[x];
         
          my_obj.valor =JSON.parse("[" +  Object.keys(Object.values(item[0] )[x]).length + "]");
          this.series.push(my_obj);
    }

    
}
});
///===========LINE===========

this.graficoLegendLineSimulado = this.database.list('simulado/').snapshotChanges().map(arr => {
  return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
});
this.graficoLegendLineProva = this.database.list('prova/').snapshotChanges().map(arr => {
  return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
});

this.graficoLegendLineSimulado.forEach(item =>{
 // console.log(item);
  let aux = 0;
  for(let x = 0;x<item.length;x++){
    aux = 0;
    let my_obj = Object.create({}, { getFoo: { value: function() { return this.nome, this.valor;  } } });  
   // console.log( 'ano', Object.values(Object.values(item[x])));
   // my_obj.nome = item[x].$key;
   my_obj.nome = 'Simulado';
    this.categoryLine.push(item[x].$key);
      for(let y = 0;y<Object.values(Object.values(item[x])).length -1;y++){
        aux +=  Object.keys(Object.values(Object.values(item[x]))[y]).length;
     //   console.log('valor',Object.keys(Object.values(Object.values(item[x]))[y]).length);
      }
      my_obj.valor = JSON.parse("[" + aux  + "]");     
   this.seriesLine.push(my_obj);
  }
});
//console.log('series',this.seriesLine);

this.graficoLegendLineProva.forEach(item =>{
  console.log(item);
  let aux = 0;
  for(let x = 0;x<item.length;x++){
    aux = 0;
    let my_obj = Object.create({}, { getFoo: { value: function() { return this.nome, this.valor;  } } });  
    console.log( 'ano', Object.values(Object.values(item[x])));
    //my_obj.nome = item[x].$key;
    my_obj.nome = 'Prova';
    this.categoryLine.push(item[x].$key);
      for(let y = 0;y<Object.values(Object.values(item[x])).length -1;y++){
        aux +=  Object.keys(Object.values(Object.values(item[x]))[y]).length;
        console.log('valor',Object.keys(Object.values(Object.values(item[x]))[y]).length);
      }
      my_obj.valor = JSON.parse("[" + aux  + "]");     
   this.seriesLine.push(my_obj);
  }
});
console.log('series',this.seriesLine);

}

onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

changeYear(){
  this.showChart = false;
}

 changeTipoCaderno(){
   this.showChart = false;
 // =============PERGUNTAS===================
 this.perguntas = this.database.list(this.tipoCaderno).snapshotChanges().map(arr => {
  return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
});


this.itemYear = [];
// select item
this.perguntas.forEach(item => { 
     
  for(let x in item){        
    this.itemYear.push(item[x].$key);        
    }   
    this.year = item[0].$key;
});
//=======================================


 }

  ngOnInit() {
    
   

 
 
    
  }

}
