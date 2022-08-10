import { PageAction } from '../interfaces/page-action.interface';

export const PageActions = {
    create: <PageAction>{
        id: 'create',
        type: 'icon',
        text: 'Create',
        icon: 'add'
    },
    edit: <PageAction>{
        id: 'edit',
        type: 'icon',
        text: 'Edit',
        icon: 'edit'
    },
    impersonate: <PageAction>{
        id: 'impersonate',
        type: 'icon',
        text: 'Impersonate',
        icon: 'portrait'
    },
    delete: <PageAction>{
        id: 'delete',
        type: 'icon',
        text: 'Delete',
        icon: 'delete'
    },
    students: <PageAction>{
        id: 'students',
        type: 'icon',
        text: 'Students',
        icon: 'group_add'
    },
    levels: <PageAction>{
        id: 'levels',
        type: 'icon',
        text: 'Levels',
        icon: 'storage'
    },
    bookInventory: <PageAction>{
        id: 'book_inventory',
        type: 'icon',
        text: 'Manage Book Inventory',
        icon: 'menu_book'
    },
    assignment: <PageAction>{
        id: 'assignment',
        type: 'icon',
        text: 'View Assignment',
        icon: 'assignment'
    },
    print: <PageAction>{
        id: 'print',
        type: 'icon',
        text: 'Print',
        icon: 'print'
    },
    save: <PageAction>{
        id: 'save',
        type: 'primary',
        text: 'Save',
        icon: 'save'
    },
    cancel: <PageAction>{
        id: 'cancel',
        type: 'tertiary',
        text: 'Cancel',
        icon: 'clear'
    }
};
