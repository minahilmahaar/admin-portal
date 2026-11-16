/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { NgxMonacoEditorConfig } from 'ngx-monaco-editor-v2';
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

