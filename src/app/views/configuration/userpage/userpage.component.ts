import {
  AlertModule,
  BadgeModule,
  ButtonModule,
  CardModule,
  CollapseModule,
  GridModule,
  SharedModule,
  SmartTableModule,
  TableModule,
  UtilitiesModule,
  ModalModule,
  FormModule,
  ProgressModule,
  SpinnerModule,
  NavModule,
  TabsModule,
  ButtonGroupModule,
  DropdownModule,
  ListGroupModule,
  MultiSelectModule,
  DatePickerModule,
  DateRangePickerModule,
  TimePickerModule,
  LoadingButtonModule,
  CalloutModule,
  ImgModule,
  PopoverModule,
  OffcanvasModule,
  AvatarModule,
  Tabs2Module,
} from '@coreui/angular-pro';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { UserModel, UsersService } from '../users/users.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { GlobalobjectService } from '../../../globalobject.service';
import { ToastService } from '../../../toast.service';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    CardModule,
    SmartTableModule,
    CollapseModule,
    TableModule,
    UtilitiesModule,
    BadgeModule,
    SharedModule,
    ButtonModule,
    AlertModule,
    HttpClientModule,
    ModalModule,
    FormModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    ProgressModule,
    SpinnerModule,
    NavModule,
    TabsModule,
    ButtonGroupModule,
    DropdownModule,
    ListGroupModule,
    MultiSelectModule,
    DatePickerModule,
    DateRangePickerModule,
    TimePickerModule,
    LoadingButtonModule,
    CalloutModule,
    ImgModule,
    PopoverModule,
    OffcanvasModule,
    AvatarModule,
    Tabs2Module,
    RouterLink,
    RouterModule,
  ],
})
export class UserpageComponent implements OnInit {
  constructor(
    public UsersService: UsersService,
    private GlobalobjectService: GlobalobjectService,
    public router: Router,
    private toastService: ToastService
  ) {}

  PreviousPassowrd: any;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  msg: any;
  ModalVisible: boolean = false;
  customStylesValidated: boolean = false;
  Loading: boolean = false;
  ButtonLoading: boolean = false;
  EditMode: boolean = false;
  public loading = new Array(4);

  toggleModal() {
    if (this.ModalVisible) {
      this.customStylesValidated = false;
      this.UsersService.UserData = new UserModel();
      this.EditMode = false;
    }
    this.ModalVisible = !this.ModalVisible;
  }

  ModalVisibleResetPassword: boolean = false;
  toggleModalResetPassword() {
    if (this.ModalVisibleResetPassword) {
      this.customStylesValidated = false;
      this.UsersService.UserData = new UserModel();
      this.confirmPassword = '';
      this.EditMode = false;
    }
    this.ModalVisibleResetPassword = !this.ModalVisibleResetPassword;
  }

  UserData: any;
  ngOnInit(): void {
    this.UsersService.selectedUserData.subscribe((data) => {
      this.UserData = data;
    });
    this.getRolesByUserID(this.UserData.Id);
  }

  RoleList: any;
  getRolesByUserID(id: any) {
    this.Loading = true;
    this.UsersService.getRolesByuserId(id).subscribe({
      next: (res: any) => {
        this.RoleList = res.Data;
      },
      error: (error) => {
        console.error(error);
        alert('Error: ' + error.error.message);
      },
    });
  }

  SaveRoles() {
    this.loading[0] = setTimeout(() => {
      this.loading[0] = undefined;
    }, 300000);

    const requestData: { User_Id: number; RoleList: number[] } = {
      User_Id: this.UserData.Id,
      RoleList: [],
    };

    for (const task of this.RoleList) {
      if (task.IsActive !== task.original_IsActive) {
        if (task.IsActive == true) {
          requestData.RoleList.push(task.Id);
        }
      }
    }
    if (requestData.RoleList.length == 0) {
      this.toastService.show('Please Select At Least One Role To Assign.', 'warning');
      this.loading[0] = undefined;
      return;
    }

    if (requestData.RoleList.length > 0) {
      this.UsersService.AssignRolesToUser(requestData).subscribe((response: any) => {
        if (response.IsSuccess) {
          this.toastService.show('Role(s) updated successfully!', 'success');
          this.router.navigate(['/configuration/users']);
        } else {
          this.toastService.show(response.message || 'Failed to assign roles', 'danger');
        }
        this.msg = response;
        this.loading[0] = undefined;

        setTimeout(() => {
          this.msg = null;
        }, 5000);
        this.ngOnInit();
      });
    }
  }

  confirmPassword: any;

  EditUser(data: any) {
    this.UsersService.UserData = data;
    this.toggleModal();
    this.EditMode = true;
  }

  ResetPasswordModal(data: any) {
    this.UsersService.UserData = data;
    this.toggleModalResetPassword();
  }

  UpdateUserDetails(UsersDetailsForm: any, UserData: any, PasswordUpdate?: boolean) {
    this.customStylesValidated = true;
    if (UsersDetailsForm.invalid) {
      return;
    }
    this.ButtonLoading = true;

    this.UsersService.editUser(UserData).subscribe({
      next: (res: any) => {
        if (res.APIStatus.IsSuccess) {
          this.toastService.show('User updated successfully!', 'success');
          UserData.password = '';
          this.UsersService.selectedUserDataUpdate(UserData);
        } else {
          this.toastService.show(res.Message || 'Failed to update user', 'danger');
        }
        this.ButtonLoading = false;
        if (PasswordUpdate) {
          this.toggleModalResetPassword();
        } else {
          this.toggleModal();
        }
        this.ngOnInit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.show('Error: ' + (error.error.message || 'Unknown error'), 'danger');
      },
    });
  }

  DeleteUser(item: any) {
    if (!confirm('Are you sure you want to delete this User?')) {
      return;
    }
    this.UsersService.deleteUser(item.Id_Encrypted).subscribe({
      next: (res: any) => {
        if (res.IsSuccess) {
          this.toastService.show('User deleted successfully!', 'success');
          this.msg = res;
          setTimeout(() => {
            this.msg = undefined;
          }, 3000);
          this.router.navigate(['/configuration/users']);
        } else {
          this.toastService.show(res.message || 'Failed to delete user', 'danger');
          this.msg = res;
          setTimeout(() => {
            this.msg = undefined;
          }, 3000);
        }
      },
      error: (error: any) => {
        console.error(error);
        this.toastService.show('Error: ' + (error.error.message || 'Unknown error'), 'danger');
      },
    });
  }
}
