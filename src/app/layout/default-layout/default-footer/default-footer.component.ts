import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular-pro';
import { GlobalobjectService } from '../../../globalobject.service';
@Component({
    selector: 'app-default-footer',
    templateUrl: './default-footer.component.html',
    styleUrls: ['./default-footer.component.scss'],
    standalone: true,
})
export class DefaultFooterComponent extends FooterComponent {
  constructor(public GlobalobjectService: GlobalobjectService) {
    super();
  }
}
