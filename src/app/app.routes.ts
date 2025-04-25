import { Routes } from '@angular/router';
import { DefaultLayoutComponent, EmailLayoutComponent } from './layout';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: ''
    },
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes),
        canActivate: [authGuard],
      },
      {
        path: 'clients',
        loadComponent: () => import('./views/clients/clients.component').then(m => m.ClientsComponent),
        canActivate: [authGuard],
        data: {
          title: 'Clients'
        }
      },
      {
        path: 'clientslogs',
        loadComponent: () => import('./views/clientslogs/clientslogs.component').then(m => m.ClientslogsComponent),
        canActivate: [authGuard],
        data: {
          title: 'Clients Logs'
        }
      },
      {
        path: 'failedtransactions',
        loadComponent: () => import('./views/failedtransactions/failedtransactions.component').then(m => m.FailedtransactionsComponent),
        canActivate: [authGuard],
        data: {
          title: 'Failed Transactions'
        }
      },
      {
        path: 'queryscreen',
        loadComponent: () => import('./views/queryscreen/queryscreen.component').then(m => m.QueryscreenComponent),
        canActivate: [authGuard],
        data: {
          title: 'Query Screen'
        }
      },
      {
        path: 'users',
        loadComponent: () => import('./views/users/users.component').then(m => m.UsersComponent),
        canActivate: [authGuard],
        data: {
          title: 'Users'
        }
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'smart-table',
        loadChildren: () => import('./views/smart-tables/routes').then((m) => m.routes)
      },
      {
        path: 'plugins',
        loadChildren: () => import('./views/plugins/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      },
      {
        path: 'apps',
        loadChildren: () => import('./views/apps/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: 'apps/email',
    component: EmailLayoutComponent,

    children: [
      {
        path: '',
        loadChildren: () => import('./views/apps/email/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
