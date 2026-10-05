import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IconDirective, IconSetService } from '@coreui/icons-angular';

import {
  BadgeComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  SpinnerComponent
} from '@coreui/angular-pro';

import { ChartjsComponent } from '@coreui/angular-chartjs';

import { DashboardService } from './dashboard.service';


interface DashboardSummary {
  TotalClients: number;
  LiveClients: number;
  OfflineClients: number;
  NotRespondingClients: number;
  StaleOnlineFlags: number;
  ActiveClients: number;
  InActiveClients: number;
  DisconnectedClients: number;
  UnknownLiveConnections: number;
  IsPingPerformed: boolean;
}


interface ClientConnection {
  Id: number;
  User_Id: number;
  ClientName: string;
  EmailAddress: string;
  User_DisplayName: string;

  IsLive: boolean;
  Status: string;

  IsOnline_DB: boolean;
  IsStaleOnlineFlag: boolean;
  IsActive: boolean;
  IsDisconnected: boolean;
  IsResponding: boolean;

  IsSync: boolean;
  CreatedOnUTC: string;
  UpdatedOnUTC: string;
}


@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,

  imports: [
    CommonModule,

    CardComponent,
    CardBodyComponent,

    RowComponent,
    ColComponent,

    ButtonDirective,

    BadgeComponent,

    ProgressComponent,
    ProgressBarDirective,

    SpinnerComponent,

    ChartjsComponent,

    IconDirective
  ]
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary = {

    TotalClients: 0,
    LiveClients: 0,
    OfflineClients: 0,
    NotRespondingClients: 0,
    StaleOnlineFlags: 0,
    ActiveClients: 0,
    InActiveClients: 0,
    DisconnectedClients: 0,
    UnknownLiveConnections: 0,
    IsPingPerformed: false

  };


  clients: ClientConnection[] = [];
  isLoading = false;
  errorMessage = '';
  lastUpdated = '';
  connectionChartData: any = {

    labels: [
      'Live',
      'Offline'
    ],

    datasets: [
      {
        data: [
          0,
          0
        ],

        backgroundColor: [
          '#4f46e5',
          '#e2e8f0'
        ],

        borderWidth: 0
      }
    ]

  };

  // ACCOUNT DOUGHNUT CHART
  accountChartData: any = {

    labels: [
      'Active',
      'Inactive'
    ],

    datasets: [
      {
        data: [
          0,
          0
        ],

        backgroundColor: [
          '#0f9d8a',
          '#f0b429'
        ],

        borderWidth: 0
      }
    ]

  };

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {

      legend: {
        display: false
      }

    },

    cutout: '72%'

  };

 constructor(
  private dashboardService: DashboardService,
  private iconSet: IconSetService
) {}


  ngOnInit(): void {

    this.loadDashboard();

  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.dashboardService
      .getClientsConnectionReport()
      .subscribe({
        next: (response: any) => {
          console.log(
            'Dashboard API Response:',
            response
          );
          if (response?.APIStatus?.IsSuccess) {
            this.summary =
              response.Summary ||
              this.summary;
            this.clients =
              response.Data ||
              [];
            this.updateCharts();
            this.lastUpdated =
              new Date().toLocaleString();
          }
          else {
            this.errorMessage =
              response?.APIStatus?.Message ||
              'Unable to load dashboard data.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error(
            'Dashboard API Error:',
            error
          );
          this.errorMessage =
            'Unable to load dashboard data. Please try again.';
          this.isLoading = false;
        }
      });
  }
  

   refreshDashboard(): void {
    this.loadDashboard();
  }


  updateCharts(): void {
    this.connectionChartData = {

      labels: [
        'Live',
        'Offline'
      ],

      datasets: [
        {
          data: [

            this.summary.LiveClients,

            this.summary.OfflineClients

          ],

          backgroundColor: [

            '#4f46e5',

            '#e2e8f0'

          ],

          borderWidth: 0

        }
      ]

    };

    // ACCOUNT CHART
   
    this.accountChartData = {

      labels: [
        'Active',
        'Inactive'
      ],

      datasets: [
        {
          data: [

            this.summary.ActiveClients,

            this.summary.InActiveClients

          ],

          backgroundColor: [

            '#0f9d8a',

            '#f0b429'

          ],

          borderWidth: 0

        }
      ]

    };

  }
  get livePercentage(): number {

    if (!this.summary.TotalClients) {
      return 0;
    }
    return Math.round(
      (
        this.summary.LiveClients /
        this.summary.TotalClients
      ) * 100
    );
  }
  get activePercentage(): number {
    if (!this.summary.TotalClients) {
      return 0;
    }
    return Math.round(
      (
        this.summary.ActiveClients /
        this.summary.TotalClients
      ) * 100
    );
  }
  get offlinePercentage(): number {
    if (!this.summary.TotalClients) {
      return 0;
    }
    return Math.round(
      (
        this.summary.OfflineClients /
        this.summary.TotalClients
      ) * 100
    );
  }
  get stalePercentage(): number {

    if (!this.summary.TotalClients) {
      return 0;
    }
    return Math.min(
      Math.round(

        (
          this.summary.StaleOnlineFlags /
          this.summary.TotalClients
        ) * 100
      ),
      100
    );
  }

  getStatusColor(status: string): string {
    if (status === 'Live') {
      return 'success';

    }
    if (status === 'Offline') {
      return 'secondary';
    }
    return 'warning';
  }


  getSyncColor(
    client: ClientConnection
  ): string {

    return client.IsSync

      ? 'success'

      : 'warning';

  }
  getSyncText(
    client: ClientConnection
  ): string {

    return client.IsSync

      ? 'Synced'

      : 'Pending';

  }
  formatDate(
    date: string
  ): string {
    if (!date) {
      return '-';
    }
    return new Date(date)
      .toLocaleString();
  }
}