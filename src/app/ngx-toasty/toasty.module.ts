// Copyright (C) 2016-2017 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-toasty

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './shared';
import { ToastComponent } from './toast.component';
import { ToastyComponent } from './toasty.component';
import { ToastyConfig, ToastyService, toastyServiceFactory } from './toasty.service';

export let moduleProviders = [
    ToastyConfig,
    { provide: ToastyService, useFactory: toastyServiceFactory, deps: [ToastyConfig] },
];

@NgModule({
    imports: [CommonModule],
    declarations: [ToastComponent, ToastyComponent, SafeHtmlPipe],
    exports: [ToastComponent, ToastyComponent],
    providers: moduleProviders,
})
export class ToastyModule {
    static forRoot(): ModuleWithProviders<ToastyModule> {
        return {
            ngModule: ToastyModule,
            providers: moduleProviders,
        };
    }
}
