import { Permission } from '@spidersmart/ng';

export interface NavigationItem {
    url?: any[];
    label: string;
    requiredPermissions: Permission[];
    icon?: string;
}
