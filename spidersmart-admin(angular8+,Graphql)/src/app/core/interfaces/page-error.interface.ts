export interface PageError {
    message: string;
    context: 'page'|'field';
    field?: string;
}
