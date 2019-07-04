import { Component, OnInit ,ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { of, fromEvent,Observable } from "rxjs";
import { debounceTime, map,distinctUntilChanged,switchMap,tap } from "rxjs/operators";

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {
  @ViewChild('carSearchInput') carSearchInput: ElementRef;
  @Output() setcarNameEvent = new EventEmitter<{name: string}>();

  cars: any = [];
  showSearches: boolean = false;
  isSearching:boolean = false;
  searchedCars: any = [];

  constructor() {
    this.cars = ['Audi', 'BMW', 'Bugatti', 'Ferrari', 'Ford', 'Lamborghini', 'Mercedes Benz', 'Porsche', 'Rolls-Royce', 'Volkswagen'];
    this.searchedCars = this.cars;
  }

  ngOnInit() {
  	this.carSearch();
  }

  getCars(name): Observable<any> {
    return of(this.filterCars(name))
  }

  filterCars(name) {
    return this.cars.filter((val) => val.toLowerCase().includes(name.toLowerCase()) == true )
  }

  carSearch() {
    const search$ = fromEvent(this.carSearchInput.nativeElement, 'keyup').pipe(
      map((event: any) => event.target.value),
      debounceTime(500),  
      distinctUntilChanged(),
      tap(()=> this.isSearching = true),
      switchMap((term) => term ? this.getCars(term) : of<any>(this.cars)),
      tap(() => {
        this.isSearching = false,
        this.showSearches = true;
      }));

      search$.subscribe(data => {
        this.isSearching = false
        this.searchedCars = data;
      })
  }

  setCarName(name) {
    this.searchedCars = this.filterCars(name);
    this.setcarNameEvent.emit({name});
    this.carSearchInput.nativeElement.value = name;
    this.showSearches = false;
  }

  trackById(index,item):void{
    return item._id;
  }

  closeDropDown():void {
    this.showSearches = false;
  }

}
