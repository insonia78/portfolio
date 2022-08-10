import { Subject } from '@spidersmart/ng';

export interface AppContextCenter {
    id: number;
    label: string;
    name: string;
    subjects?: Subject[];
}
