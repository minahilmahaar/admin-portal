import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
        data: {
          title: 'Users'
        }
      },
      {
        path: 'userpage',
        loadComponent: () => import('./userpage/userpage.component').then(m => m.UserpageComponent),
        data: {
          title: 'User Page'
        }
      },
      {
        path: 'roles',
        loadComponent: () => import('./roles/roles.component').then(m => m.RolesComponent),
        data: {
          title: 'Roles'
        }
      }
    ]
  }
];
