import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VersionManagerService } from '././version-manager.service';

@Component({
  selector: 'app-service-version',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  templateUrl: './service-version.component.html',
  styleUrl: './service-version.component.scss'
})
export class ServiceVersionComponent {

  selectedService: string = '';
  selectedFile: File | null = null;

  isUploading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
installerUrl: string = '';
  services = [
    {
      name: 'x2xRMH QuickBooks Connector',
      value: 'x2xRMH-For-QuickBooksConnectorApp'
    },
    // {
    //   name: 'x2xRMH QuickBooks Service',
    //   value: 'x2xRMH-For-QuickBooksService'
    // }
  ];

  constructor(
    private versionManagerService: VersionManagerService
  ) {}

  onServiceChange(): void {
    this.selectedFile = null;
    this.successMessage = '';
    this.errorMessage = '';
      this.installerUrl = '';
  }

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.successMessage = '';
      this.errorMessage = '';
    }
  }

  installFile(): void {

    this.successMessage = '';
    this.errorMessage = '';

    if (!this.selectedService) {
      this.errorMessage = 'Please select a service.';
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file.';
      return;
    }

    const formData = new FormData();

    formData.append('AppVersion', '1.0.0');
    formData.append('file', this.selectedFile);
    formData.append('IsActive', 'true');
    formData.append('ReleaseDate', new Date().toISOString());
    formData.append('ServiceAppName', this.selectedService);
    formData.append('URL', 'https://partners.x2xecommerce.com/sandbox/qbapi/AppVersions/x2xRMH-For-QuickBooksConnectorApp.zip');
    formData.append('Message', '');
    this.isUploading = true;

    this.versionManagerService.uploadInstaller(formData).subscribe({

      next: (response) => {

        this.isUploading = false;

        if (response?.IsSuccess === true) {
          this.successMessage =
            response?.Message || 'Installer uploaded successfully.';

this.installerUrl = 'https://partners.x2xecommerce.com/sandbox/qbapi/AppVersions/x2xRMH-For-QuickBooksConnectorApp.zip';

        } else {
          this.successMessage =
            response?.Message || 'Installer uploaded successfully.';
        }

        this.selectedFile = null;
      },

    error: (error) => {

  this.isUploading = false;

  console.log('Upload Installer Error:', error);
  console.log('Status:', error.status);
  console.log('Error Body:', error.error);

  this.errorMessage =
    error?.error?.Message ||
    error?.error?.message ||
    error?.message ||
    `Upload failed. Status: ${error.status}`;
}

    });
  }
}
