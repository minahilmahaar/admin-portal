import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { UsersService } from './users.service';
import { Subscription } from 'rxjs';
import { IconDirective } from '@coreui/icons-angular';

import { GlobalobjectService } from '../../../globalobject.service';
import {
  Tabs2Module,
  CardModule,
  CollapseDirective,
  SmartTableComponent,
  TemplateIdDirective,
  TextColorDirective,
  ModalModule,
  GridModule,
  LoadingButtonComponent,
  RowComponent,
  ColComponent,
  CardComponent,
  CardBodyComponent,
  FormCheckInputDirective,
  SpinnerModule,
  ToastModule,
  AlertModule,
  AlertComponent,
  ProgressBarDirective,
  ProgressComponent as ProgressComponent_1,
  ProgressBarComponent,
  FormCheckComponent,
  FormCheckLabelDirective,
  FormDirective,
  ButtonGroupComponent,
  ProgressStackedComponent,
  InputGroupComponent,
  InputGroupTextDirective,
  ThemeDirective,
  FormControlDirective,
  FormLabelDirective,
  DropdownComponent,
  DropdownToggleDirective,
  DropdownMenuDirective,
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  MultiSelectModule,
  FormModule,
  SharedModule,
} from '@coreui/angular-pro';
import { Router } from '@angular/router';
import { RolesModel, RolesService } from '../roles/roles.service';
import { ToastService } from '../../../toast.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    IconDirective,
    Tabs2Module,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    CollapseDirective,
    SmartTableComponent,
    TemplateIdDirective,
    TextColorDirective,
    CommonModule,
    ModalModule,
    GridModule,
    LoadingButtonComponent,
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    FormCheckInputDirective,
    SpinnerModule,
    ToastModule,
    AlertModule,
    AlertComponent,
    ProgressBarDirective,
    ProgressComponent_1,
    ProgressBarComponent,
    FormCheckComponent,
    FormCheckLabelDirective,
    FormDirective,
    ButtonGroupComponent,
    ProgressStackedComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    ThemeDirective,
    FormControlDirective,
    FormLabelDirective,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    ButtonCloseDirective,
    ButtonDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    MultiSelectModule,
    FormModule,
    SharedModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  ModalLoading = false;
  totalCount: any = 'Records Count: 0 | ';
  modaltotalCount: number | null = null;
  showToast = false;
  ToastMessage = '';
  ToastColor = '';
  Bar = false;
  Loading = 0;
  public loading = new Array(4);
  Percentage = 0;
  inProgress = false;
  totaldebits = 0;
  totalcredits = 0;
  details_visible: Record<string, boolean> = {};
  selectedlines: any[] = [];
  GPIDs: any[] = [];
  AllowAllMigratable = false;
  ModalSelecetedMapping: any;
  SelectOnlyOne = false;
  SelectedMapping: any;
  unfilterdData: any[] = [];
  customStylesValidated = false;
  CustomersData: any[] = [];
  private subscriptions: Subscription = new Subscription();
  public RegisterUserModalvisible = false;
  ModalVisibleRole: boolean = false;

  MenuBackup: number[] = [];
  recentRemoved: Map<number, number> = new Map();
  permissionIgnoreUntil: number = 0;

  constructor(
    private cookieService: CookieService,
    public usersService: UsersService,
    public RolesService: RolesService,
    private Router: Router,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  CustomersColumns = [
    {
      key: 'UserDisplayName',
      label: 'User Name',
      filter: false,
      sorter: true,
      _style: { fontWeight: '500', width: '25%' },
    },
    {
      key: 'EmailAddress',
      label: 'Email Address',
      _style: { fontWeight: '500', width: '25%' },
      filter: false,
      sorter: true,
    },
    {
      key: 'Roles',
      label: 'Roles',
      _style: { fontWeight: '500', width: '20%' },
      filter: false,
      sorter: true,
    },
    {
      key: 'CreatedOnUTC',
      label: 'Created On',
      _style: { fontWeight: '500' },
      filter: false,
      sorter: true,
    },
    {
      key: 'IsActive',
      label: 'Active',
      _style: { fontWeight: '500' },
      filter: false,
      sorter: true,
    },
  ];

  @ViewChild('AddUserForm') AddUserForm: any;
  @ViewChild('rolePermissions') rolePermissionsCtrl?: NgModel;

  async AddUser(EmailAddress: string, FirstName: string, LastName: string) {
    if (
      this.cookieService.get('Client_Id') == null ||
      this.cookieService.get('Client_Id') == undefined ||
      this.cookieService.get('Client_Id') == ''
    ) {
      this.ToastMessage = 'Client ID is not set in cookies.';
      this.ToastColor = 'danger';
      this.showToast = true;
      this.Router.navigate(['/login']);
      return;
    }

    const body = {
      Client_Id: this.cookieService.get('Client_Id'),
      EmailAddress,
      FirstName,
      LastName,
      UserDisplayName: `${FirstName} ${LastName}`,
      UserName: EmailAddress,
      UserType_Id: 3,
      SendEmails: true,
      Picture: null,
      O_MobilePhoneNo: '',
      O_Address: '',
    };

    this.ModalLoading = true;
    this.loading[0] = setTimeout(() => {
      this.loading[0] = undefined;
    }, 300000);
    try {
      const response: any = await this.usersService.registerUser(body).toPromise();
      if (response.APIStatus.IsSuccess) {
        const requestData: { user_Id: number; roleList: number[] } = {
          user_Id: response.Data.Id,
          roleList: this.usersService.UserData.roles,
        };
        this.usersService.AssignRolesToUser(requestData).subscribe((response: any) => {
          if (response.IsSuccess) {
            this.ButtonLoading = false;
            this.ToastMessage = 'User record created successfully and an email has been sent to user';
            this.ToastColor = 'success';
            this.showToast = true;
            if (this.AddUserForm) {
              this.AddUserForm.reset();
            }
          } else {
            this.ToastMessage = response.message;
            this.ToastColor = 'danger';
            this.showToast = true;
            if (this.AddUserForm) {
              this.AddUserForm.reset();
            }
          }
          clearTimeout(this.loading[0]);
          this.loading[0] = undefined;
        });
      } else {
        if (this.AddUserForm) {
          this.AddUserForm.reset();
        }
        if (response.APIStatus.MsgContainer.MsgInfo_List[0].Message) {
          this.ToastMessage = response.APIStatus.MsgContainer.MsgInfo_List[0].Message;
        } else {
          this.ToastMessage = response.APIStatus.Message;
        }
        this.ToastColor = 'danger';
        this.showToast = true;
        clearTimeout(this.loading[0]);
        this.loading[0] = undefined;
      }
    } catch (error: any) {
      console.error(error);
      this.ToastMessage = 'Error Occurred While Adding User';
      this.ToastColor = 'danger';
      this.showToast = true;
      clearTimeout(this.loading[0]);
      this.loading[0] = undefined;
    } finally {
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
      clearTimeout(this.loading[0]);
      this.loading[0] = undefined;
      this.ModalLoading = false;
      this.ngOnInit();
      this.getUsers();
      this.toggleRegisterUserModal();
    }
  }

  toggleRegisterUserModal() {
    this.RegisterUserModalvisible = !this.RegisterUserModalvisible;
    if (this.AddUserForm) {
      this.AddUserForm.reset();
    }
  }

  ngOnInit(): void {
    this.getUsers();
    this.getRoles();
  }

  getUsers(): void {
    this.inProgress = true;
    const clientId = this.cookieService.get('Client_Id');

    this.subscriptions.add(
      this.usersService.getUsersByClientId(clientId).subscribe(
        (response: any) => {
          this.CustomersData = response.Data
            .filter((element: any) => element.Id != clientId)
            .map((element: any) => {
              const roles = element.O_UserRoles && Array.isArray(element.O_UserRoles) && element.O_UserRoles.length > 0
                ? element.O_UserRoles.map((r: any) => r.O_Role_Name).join(', ')
                : 'No Role';

              return {
                ...element,
                Roles: roles,
                CreatedOnUTC: new Date(element.CreatedOnUTC).toLocaleString('en-US', {
                  timeZone: 'UTC',
                }),
              };
            });

          this.inProgress = false;
          this.totalCount = 'Records Count: ' + this.CustomersData.length + ' | ';
        },
        (error: any) => {
          console.error('Error fetching users:', error);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleModalRole() {
    this.RegisterUserModalvisible = !this.RegisterUserModalvisible;
    if (this.ModalVisibleRole) {
      this.customStylesValidated = false;
      this.RolesService.RolesData = new RolesModel();
      this.MenuBackup = [];
      this.recentRemoved.clear();
      this.permissionIgnoreUntil = 0;
    }
    this.ModalVisibleRole = !this.ModalVisibleRole;
    this.getAllMenus();
  }

  MenuList: any;
  getAllMenus() {
    this.RolesService.getMenusByUserId().subscribe({
      next: (res: any) => {
        this.MenuList = res.Data.filter((item: any) => item.IsActive == true);
        this.MenuBackup = [...(this.RolesService.RolesData.menus || [])];
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  RolessData: any = [];
  async getRoles() {
    this.RolesService.GetRoles(this.cookieService.get('Client_Id')).subscribe(
      (data: any) => {
        const newRoles = Array.isArray(data.Data)
          ? data.Data.map((item: any) => ({
              Id: item.Id,
              RoleName: item.RoleName,
              IsActive: item.IsActive,
              IsReadOnly: item.IsReadOnly,
              Client_Id: item.Client_Id,
              DisplayOrder: item.DisplayOrder,
            }))
          : [];

        if (JSON.stringify(this.RolessData) !== JSON.stringify(newRoles.filter((role: any) => role.IsActive))) {
          this.RolessData = [];
          setTimeout(() => {
            this.RolessData = newRoles.filter((role: any) => role.IsActive);
          }, 500);
          this.cdr.markForCheck();
        } else this.RolessData = newRoles.filter((role: any) => role.IsActive);
      }
    );
  }

  ButtonLoading: boolean = false;
  NewCreatedRoleID: any;

  AddNewRole(RoleDetailsForm: any) {
    this.customStylesValidated = true;
    if (RoleDetailsForm.invalid) {
      return;
    }
    this.RolesService.RolesData.Client_Id = Number(this.cookieService.get('Client_Id'));
    this.RolesService.RolesData.IsActive = true;
    this.RolesService.RolesData.IsReadOnly = false;
    this.RolesService.RolesData.DisplayOrder = 0;

    this.ButtonLoading = true;
    this.loading[0] = setTimeout(() => {
      this.loading[0] = undefined;
    }, 300000);
    this.RolesService.addRoles(this.RolesService.RolesData).subscribe({
      next: (res: any) => {
        if (res.IsSuccess) {
          const requestData: { role_Id: number; MenuIDs: number[] } = {
            role_Id: res.Reserved_A,
            MenuIDs: this.RolesService.RolesData.menus,
          };
          this.NewCreatedRoleID = res.Reserved_A;

          this.RolesService.assignMenuToRoles(requestData).subscribe((response: any) => {
            if (response.IsSuccess) {
              this.getRoles();
              this.RolesService.RolesData = new RolesModel();
              this.customStylesValidated = false;
              this.toggleModalRole();

              setTimeout(() => {
                if (!this.usersService.UserData.roles) {
                  this.usersService.UserData.roles = [];
                }
                if (!this.usersService.UserData.roles.includes(this.NewCreatedRoleID)) {
                  this.usersService.UserData.roles = [
                    ...this.usersService.UserData.roles,
                    this.NewCreatedRoleID,
                  ];
                }
              });
            }
          });
        } else {
          this.ToastMessage = res.Message;
          this.ToastColor = 'danger';
          this.showToast = true;
          setTimeout(() => {
            this.showToast = false;
          }, 3000);
        }
        this.ButtonLoading = false;
        clearTimeout(this.loading[0]);
        this.loading[0] = undefined;
      },
      error: (error) => {
        console.error(error);
        this.ButtonLoading = false;
        clearTimeout(this.loading[0]);
        this.loading[0] = undefined;
        alert('Error: ' + error.error.message);
      },
    });
  }

  onPermissionsChange(event: any) {
    const now = Date.now();
    if (now < this.permissionIgnoreUntil) {
      return;
    }
    this._processPermissionEvent(event);
  }

  _processPermissionEvent(event: any) {
    if (!this.MenuList || this.MenuList.length === 0) {
      return;
    }

    let newSelection: number[] = [];
    if (Array.isArray(event)) {
      newSelection = event
        .map((item) => {
          if (typeof item === 'object' && item.value !== undefined) return Number(item.value);
          return Number(item);
        })
        .filter((id) => !isNaN(id));
    } else if (typeof event === 'object' && event.value !== undefined) {
      newSelection = [Number(event.value)];
    } else if (event !== null && event !== undefined) {
      newSelection = [Number(event)];
    }

    const addedIds = newSelection.filter((id) => !this.MenuBackup.includes(id));
    const removedIds = this.MenuBackup.filter((id) => !newSelection.includes(id));

    let touchedItem: number | null = null;
    if (addedIds.length === 1 && removedIds.length === 0) {
      touchedItem = addedIds[0];
    } else if (removedIds.length === 1 && addedIds.length === 0) {
      touchedItem = removedIds[0];
    } else if (addedIds.length > 0) {
      touchedItem = addedIds[addedIds.length - 1];
    } else if (removedIds.length > 0) {
      touchedItem = removedIds[removedIds.length - 1];
    }

    const parentGroups = new Map<number, { added: number[]; removed: number[] }>();

    [...addedIds, ...removedIds].forEach((id) => {
      const menu = this.MenuList.find((m: any) => m.Id === id);
      if (!menu) return;

      const parentId = menu.Parent_Id || 0;
      if (!parentGroups.has(parentId)) {
        parentGroups.set(parentId, { added: [], removed: [] });
      }

      const group = parentGroups.get(parentId)!;
      if (addedIds.includes(id)) group.added.push(id);
      if (removedIds.includes(id)) group.removed.push(id);
    });

    let finalSelection = [...newSelection];

    parentGroups.forEach((group, parentId) => {
      const nowInner = Date.now();
      const validAdded = group.added.filter((id) => {
        const recentTime = this.recentRemoved.get(id);
        if (recentTime && nowInner - recentTime < 1000) {
          return false;
        }
        return true;
      });

      if (validAdded.length > 0) {
        validAdded.forEach((addedId) => {
          const addedMenu = this.MenuList.find((m: any) => m.Id === addedId);
          if (!addedMenu) return;

          if (addedMenu.Parent_Id === 0) {
            const children = this.MenuList.filter((m: any) => m.Parent_Id === addedId);
            if (children.length > 0) {
              const firstChild = children[0];
              if (!finalSelection.includes(firstChild.Id)) {
                finalSelection.push(firstChild.Id);
              }
            }
          }
        });
      }

      if (group.removed.length > 0) {
        group.removed.forEach((removedId) => {
          this.recentRemoved.set(removedId, nowInner);

          const removedMenu = this.MenuList.find((m: any) => m.Id === removedId);
          if (!removedMenu) return;

          if (removedMenu.Parent_Id !== 0) {
            const parentIdLocal = removedMenu.Parent_Id;
            const siblings = this.MenuList.filter((m: any) => m.Parent_Id === parentIdLocal);
            const selectedSiblings = siblings.filter((s: any) => finalSelection.includes(s.Id));

            if (selectedSiblings.length === 0 && finalSelection.includes(parentIdLocal)) {
              finalSelection = finalSelection.filter((id) => id !== parentIdLocal);
            }
          }
        });
      }
    });

    const cleanupNow = Date.now();
    for (const [id, time] of this.recentRemoved.entries()) {
      if (cleanupNow - time > 5000) {
        this.recentRemoved.delete(id);
      }
    }

    this.MenuBackup = [...finalSelection];
    this.RolesService.RolesData.menus = finalSelection;

    if (JSON.stringify(finalSelection.sort()) !== JSON.stringify(newSelection.sort())) {
      this.enforceMultiSelectValue(finalSelection);

      if (addedIds.length > 0 && removedIds.length === 0) {
        this.permissionIgnoreUntil = Date.now() + 500;
      }
    }
  }

  enforceMultiSelectValue(arr: number[]) {
    setTimeout(() => {
      if (this.rolePermissionsCtrl?.control) {
        this.rolePermissionsCtrl.control.setValue([...arr]);
        this.cdr.detectChanges();

        setTimeout(() => {
          this.RolesService.RolesData.menus = [...arr];
        });
      }
    });
  }

  OpenUserPage(item: any) {
    this.usersService.selectedUserDataUpdate(item.item);
    this.Router.navigate(['/configuration/userpage']);
  }
}
