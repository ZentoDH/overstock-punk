import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Subject, of as observableOf } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap, map, catchError, takeUntil, shareReplay } from 'rxjs/operators';
import { FavouriteListComponent } from 'src/app/_bottomSheets/favourite-list/favourite-list.component';
import { DialogService } from 'src/app/_dialogs/dialog.service';
import { Beer } from 'src/app/_models/beer.model';
import { BeerService } from '../beer.service';


@Component({
  selector: 'app-beer-list',
  templateUrl: './beer-list.component.html',
  styleUrls: ['./beer-list.component.scss']
})
export class BeerListComponent implements AfterViewInit {
  displayedColumns: string[] = ['favourites', 'name', 'tagline', 'first_brewed'];
  pageSizeOptions: number[] = [5, 10, 25, 50, 80];
  pageSize: number = 5;

  data: Beer[] = []

  favourites: Beer[];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  private ngUnsubscribe = new Subject();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private beerService: BeerService,
    private dialogService: DialogService,
    private _bottomSheet: MatBottomSheet
  ) {
    this.beerService.$favourites.pipe(shareReplay()).subscribe(favourites => {
      this.favourites = favourites
    });
   }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe),
        startWith([]),
        switchMap(statuses => {
          this.isLoadingResults = true;

          return this.beerService.getBeers(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize)
        }),
        map(response => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          // Api doesn't return total beers, so hardcoded
          // It's generally a bad practice to not include total items
          this.resultsLength = 325;

          return response;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => { this.data = data });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updatePageSize(size: number) {
    this.paginator._changePageSize(size);
    this.pageSize = size;
  }

  openBeerDetails(beer: Beer) {
    this.dialogService.beerDetails(beer).subscribe();
  }

  openFavourites() {
    this._bottomSheet.open(FavouriteListComponent);
  }

  addToFavourites(beer: Beer) {
    this.beerService.addToFavourites(beer)
  }

  removeFromFavourites(beer: Beer) {
    this.beerService.removeFromFavourites(beer);
  }

  isInFavourites(beer: Beer): boolean {
    if(this.favourites.find(favourites => favourites.id === beer.id)) {
      return true;
    } else {
      return false;
    }
  }

}
