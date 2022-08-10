export enum SearchResultType{
  'student',
  'center',
  'assignment',
  'book'
}

export interface SearchResultDetailSubject{
  name: string;
  level: string;
}

export interface SearchResultDetailCenter{
  name: string;
  subjects: Array<SearchResultDetailSubject>;
}

export interface SearchResult {
  type: SearchResultType;
  name: string;
  centers?: string | string[];
  phone?: string;
  subject?: string;
  title?: string;
}
