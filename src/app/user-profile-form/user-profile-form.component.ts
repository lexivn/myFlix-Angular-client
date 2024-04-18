import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { DirectorComponent } from '../director/director.component';
import { GenreComponent } from '../genre/genre.component';
import { publicDecrypt } from 'crypto';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

/**
 * @description Component representing the user profile.
 * @selector 'app-user-profile-form'
 * @templateUrl './user-profile-form.component.html'
 * @styleUrls ['./user-profile-form.component.scss']
 */
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
    public dialog: MatDialog,
    private router: Router
  ) { }

  /**
   * first this component loaded, it will load the current user data, update localstorage
   */
  ngOnInit(): void {
    this.getAllMoviesOnInit();
    this.getUserProfile();
  }

  /**
   * Username and token will be taken from localstorage to send a request to the api for the users information
   * User profile page will then be able to display the users favorite movies list and their username, name, email, etc.
   * @returns user's data
   */
  getUserProfile(): void {
    this.user = this.fetchApiData.getOneUser();
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.FavoriteMovies = resp.filter((movie: any) =>
        this.user.FavoriteMovies.includes(movie._id));
      console.log('Favorite', this.FavoriteMovies);
      return this.user;
    })
  }


  /**
    * @description Make an API call to retrieve all movies on Init.
    * @returns {Observable<any>} - Observable for the API response containing all movies.
    */
  getAllMoviesOnInit(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * @description Open up a Dioalog showing the movie's genre.    
   */
  openMovieGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: {
        Name: name,
        Description: description
      },
      width: "500px"
    });
  }

  /**
    * @description Open up a Dioalog showing the movie's director.    
    */
  openMovieDirectorDialog(name: string, biography: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Biography: biography
      },
      width: "50%"
    });
  }

  /**
   * @description Open up a Dioalog showing the movie's sypnosis.    
   */
  openMovieDetailsDialog(description: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Description: description
      },
      width: "50%"
    });
  }

  /**
   * @description adds a movie to the users list of favorite movies
   * @param {string} movie_id
   */
  addOrDeleteMovieFromFavorite(movie_id: string): void {
    if (this.isFavoriteMovie(movie_id)) {
      // Movie is already in Favorite Movie List, then remove it from that list
      console.log('Removing movie_id: ', movie_id)
      this.fetchApiData.deleteMovieFavoriteMovies(movie_id)
        .subscribe(user => this.user = user);
    } else {
      console.log('Adding movie_id: ', movie_id);
      // Movie is not in Favorite Movie List, then add it to that list
      this.fetchApiData.addMovieFavoriteMovies(movie_id);
      // .subscribe(user => this.user = user);     
    }
  }

  /**
   * @description removes a movie from the users list of favorite movies
   * @param {string} movie_id
   */
  removeMovieFromFavorite(movie_id: string): void {
    if (this.isFavoriteMovie(movie_id)) {
      console.log('Removing movie_id: ', movie_id);
      this.fetchApiData.deleteMovieFavoriteMovies(movie_id)
        .subscribe(user => this.user = user);
    }
  }

  /**
   * @description use as a flag to check if a movie is a favorite
   * @param {string} movie_id
   * @returns {boolean} res
   */
  isFavoriteMovie(movie_id: string): boolean {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    let res = user.FavoriteMovies.includes(movie_id);
    console.log(res);
    return res;
  }

  /**
     * This method will delete the user's account
     * @returns confirmation prompt
     * @returns user's account deleted
     * @returns user navigated to welcome page
     * @returns user notified of success
     * @returns user notified of error
     * @returns user token and user details removed from local storage
     */
  deleUserAccount(): void {
    if (confirm('Do you want to delete your account permanently?')) {
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

  /**
     * This method will update the user's data
     * @returns user's data
     * @returns updated user's data saved to local storage
     * @returns user notified of success
     * @returns user notified of error
     */
  updateUserAccount(): void {
    if (confirm('Do you want to update your user account?')) {
      this.router.navigate(['welcome']).then(() => {
        localStorage.clear();
        this.snackBar.open('Your account has been updated', 'OK', {
          duration: 3000
        });
      })
      this.fetchApiData.editUser(this.user).subscribe((result) => {
        console.log(result);
      });
    }
  }

}
