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
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    public snackBar: MatSnackBar,
    private router: Router    
  ) { }

  ngOnInit(): void {
    this.getAllMovies();
    this.getUserProfile();    
  }

  getUserProfile(): void {    
    this.user = this.fetchApiData.getOneUser();
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.FavoriteMovies = resp.filter((movie: any) =>  
        this.user.FavoriteMovies.includes(movie._id));      
      console.log('Favorite',this.FavoriteMovies);    
      return this.user;
    })
  }
  
   // Retrieves all the movies. It is used with filter to get the favorite
  getAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  openMovieGenreDialog(name: string, description: string): void {

  }

  openMovieDirectorDialog(name: string, Biography: string): void {

  }

  openMovieDetailsDialog(description: string): void {

  }

  addOrDeleteMovieFromFavorite(movie_id: string): void {
    if (this.isFavoriteMovie(movie_id)) {
      // Movie is already in Favorite Movie List, then remove it from that list
      console.log('Removing movie_id: ', movie_id)
      this.fetchApiData.deleteMovieFavoriteMovies(movie_id)
      .subscribe(user => this.user = user);      
    } else {
      console.log('Adding movie_id: ',movie_id);
      // Movie is not in Favorite Movie List, then add it to that list
      this.fetchApiData.addMovieFavoriteMovies(movie_id);
      // .subscribe(user => this.user = user);     
    }    
  }
  
  removeMovieFromFavorite(movie_id: string): void {
    if( this.isFavoriteMovie(movie_id)) {
      console.log('Removing movie_id: ', movie_id);
      this.fetchApiData.deleteMovieFavoriteMovies(movie_id)
      .subscribe(user => this.user = user);
    }
  }

  isFavoriteMovie(movie_id: string): boolean {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    let res = user.FavoriteMovies.includes(movie_id);
    console.log(res);
    return res;    
  }

  deleUserAccount(): void{
    if(confirm('Do you want to delete your account permanently?')) {
      this.router.navigate(['welcome']).then(() => {
        localStorage.clear();
        this.snackBar.open('Your account has been deleted', 'OK', {
          duration: 3000
        });
      })
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
      });
    }
  }
  
  updateUserAccount() : void{
    if(confirm('Do you want to update your user account?')) {
      this.router.navigate(['welcome']).then(() => {
        localStorage.clear();
        this.snackBar.open('Your account has been updated', 'OK', {
          duration: 3000
        });
      })
      // this.fetchApiData.editUser().subscribe((result) => {
      //   console.log(result);
      // });
    }
  }

}
