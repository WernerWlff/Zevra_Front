import { Routes } from '@angular/router';
import { FrontPage } from './components/front-page/front-page';
import { Register } from './components/register/register';

export const routes: Routes = [
    {path: '', component: FrontPage},
    {path: 'register', component: Register},
];
