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
  graficoLegend: Observable<any[]>;
  graficoData: Observable<any[]>;
  dadosLegenda:Array<any> = [];
  dadosSeries:Array<any> = [];
  series = {};
  cart = [];
/*
    years:Array<Number> = [2012,2013,2014,2015];
    students = [
      {
        name: "João",
        results: [90,70,55,40]
      },
      {
        name: "Pedro",
        results: [100,70,55,14]
      },
      {
        name: "Fabricio",
        results: [50,70,55,4]
      },
      {
        name: "Eduardo",
        results: [30,70,55,32]
      },
      {
        name: "Marcos",
        results: [10,7,5,44]
      }
    ]
    */
    
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
  this.dadosLegenda = [];
  this.dadosSeries = [];

  //================LEGENDAS=============
this.graficoLegend = this.database.list(this.tipoCaderno + '/',ref => ref.orderByKey().equalTo(this.year)).snapshotChanges().map(arr => {
  return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
});
this.graficoLegend.forEach(item => { 

  for(let x in item[0]){   
//    console.log(x);
    if(x !== '$key'){
    this.dadosLegenda.push(x);
   
   this.dadosSeries.push(Object.keys((item[0][x])).length);
  
  
  //  this.getSeries(x);
   
    }
    
}
});

console.log(this.dadosLegenda);
console.log(this.dadosSeries);

console.log(this.cart);
}


getSeries(x,y){
  for(let x =0 ;x <4 ;x++){
   this.series["nome"] = x;
   this.series["valor"] = y;
   this.cart.push(this.series);
  }

}

 changeTipoCaderno(){
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
