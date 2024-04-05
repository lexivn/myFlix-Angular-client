import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrl: './user-profile-form.component.scss'
})
export class UserProfileFormComponent {  

   user: any = { Username: '', Password: '', FavoriteMovies: '', Email: '', Birthday: '' }
   startDate = new Date(1990, 0, 1);
  constructor(public fetchApiData: FetchApiDataService) { }

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    // this.fetchApiData.getOneUser().subscribe((resp: any) => {
    //   this.user = resp;
    //   console.log(this.user);
    //  return this.user; 
    // });
    this.user = this.fetchApiData.getOneUser();
    console.log(this.user);
    return this.user;

  }

}
