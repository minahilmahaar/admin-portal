import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import {
  CardModule,
  GridModule,
  FormModule,
  ButtonModule,
  ButtonDirective,
  SpinnerModule,
  ToastModule,
  AlertModule,
  LoadingButtonModule,
  SharedModule,
  UtilitiesModule,
} from '@coreui/angular-pro';
import { ClientslogsService } from './clientslogs.service';
import { ClientsService } from '../clients/clients.service';

type LogType = '' | 'api' | 'service';

@Component({
  selector: 'app-clientslogs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    IconDirective,
    CardModule,
    GridModule,
    FormModule,
    ButtonModule,
    ButtonDirective,
    SpinnerModule,
    ToastModule,
    AlertModule,
    LoadingButtonModule,
    SharedModule,
    UtilitiesModule,
  ],
  templateUrl: './clientslogs.component.html',
  styleUrl: './clientslogs.component.scss',
})
export class ClientslogsComponent implements OnInit {
  showToast = false;
  ToastMessage = '';
  ToastColor = '';

  logType: LogType = '';

  clients: any[] = [];
  loadingClients = false;
  selectedClientGUID = '';

  fetching = false;
  logContent = '';
  hasResult = false;

  constructor(
    private logsService: ClientslogsService,
    private clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.loadingClients = true;
    this.clientsService.getClients().subscribe({
      next: (res: any) => {
        this.clients = Array.isArray(res?.Data) ? res.Data : Array.isArray(res) ? res : [];
        this.loadingClients = false;
      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.loadingClients = false;
      },
    });
  }

  onLogTypeChange() {
    this.selectedClientGUID = '';
    this.logContent = '';
    this.hasResult = false;
  }

  canFetch(): boolean {
    if (this.logType === 'api') return true;
    if (this.logType === 'service' && this.selectedClientGUID) return true;
    return false;
  }

  fetchLog() {
    if (!this.canFetch()) {
      this.toast('Please complete the selection first', 'warning');
      return;
    }

    this.fetching = true;
    this.logContent = '';
    this.hasResult = false;

    if (this.logType === 'api') {
      this.logsService.downloadAPILog().subscribe({
        next: (text: string) => {
          this.logContent = this.normalizeLog(text);
          this.hasResult = true;
          this.fetching = false;
          this.toast('API log fetched', 'success');
        },
        error: (err) => {
          this.fetching = false;
          console.error('APILogDownload error:', err);
          this.toast(err?.error?.Message || 'Failed to fetch API log', 'danger');
        },
      });
      return;
    }

    this.logsService.readServiceLog(this.selectedClientGUID).subscribe({
      next: (res: any) => {
        this.logContent = this.extractServiceLog(res);
        this.hasResult = true;
        this.fetching = false;
        this.toast('Service log fetched', 'success');
      },
      error: (err) => {
        this.fetching = false;
        console.error('ReadServiceLog error:', err);
        this.toast(err?.error?.Message || 'Failed to fetch service log', 'danger');
      },
    });
  }

  clearResult() {
    this.logContent = '';
    this.hasResult = false;
  }

  downloadAsFile() {
    if (!this.logContent) return;
    const fileName = this.logType === 'api' ? 'APILog.txt' : 'ServiceLog.txt';
    const blob = new Blob([this.logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  private normalizeLog(raw: any): string {
    if (raw == null) return '';
    if (typeof raw === 'string') return raw;
    return JSON.stringify(raw, null, 2);
  }

  private extractServiceLog(res: any): string {
    if (typeof res === 'string') return res;
    return (
      res?.Data?.Log ||
      res?.Data?.LogContent ||
      res?.Data ||
      res?.Log ||
      this.normalizeLog(res)
    );
  }

  private toast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    this.ToastMessage = message;
    this.ToastColor = color;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }
}
