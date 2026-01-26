import { Routes } from '@angular/router';
import { FrontPage } from './components/front-page/front-page';
import { Login } from './components/login/login';

export const routes: Routes = [
    {path: '', component: FrontPage},
    {path: 'login', component: Login},
];
