import { Component, OnInit } from '@angular/core';
import { IconModule } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import {
  FormModule,
  NavModule,
  TabsModule,
  ButtonGroupModule,
  ButtonModule,
  DropdownModule,
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
  ProgressModule,
  Tabs2Module,
  CardModule,
  ButtonDirective,
  SmartTableComponent,
  TemplateIdDirective,
  TextColorDirective,
  ModalModule,
  GridModule,
  SpinnerModule,
  ToastModule,
  AlertModule,
} from '@coreui/angular-pro';
import { GlobalobjectService } from '../../globalobject.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-queryscreen',
  standalone: true,
  imports: [
    IconModule,
    Tabs2Module,
    CardModule,
    FormsModule,
    CommonModule,
    FormModule,
    ReactiveFormsModule,
    ButtonDirective,
    SmartTableComponent,
    TemplateIdDirective,
    TextColorDirective,
    ToastModule,
    NavModule,
    TabsModule,
    ButtonGroupModule,
    ButtonModule,
    DropdownModule,
    ListGroupModule,
    MultiSelectModule,
    SharedModule,
    DatePickerModule,
    DateRangePickerModule,
    TimePickerModule,
    IconModule,
    LoadingButtonModule,
    ModalModule,
    TableModule,
    UtilitiesModule,
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
    LoadingButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    ProgressModule,
  ],
  templateUrl: './queryscreen.component.html',
  styleUrl: './queryscreen.component.scss'
})
export class QueryscreenComponent {

  showToast: boolean = false;
  ToastMessage = '';
  ToastColor = '';
  
  myform = new FormGroup({
    Client: new FormControl(''),
    Database: new FormControl(''),
    Query: new FormControl(''),
  });

  OnFormSubmitted() {
    console.log(this.myform.value);
    ///this.globalObjectService.setQuery(this.myform.value.Query);
    ///this.router.navigate(['/queryresult']);
  }

}
