import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Beer } from '../_models/beer.model';

@Injectable({
  providedIn: 'root'
})
export class BeerService {
  private _favourites = new BehaviorSubject<Beer[]>([])

  _apiUrl = environment.apiUrl;

  get $favourites() {
    return this._favourites.asObservable().pipe(
      map(beer => {
        if (beer) {
          return beer;
        } else {
          return [];
        }
      })
    );
  }

  constructor(private http: HttpClient) { }

  getBeers(page: number, per_page: number): Observable<Beer[]> {
    let paramsUrl = paramUrlGenerator({ page, per_page });
    return this.http.get<Beer[]>(`${this._apiUrl}/beers${paramsUrl}`);
  }

  addToFavourites(beer: Beer) {
    const beers = this._favourites.getValue();
    if (beers) {
      this._favourites.next([...beers, beer]);
    } else {
      this._favourites.next([beer]);
    }
  }

  removeFromFavourites(beer: Beer) {
    const beers = this._favourites.getValue();
    this._favourites.next(beers.filter(favourite => favourite.id !== beer.id))
  }
}

const paramUrlGenerator = (params: object) => {
  let paramstring = '';

  for (const key in params) {
    if ((params as any)[key] == 0 || (params as any)[key]) {
      paramstring === '' ? paramstring += '?' : paramstring += '&'
      paramstring += `${key}=${(params as any)[key]}`
    }
  }

  return paramstring
}
