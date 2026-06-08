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
  selectedClientGUID: string = '';
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
    if (!this.selectedClientGUID) {
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

    this.queryService.executeQuery(this.selectedClientGUID, this.query).subscribe({
      next: (res: any) => {
        console.log('🔎 SQLQueryRunner response (top-level keys):', res && typeof res === 'object' ? Object.keys(res) : typeof res);
        console.log('🔎 SQLQueryRunner full response:', res);

        const rows = this.extractRows(res);

        // If API reported failure, surface its message and bail
        if (res?.APIStatus && res.APIStatus.IsSuccess === false) {
          this.executing = false;
          this.toast(res.APIStatus.Message || 'Query failed', 'danger');
          return;
        }

        // Server returned IsSuccess but ResultJson is a plain message (not JSON)
        // Surface that message so the user knows why no rows came back.
        if (!rows.length && typeof res?.ResultJson === 'string') {
          const msg = res.ResultJson.trim();
          const looksLikeJson = msg.startsWith('[') || msg.startsWith('{');
          if (msg && !looksLikeJson) {
            this.buildResult([]);
            this.executing = false;
            this.toast(msg, 'warning');
            return;
          }
        }

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

  // Extracts a row array from any of the common response shapes the backend may use.
  // Walks the object once and returns the first array of plain objects found
  // (preferring stringified JSON in fields like ResultJson / Result / Data).
  private extractRows(res: any): any[] {
    if (res == null) return [];

    // 1. Bare array
    if (Array.isArray(res)) return res;

    // 2. Common field names that hold an array directly
    const arrayCandidates = ['Data', 'ResultJson', 'Result', 'Rows', 'Records', 'Items'];
    for (const k of arrayCandidates) {
      if (Array.isArray(res[k])) return res[k];
    }

    // 3. Stringified JSON in known fields
    const stringCandidates = ['ResultJson', 'Result', 'Data', 'Json', 'ResultData', 'Output'];
    for (const k of stringCandidates) {
      const v = res[k];
      if (typeof v === 'string' && v.trim()) {
        try {
          const parsed = JSON.parse(v);
          if (Array.isArray(parsed)) return parsed;
          // Sometimes wrapped: { Table: [...] } or { rows: [...] }
          if (parsed && typeof parsed === 'object') {
            for (const inner of ['Table', 'rows', 'Rows', 'data', 'Data']) {
              if (Array.isArray(parsed[inner])) return parsed[inner];
            }
          }
        } catch (e) {
          // ignore, try next
        }
      }
    }

    // 4. Last resort: scan every top-level property
    for (const k of Object.keys(res)) {
      const v = res[k];
      if (Array.isArray(v) && v.length && typeof v[0] === 'object') return v;
      if (typeof v === 'string' && v.length > 2 && (v[0] === '[' || v[0] === '{')) {
        try {
          const parsed = JSON.parse(v);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          // ignore
        }
      }
    }

    return [];
  }

  private buildResult(rows: any[]) {
    if (!rows.length) {
      this.resultColumns = [];
      this.resultData = [];
      this.totalCount = 'Records Count: 0 | ';
      return;
    }
    const keys = Object.keys(rows[0]);
    this.resultColumns = keys.map((k) => {
      // Estimate column width: based on header length + max sample value length
      // (sampled from first 30 rows so very long URLs/addresses don't dominate)
      const sample = rows.slice(0, 30);
      const maxLen = sample.reduce((m, r) => {
        const v = r[k];
        const s = v === null || v === undefined ? '' : String(v);
        return Math.max(m, s.length);
      }, k.length);
      // ~6.5px per char @ 10px font, plus padding + sort icon space; cap at 260px
      const minPx = Math.min(Math.max(k.length * 8 + 30, 80), 260);
      return {
        key: k,
        label: k,
        filter: false,
        sorter: true,
        _style: {
          fontWeight: '500',
          minWidth: minPx + 'px',
          maxWidth: '260px',
          whiteSpace: 'nowrap',
        },
      };
    });
    this.resultData = rows;
    this.totalCount = 'Records Count: ' + rows.length + ' | ';
  }

  clearQuery() {
    this.query = '';
  }

  exportToExcel() {
    if (!this.resultData?.length) {
      this.toast('No data to export', 'warning');
      return;
    }

    const cols = this.resultColumns.map((c) => c.key);

    const escape = (val: any): string => {
      if (val === null || val === undefined) return '';
      const s = typeof val === 'object' ? JSON.stringify(val) : String(val);
      // CSV-escape: wrap in quotes if contains comma / quote / newline / tab
      if (/[",\n\r\t]/.test(s)) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };

    const header = cols.join(',');
    const lines = this.resultData.map((row) =>
      cols.map((k) => escape(row[k])).join(',')
    );
    // ﻿ BOM so Excel detects UTF-8 (Unicode safe)
    const csv = '﻿' + [header, ...lines].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const ts = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, '-');
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-result-${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.toast(`Exported ${this.resultData.length} row(s)`, 'success');
  }

  private toast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    this.ToastMessage = message;
    this.ToastColor = color;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }
}
