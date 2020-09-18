// Copyright (C) 2016-2017 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-toasty

import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ToastData } from './toasty.service';

/**
 * A Toast component shows message with title and close button.
 */
@Component({
    // tslint:disable-next-line: component-selector
    selector: 'ngx-toast',
    template: ` <div class="toast" [ngClass]="[toast.type, toast.theme]">
        <div *ngIf="toast.showClose" class="close-button" (click)="close($event)"></div>
        <div *ngIf="toast.title || toast.msg" class="toast-text">
            <span *ngIf="toast.title" class="toast-title" [innerHTML]="toast.title | safeHtml"></span>
            <br *ngIf="toast.title && toast.msg" />
            <span *ngIf="toast.msg" class="toast-msg" [innerHtml]="toast.msg | safeHtml"></span>
        </div>
    </div>`,
})
export class ToastComponent {
    @Input() toast: ToastData;
    // tslint:disable-next-line: no-output-rename
    @Output('closeToast') closeToastEvent = new EventEmitter();

    /**
     * Event handler invokes when user clicks on close button.
     * This method emit new event into ToastyContainer to close it.
     */
    close($event: any) {
        $event.preventDefault();
        this.closeToastEvent.next(this.toast);
    }
}
