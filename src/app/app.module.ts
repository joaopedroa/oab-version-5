import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {routing} from './app.routing';
import { AppComponent } from './app.component';
import { TopoComponent } from './topo/topo.component';
import { SimuladoComponent } from './simulado/simulado.component';
import { ProvaComponent } from './prova/prova.component';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import {AngularFireAuthModule} from 'angularfire2/auth';
import { AuthGuardService } from './guards/auth-guard.service';
import { XlsxToJsonServiceService } from './guards/xlsx-to-json-service.service';

import { HttpModule } from '@angular/http';
const firebaseAuth  = {
  apiKey: "AIzaSyBQsMou8CwzNNRvpz6Xd8zti9dCl6spVLQ",
  authDomain: "trabmontanha-afa5c.firebaseapp.com",
  databaseURL: "https://trabmontanha-afa5c.firebaseio.com",
  projectId: "trabmontanha-afa5c",
  storageBucket: "trabmontanha-afa5c.appspot.com",
  messagingSenderId: "922779715590"

};

@NgModule({
  declarations: [
    AppComponent,
    TopoComponent,
    SimuladoComponent,
    ProvaComponent,
    LoginComponent,
    RegistroComponent
 
   
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    AngularFireModule.initializeApp(firebaseAuth),
    AngularFireDatabaseModule,
    NgbModule.forRoot(),
    AngularFireAuthModule,
    HttpModule
    
    
  ],
  providers: [AuthGuardService,XlsxToJsonServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
