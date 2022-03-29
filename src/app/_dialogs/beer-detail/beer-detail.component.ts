import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Beer } from 'src/app/_models/beer.model';

@Component({
  selector: 'app-beer-detail',
  templateUrl: './beer-detail.component.html',
  styleUrls: ['./beer-detail.component.scss']
})
export class BeerDetailComponent {
  beer: Beer;

  constructor(@Inject(MAT_DIALOG_DATA) beer: Beer) {
    this.beer = beer;
  }

}
