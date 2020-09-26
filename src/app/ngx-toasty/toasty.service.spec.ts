import { TestBed } from '@angular/core/testing';
import { ToastData, ToastOptions, ToastyConfig, ToastyEvent, ToastyEventType, ToastyService } from './toasty.service';

describe('ToastyService', () => {

    const toastOptions: ToastOptions = {
        title: 'title1',
        msg: 'message1',
        showClose: false,
        theme: 'toasty-theme-default',
        timeout: null,
        onAdd: null,
        onRemove: {} as any,
    };
    let toastyService: ToastyService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ToastyService, ToastyConfig],
        });

        toastyService = TestBed.inject(ToastyService);
    });

    it('is defined', () => {
        expect(ToastyService).toBeDefined();
        expect(toastyService instanceof ToastyService).toBeTruthy();
    });

    it('should call emitEvent when clearAll is called', () => {
        spyOn(toastyService, 'emitEvent');

        toastyService.clearAll();

        expect(toastyService.emitEvent).toHaveBeenCalledTimes(1);
        expect(toastyService.emitEvent).toHaveBeenCalledWith(new ToastyEvent(ToastyEventType.CLEAR_ALL));
    });

    it('should call emitEvent when clear is called', () => {
        spyOn(toastyService, 'emitEvent');

        toastyService.clear(101);

        expect(toastyService.emitEvent).toHaveBeenCalledTimes(1);
        expect(toastyService.emitEvent).toHaveBeenCalledWith(new ToastyEvent(ToastyEventType.CLEAR, 101));
    });

    it('should not do anything if we do not have an eventSource when calling emitEvent ', () => {
        toastyService.eventSource = null;

        toastyService.emitEvent(new ToastyEvent(ToastyEventType.CLEAR, 101));

        expect(toastyService.eventSource).toBeNull();
    });

    it(`should return true if we found the option`, () => {
        const actualResults =  toastyService._checkConfigItem(toastyService.config, toastOptions, 'msg');

        expect(actualResults).toEqual(true);
    });

    it(`should return false if the value of the option is false`, () => {
        const actualResults =  toastyService._checkConfigItem(toastyService.config, toastOptions, 'showClose');

        expect(actualResults).toEqual(false);
    });

    describe('create default toasty', () => {
        it('with string title', () => {
            // We listen our service to receive new toasts from it
            toastyService.events.subscribe((event: ToastyEvent) => {
                const toast: ToastData = event.value;
                expect(toast).not.toBeNull();
                expect(toast.id).not.toBeNull();
                expect(toast.title).toBe('Hi');
                expect(toast.msg).not.toBeDefined();
                expect(toast.showClose).toBe(true);
                expect(toast.type).toBe('toasty-type-default');
                expect(toast.theme).toBe('toasty-theme-default');
                expect(toast.onAdd).toBeNull();
                expect(toast.onRemove).toBeNull();
            });
            toastyService.default('Hi');
        });

        it('with number title', () => {
            // We listen our service to receive new toasts from it
            toastyService.events.subscribe((event: ToastyEvent) => {
                const toast: ToastData = event.value;
                expect(toast).not.toBeNull();
                expect(toast.id).not.toBeNull();
                expect(toast.title).toBe('1000');
                expect(toast.msg).not.toBeDefined();
                expect(toast.showClose).toBe(true);
                expect(toast.type).toBe('toasty-type-default');
                expect(toast.theme).toBe('toasty-theme-default');
                expect(toast.onAdd).toBeNull();
                expect(toast.onRemove).toBeNull();
            });
            toastyService.default(1000);
        });

        it('with ToastyOptions', () => {
            // Create options
            const options: ToastOptions = {
                title: 'Title',
                msg: 'message',
            };
            // We listen our service to receive new toasts from it
            toastyService.events.subscribe((event: ToastyEvent) => {
                const toast: ToastData = event.value;
                expect(toast).not.toBeNull();
                expect(toast.id).not.toBeNull();
                expect(toast.title).toBe(options.title);
                expect(toast.msg).toBe(options.msg);
                expect(toast.showClose).toBe(true);
                expect(toast.type).toBe('toasty-type-default');
                expect(toast.theme).toBe('toasty-theme-default');
                expect(toast.onAdd).toBeNull();
                expect(toast.onRemove).toBeNull();
            });
            toastyService.default(options);
        });

        it('and call onAdd function', () => {
            // Create options
            const options: ToastOptions = {
                title: 'Title',
                msg: 'message',
                onAdd: (toast: ToastData) => {
                    expect(toast).toBeDefined();
                    expect(toast.id).not.toBeNull();
                    expect(toast.title).toBe(options.title);
                    expect(toast.msg).toBe(options.msg);
                    expect(toast.showClose).toBe(true);
                    expect(toast.type).toBe('toasty-type-default');
                    expect(toast.theme).toBe('toasty-theme-default');
                    expect(toast.onAdd).not.toBeNull();
                    expect(toast.onRemove).toBeNull();
                },
            };
            // We listen our service to receive new toasts from it
            toastyService.events.subscribe((event: ToastyEvent) => {});
            toastyService.default(options);
        });
    });

    describe('create toasty', () => {
        it('of info type', () => {
            // We listen our service to receive new toasts from it
            toastyService.events.subscribe((event: ToastyEvent) => {
                const toast: ToastData = event.value;
                expect(toast).not.toBeNull();
                expect(toast.id).not.toBeNull();
                expect(toast.title).toBe('Hi');
                expect(toast.msg).not.toBeDefined();
                expect(toast.showClose).toBe(true);
                expect(toast.type).toBe('toasty-type-info');
                expect(toast.theme).toBe('toasty-theme-default');
                expect(toast.onAdd).toBeNull();
                expect(toast.onRemove).toBeNull();
            });
            toastyService.info('Hi');
        });

        it('of success type', () => {
            // We listen our service to receive new toasts from it
            toastyService.events.subscribe((event: ToastyEvent) => {
                const toast: ToastData = event.value;
                expect(toast).not.toBeNull();
                expect(toast.id).not.toBeNull();
                expect(toast.title).toBe('Hi');
                expect(toast.msg).not.toBeDefined();
                expect(toast.showClose).toBe(true);
                expect(toast.type).toBe('toasty-type-success');
                expect(toast.theme).toBe('toasty-theme-default');
                expect(toast.onAdd).toBeNull();
                expect(toast.onRemove).toBeNull();
            });
            toastyService.success('Hi');
        });

        it('of wait type', () => {
            // We listen our service to receive new toasts from it
            toastyService.events.subscribe((event: ToastyEvent) => {
                const toast: ToastData = event.value;
                expect(toast).not.toBeNull();
                expect(toast.id).not.toBeNull();
                expect(toast.title).toBe('Hi');
                expect(toast.msg).not.toBeDefined();
                expect(toast.showClose).toBe(true);
                expect(toast.type).toBe('toasty-type-wait');
                expect(toast.theme).toBe('toasty-theme-default');
                expect(toast.onAdd).toBeNull();
                expect(toast.onRemove).toBeNull();
            });
            toastyService.wait('Hi');
        });

        it('of error type', () => {
            // We listen our service to receive new toasts from it
            toastyService.events.subscribe((event: ToastyEvent) => {
                const toast: ToastData = event.value;
                expect(toast).not.toBeNull();
                expect(toast.id).not.toBeNull();
                expect(toast.title).toBe('Hi');
                expect(toast.msg).not.toBeDefined();
                expect(toast.showClose).toBe(true);
                expect(toast.type).toBe('toasty-type-error');
                expect(toast.theme).toBe('toasty-theme-default');
                expect(toast.onAdd).toBeNull();
                expect(toast.onRemove).toBeNull();
            });
            toastyService.error('Hi');
        });

        it('of warning type', () => {
            // We listen our service to receive new toasts from it
            toastyService.events.subscribe((event: ToastyEvent) => {
                const toast: ToastData = event.value;
                expect(toast).not.toBeNull();
                expect(toast.id).not.toBeNull();
                expect(toast.title).toBe('Hi');
                expect(toast.msg).not.toBeDefined();
                expect(toast.showClose).toBe(true);
                expect(toast.type).toBe('toasty-type-warning');
                expect(toast.theme).toBe('toasty-theme-default');
                expect(toast.onAdd).toBeNull();
                expect(toast.onRemove).toBeNull();
            });
            toastyService.warning('Hi');
        });
    });

    describe('create toasty', () => {
        it('of material theme', () => {
            const options: ToastOptions = {
                title: 'Title',
                msg: 'message',
                theme: 'material',
            };
            // We listen our service to receive new toasts from it
            toastyService.events.subscribe((event: ToastyEvent) => {
                const toast: ToastData = event.value;
                expect(toast).not.toBeNull();
                expect(toast.id).not.toBeNull();
                expect(toast.title).toBe(options.title);
                expect(toast.msg).toBe(options.msg);
                expect(toast.showClose).toBe(true);
                expect(toast.type).toBe('toasty-type-default');
                expect(toast.theme).toBe('toasty-theme-material');
                expect(toast.onAdd).toBeNull();
                expect(toast.onRemove).toBeNull();
            });
            toastyService.default(options);
        });

        it('of bootstrap theme', () => {
            const options: ToastOptions = {
                title: 'Title',
                msg: 'message',
                theme: 'bootstrap',
            };
            // We listen our service to receive new toasts from it
            toastyService.events.subscribe((event: ToastyEvent) => {
                const toast: ToastData = event.value;
                expect(toast).not.toBeNull();
                expect(toast.id).not.toBeNull();
                expect(toast.title).toBe(options.title);
                expect(toast.msg).toBe(options.msg);
                expect(toast.showClose).toBe(true);
                expect(toast.type).toBe('toasty-type-default');
                expect(toast.theme).toBe('toasty-theme-bootstrap');
                expect(toast.onAdd).toBeNull();
                expect(toast.onRemove).toBeNull();
            });
            toastyService.default(options);
        });
    });
});
