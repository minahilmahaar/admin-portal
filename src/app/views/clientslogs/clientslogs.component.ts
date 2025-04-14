import { Component } from '@angular/core';
import {
  CardModule,
  LoadingButtonComponent,
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
  NavModule,
  TabsModule,
  ButtonGroupModule,
  ButtonModule,
  DropdownModule,
  FormModule,
  ListGroupModule,
  MultiSelectModule,
  SharedModule,
  DatePickerModule,
  DateRangePickerModule,
  TimePickerModule,
  LoadingButtonModule,
  TableModule,
  UtilitiesModule,
  BadgeModule,
  CollapseModule,
  SmartTableModule,
  ProgressBarDirective,
  ProgressComponent as ProgressComponent_1,
  ProgressBarComponent,
  ProgressStackedComponent,
  FormDirective,
  FormCheckComponent,
  FormCheckLabelDirective,
  ButtonGroupComponent,
} from '@coreui/angular-pro';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import { FormGroup,FormControl } from '@angular/forms';
import { Subject, from } from 'rxjs';
import { IconDirective } from '@coreui/icons-angular';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-clientslogs',
  standalone: true,
  imports: [
    Tabs2Module,
    IconModule,
    LoadingButtonComponent,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    BadgeComponent,
    ButtonDirective,
    CollapseDirective,
    SmartTableComponent,
    TemplateIdDirective,
    TextColorDirective,
    DatePickerModule,
    DateRangePickerModule,
    CommonModule,
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
    ToastModule,
    AlertModule,
    AlertComponent,
    AlertHeadingDirective,
    AlertLinkDirective,
    ButtonCloseDirective,
    IconDirective,
    ProgressBarDirective,
    ProgressComponent_1,
    ProgressBarComponent,
    ProgressStackedComponent,
    FormDirective,
    FormCheckComponent,
    FormCheckLabelDirective,
    ButtonGroupComponent,
  ],
  templateUrl: './clientslogs.component.html',
  styleUrl: './clientslogs.component.scss'
})
export class ClientslogsComponent {

  
  totalCount: any;
  Bar: boolean = false;
  Loading: Number = 0;
  public loading = new Array(4);
  TodaysDate = new Date();
  Data = [];
  fromdatejson: string = "";
  todatejson: string = "";

  private destroyed = new Subject<void>();

  MyForm: FormGroup = new FormGroup({
    FromDate : new FormControl(new Date()),
    ToDate : new FormControl(new Date()),
    ActivityType : new FormControl(""),
    Status : new FormControl("All"),
  });

  Columns = [
  {
    key: 'ModuleName',
    label: 'Column',
    filter: false,
    sorter: false,
  },
  {
    key: 'ActionName',
    label: 'Column',
    filter: false,
    sorter: false,
  },
  {
    key: 'RMHID',
    label: 'Column',
    filter: false,
    sorter: false,
    _style: { width: '7%' },
  },
  {
    key: 'ACDescription',
    label: 'Column',
    filter: false,
    sorter: false,
  },

  {
    key: 'IsActive',
    label: 'Column',
    filter: false,
    sorter: false,
  },

  {
    key: 'CreatedOnUTC',
    label: 'Column',
    filter: false,
    sorter: false,
    _style: { width: '16%' },
  }

  ];


  
async OnFormSubmit() {
  this.Data = [];
  this.totalCount = 0;
  this.loading[0] = setTimeout(() => {
    this.loading[0] = undefined;
  }, 300000);

  this.fromdatejson = this.MyForm.value.FromDate.toISOString().slice(0, -13);
  this.fromdatejson = this.fromdatejson + "00:01:00.000Z";
  this.todatejson = this.MyForm.value.ToDate.toISOString().slice(0,-13);
  this.todatejson = this.todatejson + "23:59:59.999Z";
  
   var body = {
    fromDate: this.fromdatejson,
    toDate  : this.todatejson,
    activityType : this.MyForm.value.ActivityType,
    status: this.MyForm.value.Status
    };

    
  console.log(body);

  // (await this.ActivityLogService.getActivityLog(body)).subscribe((res: any) => {
  //   ///alert('in');
  //   console.log(res);
  //   this.Data = res.ActivityLog;
  //   this.Data = this.Data.map(sale => {
  //     sale.CreatedOnUTC = this.datePipe.transform(sale.CreatedOnUTC, 'short');
  //     return sale;
  //   });
  //   console.log(this.Data);
  //   clearTimeout(this.loading[0]);
  //   this.loading[0] = undefined;
  //   this.totalCount = "Records Count: " + this.Data.length + " | ";
  // });

}


onCancel()
{

  this.MyForm.controls['FromDate'].setValue(new Date());
  this.MyForm.controls['ToDate'].setValue(new Date());
  this.MyForm.controls['ActivityType'].setValue("");
  this.MyForm.controls['Status'].setValue("All");
  this.Data = [];
  this.totalCount = 0;

}


onClick(idx: number): void {

  if (!!this.loading[idx]) {
    clearTimeout(this.loading[idx]);
    this.loading[idx] = undefined;
  } else {
    this.loading[idx] = setTimeout(() => {
      this.loading[idx] = undefined;
    }, 3000);
  }
}


}
