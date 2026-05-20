import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import {
  CardModule,
  GridModule,
  FormModule,
  ButtonModule,
  ButtonDirective,
  SmartTableModule,
  SmartTableComponent,
  TemplateIdDirective,
  SpinnerModule,
  ToastModule,
  AlertModule,
  LoadingButtonModule,
  SharedModule,
  UtilitiesModule,
} from '@coreui/angular-pro';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { QueryscreenService } from './queryscreen.service';
import { ClientsService } from '../clients/clients.service';

@Component({
  selector: 'app-queryscreen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    CardModule,
    GridModule,
    FormModule,
    ButtonModule,
    ButtonDirective,
    SmartTableModule,
    SmartTableComponent,
    TemplateIdDirective,
    SpinnerModule,
    ToastModule,
    AlertModule,
    LoadingButtonModule,
    SharedModule,
    UtilitiesModule,
    MonacoEditorModule,
  ],
  templateUrl: './queryscreen.component.html',
  styleUrl: './queryscreen.component.scss',
})
export class QueryscreenComponent implements OnInit {
  showToast = false;
  ToastMessage = '';
  ToastColor = '';

  clients: any[] = [];
  selectedClientId: any = '';
  loadingClients = false;

  query = 'SELECT * FROM ';
  executing = false;

  resultColumns: any[] = [];
  resultData: any[] = [];
  totalCount: any = 'Records Count: 0 | ';

  editorOptions = {
    theme: 'vs-dark',
    language: 'sql',
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    scrollBeyondLastLine: false,
    wordWrap: 'on',
  };

  constructor(
    private queryService: QueryscreenService,
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
        this.toast('Failed to load clients', 'danger');
      },
    });
  }

  executeQuery() {
    if (!this.selectedClientId) {
      this.toast('Please select a client first', 'warning');
      return;
    }
    if (!this.query || !this.query.trim()) {
      this.toast('Query cannot be empty', 'warning');
      return;
    }

    this.executing = true;
    this.resultColumns = [];
    this.resultData = [];

    this.queryService.executeQuery(this.selectedClientId, this.query).subscribe({
      next: (res: any) => {
        const rows = Array.isArray(res?.Data) ? res.Data : Array.isArray(res) ? res : [];
        this.buildResult(rows);
        this.executing = false;
        this.toast(`Query executed. ${rows.length} row(s) returned.`, 'success');
      },
      error: (err) => {
        console.error('Query error:', err);
        this.executing = false;
        this.toast(err?.error?.Message || err?.message || 'Query failed', 'danger');
      },
    });
  }

  private buildResult(rows: any[]) {
    if (!rows.length) {
      this.resultColumns = [];
      this.resultData = [];
      this.totalCount = 'Records Count: 0 | ';
      return;
    }
    const keys = Object.keys(rows[0]);
    this.resultColumns = keys.map((k) => ({
      key: k,
      label: k,
      filter: false,
      sorter: true,
      _style: { fontWeight: '500' },
    }));
    this.resultData = rows;
    this.totalCount = 'Records Count: ' + rows.length + ' | ';
  }

  clearQuery() {
    this.query = '';
  }

  private toast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    this.ToastMessage = message;
    this.ToastColor = color;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }
}
