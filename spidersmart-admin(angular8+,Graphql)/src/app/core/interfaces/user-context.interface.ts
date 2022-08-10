import { Permission } from '@spidersmart/ng';
import { AppContextCenter } from '../interfaces/app-context-center.interface';

export interface UserContext {
    id: number;
    isImpersonating?: boolean;
    roles?: any[];
    permissions: Permission[];
    centers: AppContextCenter[];
}
