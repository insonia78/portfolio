import { PageActionDirective } from '../enums/page-action-directive.enum';

export interface PageAction {
    id: string;
    type: 'icon' | 'primary' | 'secondary' | 'tertiary';
    actionType?: 'route' | 'method' | 'directive';
    route?: any[];
    action?: Function;
    directive?: PageActionDirective;
    text?: string;
    icon?: string;
    parameters?: any[];
    data?: object;
}
