import { Component } from '@angular/core';
import {
  ProgressBarDirective,
  ProgressComponent as ProgressComponent_1,
  ProgressBarComponent,
  ProgressStackedComponent,
  FormDirective,
  FormCheckComponent,
  FormCheckLabelDirective,
  ButtonGroupComponent,
  CardModule,
  Tabs2Module,
  ModalModule,
  GridModule,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  FormControlDirective,
  FormLabelDirective,
  FormCheckInputDirective,
  ThemeDirective,
  DropdownComponent,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  DropdownDividerDirective,
  FormSelectDirective,
  SpinnerModule,
  BadgeComponent,
  ButtonDirective,
  CollapseDirective,
  SmartTableComponent,
  TemplateIdDirective,
  TextColorDirective,
  ToastModule,
  AlertModule,
  AlertComponent,
  AlertHeadingDirective,
  AlertLinkDirective,
  ButtonCloseDirective,
  LoadingButtonComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective
} from '@coreui/angular-pro';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import * as signalR from '@microsoft/signalr';
import { IconDirective } from '@coreui/icons-angular';
import { GlobalobjectService } from '../../globalobject.service';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
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
    IconDirective,
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
    ModalToggleDirective
    ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

      //#region Variables Declaration

      ModalLoading: boolean = false;
      totalCount: any;
      modaltotalCount: any;
      showToast: boolean = false;
      ToastMessage = '';
      ToastColor = '';
      Bar: boolean = false;
      Loading: Number = 0;
      public loading = new Array(4);
      Percentage = 0;
      inProgress = false;
      totaldebits: number = 0;
      totalcredits: number = 0;
      details_visible = Object.create({});
      selectedlines: any = [];
      GPIDs: any = [];
      AllowAllMigratable: boolean = false;
      ModalSelecetedMapping: any;
      SelectOnlyOne: boolean = false;
      SelectedMapping: any;
      unfilterdData: any[] = [];
      customStylesValidated = false;
      //#endregionVariables Declaration

      usersData: any[] = [
        { Name: false, Email: 1, Column: 'User ID', CompanyName: 'Company Name', CreatedOnUtc: 'Created On UTC', 'Column 2': 'Column2', 'Column 1': 'Column1' },

      ];


      CustomersColumns = [
        {
          key: 'isSync',
          label: 'User ID',
          filter: false,
          sorter: false,
          _style: { fontWeight: '500' },
        },
        {
          key: 'Number',
          label: 'User Name',
          _style: { fontWeight: '500', width: '12%', textAlign: 'center' },
          filter: false,
          sorter: false,
        },
        {
          key: 'Column',
          label: 'Column',
          _style: { fontWeight: '500' },
          filter: false,
          sorter: false,
        },
        // {
        //   key: 'GPCompanyName',
        //   label: 'GP Company Name',
        //   _style: { fontWeight: '500' },
        //   filter: false,
        //   sorter: false,
        // },
        {
          key: 'CreatedOnUtc',
          label: 'Column',
          _style: { fontWeight: '500' },
          filter: false,
          sorter: false,
        },
        {
          key: 'StatusReason',
          label: 'Column',
          _style: { fontWeight: '500'},
          filter: false,
          sorter: false,
        },
        {
          key: 'StatusReason',
          label: 'Created at',
          _style: { fontWeight: '500'},
          filter: false,
          sorter: false,
        },
        // {
        //   key: 'Description',
        //   label: 'Description',
        //   _style: { fontWeight: '500'},
        //   filter: false,
        //   sorter: false,
        // },
      ];
    
      CustomersData = [];


      async AddUser( 
        // EmailAddress.value, Password.value, UserName.value, UserDisplayName.value, Address.value, MobilePhoneNumber.value
         ///FirstName.value, LastName.value
        EmailAddress: any, FirstName: any, LastName: any, 
      ) {
        
        // UserTypes_Id            = YES => 3 Hard Code
        // Client_Id               = YES => (Cline ID, who is login)
        // EmailAddress            = YES
        // UserName                = YES => EmailAddress
        // FirstName               = YES
        // LastName                = YES
        // UserDisplayName         = YES => FirstName + " " + LastName
        // aspUserID               = 
        // MobilePhoneNumber       = 
        // Address                 = 
        // IsEmailVerified         = 0
        // IsMobilePhoneVerified   = 0
        // IsActive                = 0
        // IsApproved              = 0
        // Picture                 = .
        // FailedLoginAttempts     = 0

        var body = {
          UserTypes_Id: 3,
          Client_Id: 0, ///this.GlobalobjectService.ClientID, // Have to fix
          EmailAddress: EmailAddress,
          UserName: EmailAddress,
          FirstName: FirstName,
          LastName: LastName,
          UserDisplayName: FirstName + ' ' + LastName,
          aspUserID: null,
          MobilePhoneNumber: null,
          Address: null,
          IsEmailVerified: 0,
          IsMobilePhoneVerified: 0,
          IsActive: 0,
          IsApproved: 0,
          Picture: null,
          FailedLoginAttempts: 0,
        };

       
        console.log(body);

      }

}
