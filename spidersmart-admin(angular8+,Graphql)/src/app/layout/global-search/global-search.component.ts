import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { SearchResult, SearchResultType } from './search-result.interface';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit {
  quickSearchCtrl: FormControl;
  searchResults: Observable<SearchResult[]>;
  public SearchResultType = SearchResultType;

  results: any[] = [
    {
      type: SearchResultType.student,
      name: 'John Smith',
      centers: [
        {
          name: 'Gaithersburg',
          subjects: [
            {
              name: 'reading-writing',
              level: 1,
            },
            {
              name: 'math',
              level: 4
            }
          ]
        },
        {
          name: 'Germantown',
          subjects: [
            {
              name: 'reading-writing',
              level: 1,
            },
            {
              name: 'math',
              level: 4
            }
          ]
        }
      ],
      phone: '8885556666'
    },
    {
      type: SearchResultType.student,
      name: 'Johnathan Price',
      centers: [
        {
          name: 'Rockville',
          subjects: [
            {
              name: 'reading-writing',
              level: 1,
            },
            {
              name: 'math',
              level: 4
            }
          ]
        }
      ],
      phone: '885556666'
    },
    {
      type: SearchResultType.center,
      name: 'Gaithersburg',
      phone: '5556667777'
    },
    {
      type: SearchResultType.assignment,
      name: 'Algebraic Expressions'
    },
    {
      type: SearchResultType.book,
      name: 'Smith of the West'
    }
  ];


  constructor() {
    this.quickSearchCtrl = new FormControl();
    this.searchResults = this.quickSearchCtrl.valueChanges.pipe(
      startWith(null),
      map(result => result ? this.filterResults(result) : null)
    );
  }

  ngOnInit() {
  }

  filterResults(name: string) {
    if (name.length < 3) {
      return null;
    }
    return this.results.filter(result =>
      result.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

}
