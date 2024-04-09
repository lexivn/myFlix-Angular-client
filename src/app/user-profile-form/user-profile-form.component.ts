import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { DirectorComponent } from '../director/director.component';
import { GenreComponent } from '../genre/genre.component';
import { publicDecrypt } from 'crypto';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrl: './user-profile-form.component.scss'
})
export class UserProfileFormComponent {  

   user: any = { Username: '', Password: '', FavoriteMovies: '', Email: '', Birthday: '' }
   startDate = new Date(1990, 0, 1);
   movies: any[] = [];
   FavoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    // public openMovieGenreDialog: movieGenre
  ) { }

  ngOnInit(): void {
    this.getAllMovies();
    this.getUserProfile();    
  }

  getUserProfile(): void {    
    this.user = this.fetchApiData.getOneUser();
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.FavoriteMovies = resp.filter((movie: any) => 
        this.user.FavoriteMovies.includes(movie._id) );
    console.log('Favorite',this.FavoriteMovies);
    })    
    //return this.user;
  }
  
   // Retrieves all the movies. It is used with filter to get the favorite
  getAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

}
