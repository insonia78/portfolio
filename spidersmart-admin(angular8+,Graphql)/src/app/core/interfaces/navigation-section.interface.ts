import { MatMenu } from '@angular/material/menu';
import { Context } from '../enums/context.enum';
import { NavigationItem } from './navigation-item.interface';
import { Permission } from '@spidersmart/ng';

export interface NavigationSection {
    id: Context;
    label: string;
    requiredPermissions: Permission[];
    subItems?: NavigationItem[];
    trigger?: () => MatMenu;
}
