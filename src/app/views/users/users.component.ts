import { Component, OnInit, OnDestroy,signal  } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { UsersService } from './users.service';
import { Subscription } from 'rxjs';
import { IconDirective } from '@coreui/icons-angular';
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
} from '@coreui/angular-pro';
import { Router } from '@angular/router';
import { GlobalobjectService } from '../../globalobject.service';
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
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {

  //#region Variables Declaration
  ModalLoading = false;
  totalCount: number | null = null;
  modaltotalCount: number | null = null;
  showToast = false;
  ToastMessage = '';
  ToastColor = '';
  Bar = false;
  Loading = 0;
  loading: boolean[] = new Array(4).fill(false);
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
  SelectedUserEdit: any;
  unfilterdData: any[] = [];
  customStylesValidated = false;
  CustomersData: any[] = [];
  private subscriptions: Subscription = new Subscription();
  public RegisterUserModalvisible = false;
  public EditUserModalvisible = false;
  DetailFormOnLoad = true;
  //#endregion Variables Declaration



  // add user
  public AddUserForm = {
    FirstName : '',
    LastName: '',
    EmailAddress: ''
  };

  constructor(
    private GlobalobjectService: GlobalobjectService,
    private cookieService: CookieService,
    private usersService: UsersService,
    private Router : Router,
  ) {}

  CustomersColumns = [
    {
      key: 'UserDisplayName',
      label: 'User Name',
      filter: false,
      sorter: false,
      _style: { fontWeight: '500' },
    },
    {
      key: 'EmailAddress',
      label: 'Email Address',
      _style: { fontWeight: '500', width: '12%', textAlign: 'center' },
      filter: false,
      sorter: false,
    },
    {
      key: 'MobilePhoneNumber',
      label: 'Mobile Phone Number',
      _style: { fontWeight: '500' },
      filter: false,
      sorter: false,
    },
    {
      key: 'Address',
      label: 'Address',
      _style: { fontWeight: '500' },
      filter: false,
      sorter: false,
    },
    {
      key: 'CreatedOnUTC',
      label: 'Created On (UTC)',
      _style: { fontWeight: '500' },
      filter: false,
      sorter: false,
    },
    {
      key: 'show',
      label: 'Action',
      _style: { fontWeight: '500' },
      filter: false,
      sorter: false,
    },
  ];

  async AddUser(EmailAddress: string, FirstName: string, LastName: string) {

    //start loading button
    this.loading[0] = true;

    if( this.cookieService.get('Client_Id') == null || this.cookieService.get('Client_Id') == undefined || this.cookieService.get('Client_Id') == '') {
      this.ToastMessage = 'Client ID is not set in cookies.';
      this.ToastColor = 'danger';
      this.showToast = true;
      
      this.Router.navigate(['/login']);
      return;
    }

    //create a form data object
    const formData = new FormData();


    const body = {
      UserType_Id: 1,
      Client_Id: this.cookieService.get('Client_Id'),
      EmailAddress,
      UserName: EmailAddress,
      FirstName,
      LastName,
      UserDisplayName: `${FirstName} ${LastName}`,
      SendEmails: false,
      Picture: null,
    };

    console.log(body);

    this.ModalLoading = true;

    try {
      const response: any = await this.usersService.registerUser(body).toPromise();
      console.log(response);
      if (response.APIStatus.IsSuccess) {
      this.ToastMessage = 'Record Created Successfully';
      this.ToastColor = 'success';
      this.showToast = true;
      } else {
      this.ToastMessage = response.APIStatus.Message;
      this.ToastColor = 'danger';
      this.showToast = true;
      }
    } catch (error: any) {
      console.error(error);
      this.ToastMessage = 'Error Occurred While Adding User';
      this.ToastColor = 'danger';
      this.showToast = true;
    } finally {
      this.ModalLoading = false;
      this.getUsers();
      this.toggleRegisterUserModal();
    }
    }
  
  toggleRegisterUserModal() {
    this.RegisterUserModalvisible = !this.RegisterUserModalvisible;
  }
  
  // Optimized EditUserForm with consistent property names
  public EditUserForm = {
    FirstName: '',
    LastName: '',
    UserDisplayName: '',
    PhoneNumber: ''
  };

  toggleEditUserModal() {
    this.EditUserModalvisible = !this.EditUserModalvisible;
    // Clear form data with a single assignment
    this.EditUserForm = {
      FirstName: '',
      LastName: '',
      UserDisplayName: '',
      PhoneNumber: ''
    };
    this.SelectedUserEdit = null;
    this.ModalLoading = false;
    this.loading[0] = false;
    this.showToast = false;
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.subscriptions.add(
      this.usersService.getUsers().subscribe(
        (response: any) => {
          console.log(response);
          this.CustomersData = response.Data.map((element: any) => ({
            ...element,
            CreatedOnUTC: new Date(element.CreatedOnUTC).toLocaleString('en-US', {
              timeZone: 'UTC',
            }),
          }));
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


  async toggleDetails(RowUser: any) {
    this.DetailFormOnLoad = true;
    this.Percentage = 20;
    this.toggleEditUserModal();

    this.usersService.getUserById(RowUser.Id).subscribe(
      (response: any) => {
        this.SelectedUserEdit = response.Data;
        console.log(this.SelectedUserEdit)
        // Use consistent property names
        this.EditUserForm = {
          FirstName: this.SelectedUserEdit.FirstName || '',
          LastName: this.SelectedUserEdit.LastName || '',
          UserDisplayName: this.SelectedUserEdit.UserDisplayName || '',
          PhoneNumber: this.SelectedUserEdit.MobilePhoneNumber || ''
        };
        this.Percentage = 100;
        this.DetailFormOnLoad = false;
      },
      (error: any) => {
        console.error('Error fetching user details:', error);
      }
    );
  }
 
  async EditUser(UserDisplayName: string, FirstName: string, LastName: string, PhoneNumber: string) {
    this.loading[0] = true;

    const body = {
      Id: this.SelectedUserEdit.Id,
      UserTypes_Id: this.SelectedUserEdit.UserType_Id,
      Client_Id: this.SelectedUserEdit.Client_Id,
      UserName: this.SelectedUserEdit.UserName,
      FirstName,
      LastName,
      UserDisplayName,
      MobilePhoneNumber: PhoneNumber,
    };

    console.log(body);

    this.ModalLoading = true;

    // try {
    //   const response: any = await this.usersService.registerUser(body).toPromise();
    //   console.log(response);
    //   if (response.APIStatus.IsSuccess) {
    //     this.ToastMessage = 'Record Updated Successfully';
    //     this.ToastColor = 'success';
    //     this.showToast = true;
    //   } else {
    //     this.ToastMessage = response.APIStatus.Message;
    //     this.ToastColor = 'danger';
    //     this.showToast = true;
    //   }
    // } catch (error: any) {
    //   console.error(error);
    //   this.ToastMessage = 'Error Occurred While Updating User';
    //   this.ToastColor = 'danger';
    //   this.showToast = true;
    // } finally {
    //   this.ModalLoading = false;
    //   this.getUsers();
    //   this.toggleEditUserModal();
    // }

  }

}
