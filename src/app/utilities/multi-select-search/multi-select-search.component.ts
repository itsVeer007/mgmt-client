import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-multi-select-search',
  templateUrl: './multi-select-search.component.html',
  styleUrls: ['./multi-select-search.component.css']
})
export class MultiSelectSearchComponent implements OnInit {

  @ViewChild('search') searchTextBox!: ElementRef;

  selectFormControl = new FormControl();
  searchTextboxControl = new FormControl();
  selectedValues = [];
  data: string[] = [
    'US00010',
    'US00011',
    'US00012',
    'US00013',
    'US00014',
    'US00015',
  ]

  filteredOptions!: Observable<any>;

  ngOnInit() {
    this.filteredOptions = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this.filter(name))
      );
  }

  filter(name: string) {
    const filterValue = name.toLowerCase();
    this.selectFormControl.patchValue(this.selectedValues);
    let filteredList = this.data.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }


}
