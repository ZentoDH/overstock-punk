import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Beer } from '../_models/beer.model';
import { BeerDetailComponent } from './beer-detail/beer-detail.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  private isMobileDevice() {
    return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  beerDetails(user: Beer): Observable<void> {
    let dialogRef;

    if (this.isMobileDevice()) {
      dialogRef = this.dialog.open(BeerDetailComponent, {
        data: user,
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
      });
    } else {
      dialogRef = this.dialog.open(BeerDetailComponent, {
        data: user,
        minWidth: '40vw',
        maxHeight: '95vh',
        hasBackdrop: true
      });
    }

    return dialogRef.afterClosed()
  }
}
