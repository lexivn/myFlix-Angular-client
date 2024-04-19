// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { __param } from 'tslib';

/**
 * @description Component representing the movie card
 * @selector 'app-movie-card'
 * @templateUrl './movie-card.component.html'
 * @styleUrls ['./movie-card.component.scss']
 */

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  /** The movie data displayed in the card. */
  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) { }
  
  ngOnInit(): void {
    this.getAllMovies();
  }


  /**
   * @description This will get all movies from the API
   * @returns movies
   */
  getAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /** 
   * @description Open a dialog with the movie's genre info
   * @param {string} name
   * @param {string} description   
   * */
  public openMovieGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: {
        Name: name,
        Description: description
      },
      width: "500px"
    });
  }

  /** 
  @description Open director a dialog with the movie's director info
* @param {string} name
* @param {string} biography
* @returns director name, bio
* */
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
   * @description Open the movie's description
   * @param {string} description
   * @returns movie Title, Sypnosis
   * */
  openMovieDetailsDialog(description: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Description: description
      },
      width: "50%"
    });
  }


  /**
   * @description Add a movie to a user's favorites or
   * remove on click if it is already a favorite
   * @param {string} movie_id 
   * @returns success message
   * */
  addToFavoriteMovies(movie_id: string): void {
    if (this.isFavoriteMovie(movie_id)) {
      // This movie is already favorite, then remove it.
      console.log('Removing the movie_id: ', movie_id);
      this.fetchApiData.deleteMovieFavoriteMovies(movie_id);
    } else {
      console.log('Adding the movie_id: ', movie_id);
      this.fetchApiData.addMovieFavoriteMovies(movie_id);
    }
  }

  /**
   * @description Check if a movie is already a favorite
    * @param {string} movie_id
    * @returns {boolean}
    * */
  isFavoriteMovie(movie_id: string): boolean {
    let user = JSON.parse(localStorage.getItem('user') || '');
    let res = user.FavoriteMovies.includes(movie_id);
    console.log(res);
    return res;
  }

}