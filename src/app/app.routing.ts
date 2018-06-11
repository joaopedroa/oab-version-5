import {Routes, RouterModule} from '@angular/router';
import { SimuladoComponent } from './simulado/simulado.component';
import { ProvaComponent } from './prova/prova.component';
import { ModuleWithProviders } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { GraphComponent } from './graph/graph.component';

// canActivate:[AuthGuardService]



const APP_ROUTES: Routes = [
    {path: '', component: LoginComponent},
    {path: 'cadastro', component: RegistroComponent},
    {path: 'prova', component: ProvaComponent,canActivate:[AuthGuardService]},
    {path: 'simulado', component: SimuladoComponent,canActivate:[AuthGuardService]},
    {path: 'dashboard', component: GraphComponent,canActivate:[AuthGuardService]}

];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);