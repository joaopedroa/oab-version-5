import { Component, OnInit,ViewChild } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ChartComponent } from '@progress/kendo-angular-charts';
import { saveAs } from '@progress/kendo-file-saver';
import { exportPDF } from '@progress/kendo-drawing/pdf';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  tipoCaderno:string = "simulado";
  itemYear:any = [];
  closeResult: string;
  year:string = this.itemYear[0];
  perguntas: Observable<any[]>;
  perguntasModal: Observable<any[]>;
  dataYear:any = new Date().getFullYear();
  yearTotalSelect:Array<any> = [];
  yearTotalSelectSort:Array<any> = [];
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
   //==modal==============
   nameDisciplinaModal:string;

  constructor(public database:AngularFireDatabase,private modalService: NgbModal) { 

 // FOR PARA DADOS DO SELECT YEAR
 for(let x=0;x<20;x++)
 {
   this.yearTotalSelect.push(this.dataYear);
   this.dataYear--;
 }
this.yearTotalSelectSort=this.yearTotalSelect.sort();
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

//PROVA LINE

this.graficoLegendLineProva.forEach(item =>{
  this.categoryLine = [];
  let aux = 0;
  let my_obj = Object.create({}, { getFoo: { value: function() { return this.nome, this.valor;  } } });  
  my_obj.nome = 'Prova';
  let validaValores:any = [];
  validaValores = this.yearTotalSelect.sort();
  let totalValores:any = [];

  for(let x = 0;x<item.length;x++){
    this.categoryLine.push(item[x].$key);
    
  }
  for(let y= 0 ; y< validaValores.length;y++){
    totalValores.push("0");
  }

  for(let x = 0;x<item.length;x++){
    aux = 0;   
    
      for(let y = 0;y<Object.values(Object.values(item[x])).length -1;y++){
        aux +=  Object.keys(Object.values(Object.values(item[x]))[y]).length;
  
      }   
     
      totalValores[validaValores.indexOf(Number(item[x].$key))] = aux;     

      my_obj.valor =  totalValores ;     
   
  }
  this.seriesLine.push(my_obj);
 
});


//SIMULADO LINE
this.graficoLegendLineSimulado.forEach(item =>{
  this.categoryLine = [];
  let aux = 0;
  let my_obj = Object.create({}, { getFoo: { value: function() { return this.nome, this.valor;  } } });  
  my_obj.nome = 'Simulado';
  let validaValores:any = [];
  validaValores = this.yearTotalSelect.sort();
  let totalValores:any = [];

  for(let x = 0;x<item.length;x++){
    this.categoryLine.push(item[x].$key);
    
  }
  for(let y= 0 ; y< validaValores.length;y++){
    totalValores.push("0");
  }

  for(let x = 0;x<item.length;x++){
    aux = 0;   

      for(let y = 0;y<Object.values(Object.values(item[x])).length -1;y++){
        aux +=  Object.keys(Object.values(Object.values(item[x]))[y]).length;
   
      }

      totalValores[validaValores.indexOf(Number(item[x].$key))] = aux;    
      my_obj.valor =  totalValores ;     
  
  }
  this.seriesLine.push(my_obj);
 
});
//console.log('se', this.seriesLine)

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
 clickChart(event,content){
  this.nameDisciplinaModal = event.series.name;
  this.open(content);
 
  this.perguntasModal = this.database.list(this.tipoCaderno + '/' + this.year + '/' + event.series.name).snapshotChanges().map(arr => {
    return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
  });

 }

 open(content) {

  this.modalService.open(content, { size: 'lg' }).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
 
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
 
  


  ngOnInit() {
    
   

 
 
    
  }

}
