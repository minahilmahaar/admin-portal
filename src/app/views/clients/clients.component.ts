import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import {
  CardModule,
  GridModule,
  FormModule,
  ButtonModule,
  ButtonDirective,
  ButtonCloseDirective,
  SmartTableModule,
  SmartTableComponent,
  TemplateIdDirective,
  SpinnerModule,
  ToastModule,
  AlertModule,
  ModalModule,
  LoadingButtonModule,
  SharedModule,
  UtilitiesModule,
} from '@coreui/angular-pro';
import { ClientsService, EditClientBody } from './clients.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconDirective,
    CardModule,
    GridModule,
    FormModule,
    ButtonModule,
    ButtonDirective,
    ButtonCloseDirective,
    SmartTableModule,
    SmartTableComponent,
    TemplateIdDirective,
    SpinnerModule,
    ToastModule,
    AlertModule,
    ModalModule,
    LoadingButtonModule,
    SharedModule,
    UtilitiesModule,
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit {
  showToast = false;
  ToastMessage = '';
  ToastColor = '';

  inProgress = false;
  totalCount: any = 'Records Count: 0 | ';
  CustomersData: any[] = [];

  EditModalVisible = false;
  EditLoading = false;
  EditForm: EditClientBody = {
    User_Id: 0,
    FirstName: '',
    LastName: '',
    UserName: '',
    UserDisplayName: '',
    MobilePhoneNumber: '',
  };

  CustomersColumns = [
    { key: 'Id', label: 'ID', filter: false, sorter: true, _style: { fontWeight: '500', width: '5%' } },
    { key: 'ClientName', label: 'Client Name', filter: false, sorter: true, _style: { fontWeight: '500' } },
    { key: 'EmailAddress', label: 'Email', filter: false, sorter: true, _style: { fontWeight: '500' } },
    { key: 'User_DisplayName', label: 'Display Name', filter: false, sorter: true, _style: { fontWeight: '500' } },
    { key: 'User_MobilePhoneNumber', label: 'Phone', filter: false, sorter: false, _style: { fontWeight: '500' } },
    { key: 'IsActive', label: 'Active', filter: false, sorter: true, _style: { fontWeight: '500', width: '7%', textAlign: 'center' } },
    { key: 'IsOnline', label: 'Online', filter: false, sorter: true, _style: { fontWeight: '500', width: '7%', textAlign: 'center' } },
    { key: 'CreatedOnUTC', label: 'Created On', filter: false, sorter: true, _style: { fontWeight: '500' } },
    { key: 'Actions', label: 'Actions', filter: false, sorter: false, _style: { fontWeight: '500', width: '90px', textAlign: 'center' } },
  ];

  constructor(private clientsService: ClientsService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.inProgress = true;
    this.clientsService.getClients().subscribe({
      next: (res: any) => {
        const rows = Array.isArray(res?.Data) ? res.Data : Array.isArray(res) ? res : [];
        this.CustomersData = rows.map((r: any) => ({
          ...r,
          CreatedOnUTC: r.CreatedOnUTC ? new Date(r.CreatedOnUTC).toLocaleString('en-US', { timeZone: 'UTC' }) : '',
        }));
        this.totalCount = 'Records Count: ' + this.CustomersData.length + ' | ';
        this.inProgress = false;
      },
      error: (err) => {
        console.error('Error fetching clients:', err);
        this.inProgress = false;
        this.toast(err?.error?.Message || 'Failed to load clients', 'danger');
      },
    });
  }

  openEditModal(row: any) {
    this.EditForm = {
      User_Id: row.User_Id ?? 0,
      FirstName: row.User_FirstName || '',
      LastName: row.User_LastName || '',
      UserName: row.User_UserName || '',
      UserDisplayName: row.User_DisplayName || '',
      MobilePhoneNumber: row.User_MobilePhoneNumber || '',
    };
    this.EditModalVisible = true;
  }

  closeEditModal() {
    this.EditModalVisible = false;
  }

  saveEdit(form: any) {
    if (form.invalid || !this.EditForm.User_Id) {
      this.toast('Please fill in required fields', 'warning');
      return;
    }

    this.EditLoading = true;
    this.clientsService.editClient(this.EditForm).subscribe({
      next: (res: any) => {
        this.EditLoading = false;
        if (res?.APIStatus?.IsSuccess === false || res?.IsSuccess === false) {
          this.toast(res?.APIStatus?.Message || res?.Message || 'Failed to update client', 'danger');
          return;
        }
        this.toast('Client updated successfully', 'success');
        this.closeEditModal();
        this.loadClients();
      },
      error: (err) => {
        this.EditLoading = false;
        console.error('Error editing client:', err);
        this.toast(err?.error?.Message || err?.message || 'Failed to update client', 'danger');
      },
    });
  }

  goToRMHQBO(row: any) {
    const email = row?.EmailAddress;
    if (!email) {
      this.toast('This client has no email address on file', 'warning');
      return;
    }

    this.clientsService.clientLogin(email).subscribe({
      next: (res: any) => {
        console.log('🔎 ClientLogin response:', res);
        const redirectUrl =
          res?.RedirectUrl ||
          res?.RedirectURL ||
          res?.Data?.RedirectUrl ||
          res?.Data?.RedirectURL ||
          res?.Data?.Url ||
          res?.Url;
        if (redirectUrl) {
          window.open(redirectUrl, '_blank');
          return;
        }
        this.toast('Client login succeeded — no redirect URL returned. Check console for response.', 'success');
      },
      error: (err) => {
        console.error('ClientLogin error:', err);
        this.toast(err?.error?.Message || err?.message || 'Client login failed', 'danger');
      },
    });
  }

  private toast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    this.ToastMessage = message;
    this.ToastColor = color;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }
}
