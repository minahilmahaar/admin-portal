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
  LoadingButtonComponent
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
  selector: 'app-clients',
  standalone: true,
  imports: [
    Tabs2Module,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
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
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {

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
      //#endregionVariables Declaration
      CustomersColumns = [
        {
          key: 'isSync',
          label: 'RMH Customer',
          filter: false,
          sorter: false,
          _style: { fontWeight: '500' },
        },
        {
          key: 'Number',
          label: 'QB ID',
          _style: { fontWeight: '500', width: '12%', textAlign: 'center' },
          filter: false,
          sorter: false,
        },
        {
          key: 'ModuleName',
          label: 'Display Name',
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
          label: 'Company',
          _style: { fontWeight: '500' },
          filter: false,
          sorter: false,
        },
        {
          key: 'StatusReason',
          label: 'Status',
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
        {
          key: 'StatusReason',
          label: 'Updated at',
          _style: { fontWeight: '500'},
          filter: false,
          sorter: false,
        },
        {
          key: 'StatusReason',
          label: 'Status Reason',
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
      
}
