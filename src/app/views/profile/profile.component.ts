import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  RowComponent,
  ColComponent,
  FormControlDirective,
 
} from '@coreui/angular-pro';
import { IconDirective } from '@coreui/icons-angular';
import { GlobalobjectService } from '../../globalobject.service';

@Component({
  selector: 'app-profile',
  standalone: true,

  imports: [
    CommonModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    RowComponent,
    ColComponent,
    FormControlDirective,
    IconDirective,
    FormsModule
  ],

  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  constructor(
    private globalObjectService: GlobalobjectService
  ) {}

  ngOnInit(): void {
    this.user = this.globalObjectService.UserProfile;

    if (!this.user) {

      const savedProfile = localStorage.getItem('UserProfile');

      if (savedProfile) {
        this.user = JSON.parse(savedProfile);
        this.globalObjectService.UserProfile = this.user;
      }

    }

  }

}