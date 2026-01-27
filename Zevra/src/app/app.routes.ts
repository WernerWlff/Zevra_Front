import { Routes } from '@angular/router';
import { FrontPage } from './components/front-page/front-page';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { ExercicesPage } from './components/exercice-page/exercice-page';
import { FavoritePage } from './components/favorite-page/favorite-page';

export const routes: Routes = [
    {path: '', component: FrontPage},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'exercices', component: ExercicesPage},
    {path: 'favorites', component: FavoritePage},
];
