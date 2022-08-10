import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenu } from '@angular/material/menu';
import { Permission } from '@spidersmart/ng';
import { Context } from '../enums/context.enum';
import { NavigationSection } from '../interfaces/navigation-section.interface';
import { NavigationItem } from '../interfaces/navigation-item.interface';
import { AppContextService } from './app-context.service';

/**
 * Provides access to retrieve and maniuplate the top navigation display and status
 */
@Injectable({
    providedIn: 'root'
})
export class TopNavigationService {
    /** Internal representation of the navigation menu structure */
    private topNavigationMenu: NavigationSection[] = [];

    /**
     * @ignore
     */
    constructor(
        private router: Router,
        private appContextService: AppContextService
    ) {}

    /**
     * Adds a new section to the top menu
     * @param section The section to add
     * @param label The menu label of the section
     * @param requiredPermissions Permissions which allow access to the section
     */
    public addSection(section: Context, label: string, requiredPermissions: Permission[] = []): void {
        this.topNavigationMenu.push({
            id: section,
            label: label,
            requiredPermissions: requiredPermissions
        });
    }

    /**
     * Updates the given section to the given label
     * @param section The section which should be updated
     * @param label The new label if any
     */
    public updateSectionLabel(section: Context, label: string): void {
        const sectionIndex = this.topNavigationMenu.findIndex(sct => sct.id === section);
        if (sectionIndex !== -1) {
            this.topNavigationMenu[sectionIndex].label = label;
        }
    }

    /**
     * Adds a new item to a section's menu
     * @param section The section to which the item should be added
     * @param label The menu label for the item
     * @param route The route to which the item points
     * @param requiredPermissions Permissions which allow access to the item
     * @param icon The icon which should appear with the item (in mobile view)
     */
    public addItem(section: Context, label: string, route: any[], requiredPermissions: Permission[] = [], icon: string = null): void {
        // manually lookup section instead of relying on this.getSection() to prevent access restrictions based on previously added items
        const navItem = this.topNavigationMenu.find(sec => (sec.id === section)) || null;
        if (navItem) {
            navItem.subItems = navItem.subItems || [];
            navItem.subItems.push({
                label: label,
                url: route,
                requiredPermissions: requiredPermissions,
                icon: icon
            });
        }
    }

    /**
     * Adds a trigger action to a section
     * @param section The section to which the menu should be associated
     * @param trigger The action which should be triggered upon the trigger being activated
     */
    public addSectionTrigger(section: Context, trigger: () => MatMenu): void {
        const navItem = this.getSection(section);
        if (navItem) {
            navItem.trigger = trigger;
        }
    }

    /**
     * Returns the list of sections in the navigation menu
     * @return The list of sections
     */
    public getSectionList(): Context[] {
        return this.topNavigationMenu.filter(section => this.canAccessSection(section)).map(section => section.id);
    }

    /**
     * Returns the details of the requested section
     * @param section The section for which details should be returned
     * @param ignorePermissions Whether to return the section regardless of if it can currently be accessed by the user
     * @return The section details
     */
    public getSection(section: Context, ignorePermissions = false): NavigationSection {
        return this.topNavigationMenu.find(sec => (sec.id === section && this.canAccessSection(sec))) || null;
    }

    /**
     * Returns the requested section's menu items
     * @param section The section for which menu items should be returned
     * @return The items in the given section
     */
    public getItems(section: Context): NavigationItem[] {
        if (this.getSection(section) === null) {
            return [];
        }
        return (this.getSection(section).subItems || []).filter(item => this.canAccessItem(item));
    }

    /**
     * Returns the section to which a given route belongs
     * @param route The route for which the section should be retrieved
     * @return The given context section
     */
    public getRouteSection(route: any[]): Context {
        const context = this.topNavigationMenu.find((section: NavigationSection) => {
            if (section.hasOwnProperty('subItems')) {
                return section.subItems.find((item: NavigationItem) => {
                    // Note, if there needs to be deeper-than-first level matching
                    // this will need to update to iteratively check each entry
                    // in the route and item url arrays
                    if (item.url[0].replace('/', '') === route[0]) {
                        return true;
                    }
                });
            }
        });

        return (context !== undefined && context !== null) ? Context[context.id] : null;
    }

    /**
     * Routes to the default landing page for a given section
     * @param section The section for which the default should be routed to
     */
    public routeToSectionDefault(section: Context): void {
        const items = this.getItems(section).filter(item => item.hasOwnProperty('url'));
        if (items.length > 0) {
            this.router.navigate(items[0].url);
        }
    }

    /**
     * Returns whether the given section has an action trigger
     * @param section The section to check
     * @return If the section has a trigger
     */
    public hasTrigger(section: Context): boolean {
        const trigger = this.getSection(section).trigger || null;
        return this.isValidTrigger(trigger);
    }

    /**
     * Determines if the given section can be accessed by the current user
     * @param section The section to check
     * @return True if it can be accesses by the current user
     */
    private canAccessSection(section: NavigationSection): boolean {
        // sections can only be accessed if at least one of their items can be
        if (section.hasOwnProperty('subItems') && section.subItems instanceof Array && section.subItems.length > 0) {
            const subItemCount = section.subItems.filter(subItem => this.canAccessItem(subItem)).length;
            if (subItemCount < 1) {
                return false;
            }
        }
        return this.appContextService.hasPermission(section.requiredPermissions);
    }

    /**
     * Determines if the given item can be accessed by the current user
     * @param section The section to check
     * @return True if it can be accesses by the current user
     */
    private canAccessItem(item: NavigationItem): boolean {
        return this.appContextService.hasPermission(item.requiredPermissions);
    }

    /**
     * Returns whether the given trigger is a valid trigger
     * @param trigger The trigger to check
     * @return If the trigger is valid
     */
    private isValidTrigger(trigger: Function): boolean {
        return (trigger instanceof Function && trigger() instanceof MatMenu);
    }
}
