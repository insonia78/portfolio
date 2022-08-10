import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Contact, EmptyContact, ContactType, ContactTypeDisplay, TextMask } from '@spidersmart/core';

@Component({
    selector: 'sm-contacts',
    templateUrl: './contacts.component.html'
})
export class ContactsComponent implements OnInit, OnChanges {
    /** References to contact type enums */
    public ContactType = ContactType;
    public ContactTypeDisplay = ContactTypeDisplay;
    public TextMask = TextMask;
    /** The form to edit contacts in edit  mode */
    public form: FormGroup;
    /** The internal list of contacts */
    protected currentContacts: Contact[] = [];

    /** The contacts provided when loading */
    @Input()
    set contacts(contacts: Contact[]) {
        console.log('SETTING CONTACTS TO', contacts);
        if (contacts) {
            this.currentContacts = contacts;
        }
    }
    /** The current mode of the component */
    @Input() mode: 'VIEW' | 'EDIT' = 'VIEW';
    /** The layout type of the component */
    @Input() layout: 'LIST' = 'LIST';

    /** Output the current value of contacts */
    @Output() valueChange = new EventEmitter<Contact[]>();

    constructor(private fb: FormBuilder) {
        // define form structure
        this.form = this.fb.group({
            contacts: this.fb.array([
            ])
        });
    }

    /**
     * Generates the url for a link for a contact
     * @param contact The contact for which to generate a url
     * @return The generated url
     */
    public generateContactLink(contact: Contact): string {
        switch (contact.type) {
            case ContactType.HOME_PHONE:
            case ContactType.MOBILE_PHONE:
            case ContactType.WORK_PHONE:
                return 'tel:' + contact.value;
            case ContactType.EMAIL:
                return 'mailto:' + contact.value;
            default:
                return contact.value;
        }
    }

    /**
     * Returns the text mask which should be applied to the value field based on type field
     * @return The text mask object
     */
    public getTextMask(row: number): any {
        const type = (this.form.get('contacts') as FormArray).at(row).get('type').value;
        if ([ContactType.HOME_PHONE, ContactType.MOBILE_PHONE, ContactType.WORK_PHONE].includes(type)) {
            return TextMask.phone;
        }
        return { mask: false };
    }

    /**
     * Adds a new empty contact
     * @return void
     */
    public addContact(): void {
        if (this.mode === 'EDIT') {
            this.currentContacts.push(EmptyContact);
            this.syncContactsToForm();
            this.emitChange();
        }
    }

    /**
     * Removes the contact at the given index
     * @param index The index at which the contact to remove exists
     * @return void
     */
    public removeContact(index: number): void {
        if (this.mode === 'EDIT') {
            this.currentContacts.splice(index, 1);
            this.syncContactsToForm();
        }
    }

    /**
     * Syncs the form to match the current contacts array
     * @return void
     */
    private syncContactsToForm(): void {
        if (this.mode === 'EDIT') {
            if (this.currentContacts) {
                const contactsArray: FormGroup[] = [];
                this.currentContacts.forEach(contact => {
                    contactsArray.push(this.fb.group(contact));
                });
                this.form.setControl('contacts', this.fb.array(contactsArray));
                this.form.get('contacts').valueChanges.subscribe(val => {
                    console.log('HIT B!');
                    this.currentContacts = val;
                    this.emitChange();
                });
            }
        }
    }

    /**
     * Emits the current contacts value
     * @return void
     */
    private emitChange(): void {
        this.valueChange.emit(this.currentContacts);
    }

    ngOnInit() {
        if (this.mode === 'EDIT') {
            this.form.get('contacts').valueChanges.subscribe(val => {
                this.currentContacts = val;
                this.emitChange();
                console.log('contacts change!!!');
            });
            console.log('INIT');
        }
    }

    ngOnChanges() {
        this.syncContactsToForm();
    }
}
