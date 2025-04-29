import { Component, OnInit, OnDestroy } from '@angular/core';
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
  SelectedMapping: any;
  unfilterdData: any[] = [];
  customStylesValidated = false;
  CustomersData: any[] = [];
  private subscriptions: Subscription = new Subscription();
  //#endregion Variables Declaration

  constructor(
    private cookieService: CookieService,
    private usersService: UsersService
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
  ];

  async AddUser(EmailAddress: string, FirstName: string, LastName: string) {

    //clearTimeout(this.loading[0]);

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

    this.subscriptions.add(
      this.usersService.registerUser(body).subscribe(
        (response: any) => {
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
          this.ModalLoading = false;
          this.getUsers();
        },
        (error: any) => {
          console.error(error);
          this.ToastMessage = 'Error Occurred While Adding User';
          this.ToastColor = 'danger';
          this.showToast = true;
          this.ModalLoading = false;
        }
      )
    );
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
}
