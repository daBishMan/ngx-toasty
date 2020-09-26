import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeHtmlPipe } from './shared';
import { ToastComponent } from './toast.component';
import { ToastyComponent } from './toasty.component';
import { ToastData, ToastyService, ToastyConfig, ToastyEvent, ToastyEventType } from './toasty.service';
// import * as toastyUtils from './toasty.utils';
describe('ToastyComponent', () => {
    let componentFixture: ComponentFixture<ToastyComponent>;
    let window: jasmine.SpyObj<Window>;

    const toast1: ToastData = {
        id: 1,
        title: 'title1',
        msg: 'message1',
        showClose: false,
        type: 'toasty-type-default',
        theme: 'toasty-theme-default',
        timeout: null,
        onAdd: null,
        onRemove: {} as any,
        onClick: null,
    };

    const toast2: ToastData = {
        id: 2,
        title: 'title2',
        msg: 'message2',
        showClose: false,
        type: 'toasty-type-default',
        theme: 'toasty-theme-default',
        timeout: null,
        onAdd: null,
        onRemove: () => {},
        onClick: null,
    };

    beforeEach(() => {
        window = jasmine.createSpyObj<Window>([ 'setTimeout' ]);
        TestBed.configureTestingModule({
            declarations: [ToastComponent, ToastyComponent, SafeHtmlPipe],
            providers: [ToastyService, ToastyConfig, {provide: 'Window', useValue: window}],
        }).compileComponents();
    });

    beforeEach(() => {
        componentFixture = TestBed.createComponent(ToastyComponent);
        componentFixture.detectChanges();
    });

    it('should be defined', () => {
        const element = componentFixture.elementRef.nativeElement;
        expect(element.querySelector('#toasty')).toBeDefined();
    });

    it(`should add the push the toast correctly`, () => {
        const component = componentFixture.componentInstance;
        component.toasts = [toast1, toast2];
        component.config.limit = 3;

        const toastData = new ToastData();

        component.add(toastData);

        expect(component.toasts.length).toEqual(3);
    });

    it(`should add the shift the toast correctly`, () => {
        const component = componentFixture.componentInstance;
        component.toasts = [toast1, toast2, toast1];
        component.config.limit = 3;

        const toastData = new ToastData();

        component.add(toastData);

        expect(component.toasts.length).toEqual(3);
    });

    it(`should call _setTimeout if we pass in a timeout`, () => {
        const component = componentFixture.componentInstance;
        spyOn(component, '_setTimeout');
        component.toasts = [toast1, toast2, toast1];
        component.config.limit = 3;

        const toastData = new ToastData();
        toastData.timeout = 2;

        component.add(toastData);

        expect(component.toasts.length).toEqual(3);
        expect(component._setTimeout).toHaveBeenCalledTimes(1);
    });

    it(`should clear the toast with Id provided`, () => {
        const component = componentFixture.componentInstance;
        component.toasts = [toast1, toast2];

        component.clear(toast1.id);

        expect(component.toasts.length).toEqual(1);
    });

    it(`should not clear the toast with Id that does not exist in the toast array`, () => {
        const component = componentFixture.componentInstance;
        component.toasts = [toast1, toast2];

        component.clear(999);

        expect(component.toasts.length).toEqual(2);
    });

    it(`should clear the toast if we do  pass in a function`, () => {
        const component = componentFixture.componentInstance;
        component.toasts = [toast1, toast2];

        component.clear(toast1.id);

        expect(component.toasts.length).toEqual(1);
    });

    it(`should throw and exception if toast Id is not found in the toasts array`, () => {
        expect(() => {
            componentFixture.componentInstance.clear(undefined);
        }).toThrowError();
    });

    it(`should clear all data`, () => {
        const component = componentFixture.componentInstance;
        component.toasts = [toast1, toast2];

        component.clearAll();

        expect(component.toasts.length).toEqual(0);
    });

    it(`should not do anything if we do not pass in the right ToastyEventType`, () => {
        // bad event intentionally
        const toastyEvent = new ToastyEvent(9 as ToastyEventType, toast1);
        spyOn(componentFixture.componentInstance, 'add');
        spyOn(componentFixture.componentInstance, 'clear');
        spyOn(componentFixture.componentInstance, 'clearAll');

        componentFixture.componentInstance.setupData(toastyEvent);

        expect(componentFixture.componentInstance.add).toHaveBeenCalledTimes(0);
        expect(componentFixture.componentInstance.clear).toHaveBeenCalledTimes(0);
        expect(componentFixture.componentInstance.clearAll).toHaveBeenCalledTimes(0);
    });

    it(`should call the add method if the ToastyEventType equals ADD`, () => {
        const toastyEvent = new ToastyEvent(ToastyEventType.ADD, toast1);
        spyOn(componentFixture.componentInstance, 'add');

        componentFixture.componentInstance.setupData(toastyEvent);

        expect(componentFixture.componentInstance.add).toHaveBeenCalledTimes(1);
        expect(componentFixture.componentInstance.add).toHaveBeenCalledWith(toastyEvent.value);
    });

    it(`should call the clear method if the ToastyEventType equals CLEAR`, () => {
        const toastyEvent = new ToastyEvent(ToastyEventType.CLEAR, toast1);
        spyOn(componentFixture.componentInstance, 'clear');

        componentFixture.componentInstance.setupData(toastyEvent);

        expect(componentFixture.componentInstance.clear).toHaveBeenCalledTimes(1);
        expect(componentFixture.componentInstance.clear).toHaveBeenCalledWith(toastyEvent.value);
    });

    it(`should call the clearAll method if the ToastyEventType equals CLEAR_ALL`, () => {
        const toastyEvent = new ToastyEvent(ToastyEventType.CLEAR_ALL, toast1);
        spyOn(componentFixture.componentInstance, 'clearAll');

        componentFixture.componentInstance.setupData(toastyEvent);

        expect(componentFixture.componentInstance.clearAll).toHaveBeenCalledTimes(1);
    });
    it('should update class if position property was not defined', () => {
        const element = componentFixture.nativeElement;
        componentFixture.detectChanges();
        expect(element.querySelector('#toasty').className).toBe('toasty-position-bottom-right');
    });

    it('should update class if position property was defined with wrong value', () => {
        const element = componentFixture.nativeElement;
        componentFixture.componentInstance.position = 'left';
        componentFixture.detectChanges();
        expect(element.querySelector('#toasty').className).toBe('toasty-position-bottom-right');
    });

    it('should update class if position property was defined with right value', () => {
        const element = componentFixture.nativeElement;
        componentFixture.componentInstance.position = 'bottom-center';
        componentFixture.detectChanges();
        expect(element.querySelector('#toasty').className).toBe('toasty-position-bottom-center');
    });

    it('should provide the child toast component if it was created via service', () => {
        const element = componentFixture.nativeElement;
        expect(componentFixture.componentInstance.toasts.length).toBe(0);
        expect(element.querySelector('#toasty').children.length).toBe(0);

        componentFixture.componentInstance.toasts.push(toast1);
        componentFixture.detectChanges();
        expect(element.querySelector('#toasty').children.length).toBe(1);
        expect(element.querySelector('#toasty').children[0].tagName).toBe('NGX-TOAST');
    });

    it('should clear specific toast by id', () => {
        const element = componentFixture.nativeElement;
        componentFixture.componentInstance.toasts.push(toast1);
        componentFixture.componentInstance.toasts.push(toast2);
        componentFixture.detectChanges();
        expect(element.querySelector('#toasty').children.length).toBe(2);

        componentFixture.componentInstance.clear(1);
        componentFixture.detectChanges();
        expect(element.querySelector('#toasty').children.length).toBe(1);
    });

    it('should clear all toasts', () => {
        const element = componentFixture.nativeElement;
        componentFixture.componentInstance.toasts.push(toast1);
        componentFixture.componentInstance.toasts.push(toast2);
        componentFixture.detectChanges();
        expect(element.querySelector('#toasty').children.length).toBe(2);

        componentFixture.componentInstance.clearAll();
        componentFixture.detectChanges();
        expect(element.querySelector('#toasty').children.length).toBe(0);
    });

    it('should call onRemove when clear specific toast by id', () => {
        const element = componentFixture.nativeElement;
        toast1.onRemove = (toast: ToastData) => {
            expect(toast).toBe(toast1);
        };
        componentFixture.componentInstance.toasts.push(toast1);
        componentFixture.componentInstance.toasts.push(toast2);
        componentFixture.detectChanges();
        expect(element.querySelector('#toasty').children.length).toBe(2);

        componentFixture.componentInstance.clear(1);
        componentFixture.detectChanges();
        expect(element.querySelector('#toasty').children.length).toBe(1);
    });

    it('should clear toast by closeToast method', () => {
        const element = componentFixture.nativeElement;
        toast1.onRemove = (toast: ToastData) => {
            expect(toast).toBe(toast1);
        };
        componentFixture.componentInstance.toasts.push(toast1);
        componentFixture.componentInstance.toasts.push(toast2);
        componentFixture.detectChanges();
        expect(element.querySelector('#toasty').children.length).toBe(2);

        componentFixture.componentInstance.closeToast(toast1);
        componentFixture.detectChanges();
        expect(element.querySelector('#toasty').children.length).toBe(1);
    });
});
