import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * @description Component representing a director card.
 * @selector 'app-director'
 * @templateUrl './director.component.html'
 * @styleUrls ['../director.component.scss']
 */
@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrl: './director.component.scss'
})
export class DirectorComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      Biography: string;
    }
  ) {}

}
