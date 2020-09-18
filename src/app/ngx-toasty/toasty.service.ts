// Copyright (C) 2016-2017 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-toasty

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { isString, isNumber, isFunction } from './toasty.utils';

/**
 * Options to configure specific Toast
 */
@Injectable()
export class ToastOptions {
    title: string;
    msg?: string;
    showClose?: boolean;
    theme?: string;
    timeout?: number;
    // tslint:disable-next-line: ban-types
    onAdd?: Function;
    // tslint:disable-next-line: ban-types
    onRemove?: Function;
}

/**
 * Structure of Toast
 */
@Injectable()
export class ToastData {
    id: number;
    title: string;
    msg: string;
    showClose: boolean;
    type: string;
    theme: string;
    timeout: number;
    // tslint:disable-next-line: ban-types
    onAdd: Function;
    // tslint:disable-next-line: ban-types
    onRemove: Function;
    // tslint:disable-next-line: ban-types
    onClick: Function;
}

/**
 * Default configuration for all toasts and toasty container
 */
@Injectable()
export class ToastyConfig {
    // Maximum number of toasties to show at once
    limit = 5;

    // Whether to show the 'X' icon to close the toast
    showClose = true;

    // The window position where the toast pops up
    position:
        | 'bottom-right'
        | 'bottom-left'
        | 'top-right'
        | 'top-left'
        | 'top-center'
        | 'bottom-center'
        | 'center-center' = 'bottom-right';

    // How long (in milliseconds) the toasty shows before it's removed. Set to null/0 to turn off.
    timeout = 5000;

    // What theme to use
    theme: 'default' | 'material' | 'bootstrap' = 'default';
}

export enum ToastyEventType {
    ADD,
    CLEAR,
    CLEAR_ALL,
}

export class ToastyEvent {
    constructor(public type: ToastyEventType, public value?: any) {}
}

export function toastyServiceFactory(config: ToastyConfig): ToastyService {
    return new ToastyService(config);
}

/**
 * Toasty service helps create different kinds of Toasts
 */
@Injectable()
export class ToastyService {
    // Allowed THEMES
    static THEMES: Array<string> = ['default', 'material', 'bootstrap'];
    // Init the counter
    uniqueCounter = 0;
    // ToastData event emitter
    // private toastsEmitter: EventEmitter<ToastData> = new EventEmitter<ToastData>();
    // Clear event emitter
    // private clearEmitter: EventEmitter<number> = new EventEmitter<number>();

    private eventSource: Subject<ToastyEvent> = new Subject<ToastyEvent>();
    public events: Observable<ToastyEvent> = this.eventSource.asObservable();

    constructor(private config: ToastyConfig) {}

    /**
     * Get list of toasts
     */
    // getToasts(): Observable<ToastData> {
    //   return this.toastsEmitter.asObservable();
    // }

    // getClear(): Observable<number> {
    //   return this.clearEmitter.asObservable();
    // }

    /**
     * Create Toast of a default type
     */
    default(options: ToastOptions | string | number): void {
        this.add(options, 'default');
    }

    /**
     * Create Toast of info type
     */
    info(options: ToastOptions | string | number): void {
        this.add(options, 'info');
    }

    /**
     * Create Toast of success type
     */
    success(options: ToastOptions | string | number): void {
        this.add(options, 'success');
    }

    /**
     * Create Toast of wait type
     */
    wait(options: ToastOptions | string | number): void {
        this.add(options, 'wait');
    }

    /**
     * Create Toast of error type
     */
    error(options: ToastOptions | string | number): void {
        this.add(options, 'error');
    }

    /**
     * Create Toast of warning type
     */
    warning(options: ToastOptions | string | number): void {
        this.add(options, 'warning');
    }

    // Add a new toast item
    private add(options: ToastOptions | string | number, type: string) {
        let toastyOptions: ToastOptions;

        if ((isString(options) && options !== '') || isNumber(options)) {
            toastyOptions = {
                title: options.toString(),
            } as ToastOptions;
        } else {
            toastyOptions = options as ToastOptions;
        }

        if (!toastyOptions || (!toastyOptions.title && !toastyOptions.msg)) {
            throw new Error('ng2-toasty: No toast title or message specified!');
        }

        type = type || 'default';

        // Set a unique counter for an id
        this.uniqueCounter++;

        // Set the local vs global config items
        const showClose = this._checkConfigItem(this.config, toastyOptions, 'showClose');

        // If we have a theme set, make sure it's a valid one
        let theme: string;
        if (toastyOptions.theme) {
            theme = ToastyService.THEMES.indexOf(toastyOptions.theme) > -1 ? toastyOptions.theme : this.config.theme;
        } else {
            theme = this.config.theme;
        }

        const toast: ToastData = {
            id: this.uniqueCounter,
            title: toastyOptions.title,
            msg: toastyOptions.msg,
            showClose,
            type: 'toasty-type-' + type,
            theme: 'toasty-theme-' + theme,
            onAdd: toastyOptions.onAdd && isFunction(toastyOptions.onAdd) ? toastyOptions.onAdd : null,
            onRemove: toastyOptions.onRemove && isFunction(toastyOptions.onRemove) ? toastyOptions.onRemove : null,
        } as ToastData;

        // If there's a timeout individually or globally, set the toast to timeout
        // Allows a caller to pass null/0 and override the default. Can also set the default to null/0 to turn off.
        toast.timeout = toastyOptions.hasOwnProperty('timeout') ? toastyOptions.timeout : this.config.timeout;

        // Push up a new toast item
        // this.toastsSubscriber.next(toast);
        // this.toastsEmitter.next(toast);
        this.emitEvent(new ToastyEvent(ToastyEventType.ADD, toast));
        // If we have a onAdd function, call it here
        if (toastyOptions.onAdd && isFunction(toastyOptions.onAdd)) {
            toastyOptions.onAdd.call(this, toast);
        }
    }

    // Clear all toasts
    clearAll() {
        // this.clearEmitter.next(null);
        this.emitEvent(new ToastyEvent(ToastyEventType.CLEAR_ALL));
    }

    // Clear the specific one
    clear(id: number) {
        // this.clearEmitter.next(id);
        this.emitEvent(new ToastyEvent(ToastyEventType.CLEAR, id));
    }

    // Checks whether the local option is set, if not,
    // checks the global config
    private _checkConfigItem(config: any, options: any, property: string) {
        if (options[property] === false) {
            return false;
        } else if (!options[property]) {
            return config[property];
        } else {
            return true;
        }
    }

    private emitEvent(event: ToastyEvent) {
        if (this.eventSource) {
            // Push up a new event
            this.eventSource.next(event);
        }
    }
}
