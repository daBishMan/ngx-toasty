import { Component, OnInit } from '@angular/core';
import { ToastyService, ToastyConfig } from './ngx-toasty/toasty.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.timeout = 7000;
    }

    ngOnInit() {}

    showSuccess() {
        this.toastyService.success('Success From our Own Toasty Service');
    }
    showError() {
        this.toastyService.error('Error From our Own Toasty Service');
    }

    showWarning() {
        this.toastyService.warning('Warning From our Own Toasty Service');
    }
    showInfo() {
        this.toastyService.info('Info From our Own Toasty Service');
    }
}
