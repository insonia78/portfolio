export const TextMask = {
    phone: {
        mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
        unmask: (val: string) => {
            return val.replace(/\D+/g, '');
        }
    }
};
