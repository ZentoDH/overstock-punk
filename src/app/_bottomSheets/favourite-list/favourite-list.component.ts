import { Component, OnInit } from '@angular/core';
import { shareReplay } from 'rxjs/operators';
import { BeerService } from 'src/app/beers/beer.service';
import { DialogService } from 'src/app/_dialogs/dialog.service';
import { Beer } from 'src/app/_models/beer.model';

@Component({
  selector: 'app-favourite-list',
  templateUrl: './favourite-list.component.html',
  styleUrls: ['./favourite-list.component.scss']
})
export class FavouriteListComponent implements OnInit {
  favourites: Beer[];

  constructor(
    private beerService: BeerService,
    private dialogService: DialogService,
    ) { }

  ngOnInit(): void {
    this.beerService.$favourites.pipe(shareReplay()).subscribe(favourites => {
      this.favourites = favourites;
    })
  }

  openBeerDetails(beer: Beer) {
    this.dialogService.beerDetails(beer).subscribe();
  }

  removeFromFavourites(beer: Beer) {
    this.beerService.removeFromFavourites(beer);
  }

}
