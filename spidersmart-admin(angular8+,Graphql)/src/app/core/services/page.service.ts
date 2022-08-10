import { Injectable, Directive } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { PageAction } from '../interfaces/page-action.interface';
import { PageError } from '../interfaces/page-error.interface';
import { PageMode } from '../enums/page-mode.enum';
import { Router } from '@angular/router';
import { PageActionDirective } from '../enums/page-action-directive.enum';

/**
 * Provides access to retrieve and manipulate page decorations and status
 */
@Injectable({
    providedIn: 'root'
})
export class PageService {
    /** The page title */
    private title = new BehaviorSubject<string>('');

    /** The page mode */
    private mode = new BehaviorSubject<PageMode>(PageMode.VIEW);

    /** The page actions */
    private actions = new BehaviorSubject<PageAction[]>([]);

    /** If a reload action has been triggered and is pending execution */
    private pendingReload = new BehaviorSubject<boolean>(false);

    /** Whether the page is currently loading */
    private loading = new BehaviorSubject<boolean>(false);

    /** Current page errors */
    private errors = new BehaviorSubject<PageError[]>([]);

    /**
     * @ignore
     */
    constructor(
        private router: Router
    ) {}

    /**
     * Get the title of the page
     * @return Observable of the page title
     */
    public getTitle(): Observable<string> {
        return this.title;
    }

    /**
     * Set the title of the page
     * @param title The title to set
     */
    public setTitle(title: string): void {
        this.title.next(title);
    }

    /**
     * Get the mode of the page
     * @return Observable of the page mode
     */
    public getMode(): Observable<PageMode> {
        return this.mode;
    }

    /**
     * Returns whether the given mode is the currently set mode
     * @param mode The mode to compare against
     * @return boolean
     */
    public isMode(mode: PageMode): boolean {
        return this.mode.getValue() === mode;
    }

    /**
     * Set the mode of the page
     * @param mode The mode to set
     */
    public setMode(mode: PageMode): void {
        this.mode.next(mode);
    }

    /**
     * Clear the title of the page
     */
    public clearTitle(): void {
        this.title.next('');
    }

    /**
     * Returns all actions on the page
     * @return Observable of the page actions
     */
    public getActions(): Observable<PageAction[]> {
        return this.actions;
    }

    /**
     * Add an action to the page
     * @param action The action to add
     * @param config Overrides to apply to the given action
     */
    public addAction(action: PageAction, config: object | null = null): void {
        if (config) {
            action = Object.assign(action, config);
        }
        this.actions.pipe(take(1)).subscribe(actions => {
            if (!actions.includes(action)) {
                actions.push(action);
                this.actions.next(actions);
            }
        });
    }

    /**
     * Add a routing action to the page
     * @param action The action to add
     * @param route The route to which the action should direct
     * @param config Overrides to apply to the given action
     */
    public addRoutingAction(action: PageAction, route: any[], config: object | null = null): void {
        this.addAction(Object.assign(action, {
            actionType: 'route',
            route: route
        }), config);
    }

    /**
     * Add a functional action to the page
     * @param action The action to add
     * @param method The method to trigger with the action
     * @param parameters Any parameters to send to the method
     * @param config Overrides to apply to the given action
     */
    public addFunctionAction(action: PageAction, method: Function, parameters: any[] = [], config: object | null = null): void {
        this.addAction(Object.assign(action, {
            actionType: 'method',
            action: method,
            parameters: parameters
        }), config);
    }

    /**
     * Add a functional action to the page
     * @param action The action to add
     * @param directive The directive to trigger
     * @param data Any data needed for the directive
     * @param config Overrides to apply to the given action
     */
    public addDirectiveAction(action: PageAction, directive: PageActionDirective, data: object, config: object | null = null): void {
        this.addAction(Object.assign(action, {
            actionType: 'directive',
            directive: directive,
            data: data
        }), config);
    }

    /**
     * Remove an action from the page
     * @param action The action to remove
     */
    public removeAction(action: PageAction): void {
        this.actions.pipe(take(1)).subscribe(actions => {
            const index = actions.findIndex(a => a.id === action.id);
            if (index !== -1) {
                actions.splice(index, 1);
                this.actions.next(actions);
            }
        });
    }

    /**
     * Clears all actions from the page
     */
    public clearActions(): void {
        this.actions.next([]);
    }

    /**
     * Triggers an action to be executed
     * @param action The action to execute
     * @param parameters Any additional parameters to send to the called action
     */
    public triggerAction(action: PageAction, ...parameters): void {
        const params = (action.parameters) ? action.parameters.concat(parameters) : parameters;
        action.parameters = params;
        if (action.actionType === 'route' && action.hasOwnProperty('route')) {
          this.router.navigate(action.route);
        }
        else if (action.actionType === 'method' && action.hasOwnProperty('action')) {
          action.action(action.parameters);
        }
    }

    /**
     * Triggers a reload to be executed
     */
    public triggerReload(): void {
        this.pendingReload.next(true);
    }

    /**
     * Marks the pending reload pending as executed
     */
    public completeTriggeredReload(): void {
        this.pendingReload.next(false);
    }

    /**
     * Reference to the triggered reload status which is pending execution
     * @return Whether a reload is pending execution
     */
    public getReloadTriggered(): Observable<boolean> {
        return this.pendingReload;
    }

    /**
     * Get whether the page is loading or not
     * @return Observable of the page loading status
     */
    public getLoading(): Observable<boolean> {
        return this.loading;
    }

    /**
     * Set whether the page is loading or not
     * @param loading Whether the page is loading
     */
    public setLoading(loading: boolean): void {
        this.loading.next(loading);
    }

    /**
     * Get any errors on the page
     * @return An observable of the current errors on the page
     */
    public getErrors(): Observable<PageError[]> {
        return this.errors;
    }

    /**
     * Get only field message errors for forms
     * @return An observable of current field errors on the page
     */
    public getFieldErrors(): Observable<PageError[]> {
        return this.errors.pipe(map((error: PageError[]) => {
            return error.filter((err: PageError) => err.context === 'field');
        }));
    }

    /**
     * Get only page message errors
     * @return An observable of current page errors on the page
     */
    public getPageErrors(): Observable<PageError[]> {
        return this.errors.pipe(map((error: PageError[]) => {
            return error.filter((err: PageError) => err.context === 'page');
        }));
    }

    /**
     * Adds an error to the page
     * @param error The error to add to the page
     */
    public addError(error: PageError): void {
        console.log('add error', error);
        this.errors.pipe(take(1)).subscribe(errors => {
            console.log('current errors', errors);
            if (!errors.includes(error)) {
                errors.push(error);
                this.errors.next(errors);
            }
        });
    }

    /**
     * Removes an error from the page
     * @param error The error to remove from the page
     */
    public removeError(error: PageError): void {
        this.errors.pipe(take(1)).subscribe(errors => {
            const adjustedErrors = errors.filter(err => err !== error);
            this.errors.next(adjustedErrors);
        });
    }

    /**
     * Clear all errors
     */
    public clearErrors(): void {
        this.errors.next([]);
    }

    /**
     * Clear all page errors
     */
    public clearPageErrors(): void {
        this.errors.pipe(take(1)).subscribe(errors => {
            const adjustedErrors = errors.filter(err => err.context !== 'page');
            this.errors.next(adjustedErrors);
        });
    }

    /**
     * Clear all field errors
     */
    public clearFieldErrors(): void {
        this.errors.pipe(take(1)).subscribe(errors => {
            const adjustedErrors = errors.filter(err => err.context !== 'field');
            this.errors.next(adjustedErrors);
        });
    }

    /**
     * Returns backwards in history
     * TODO: Update this to be smarter
     */
    public goBack(): void {
        window.history.go(-1);
    }
}
