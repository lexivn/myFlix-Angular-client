// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];  

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllMovies();    
  }

  // Get all the Movies
  getAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  // Show Movie Genre
  public openMovieGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: {
        Name: name,
        Description: description
      },
      width: "500px"
    });
  }

  // Show Movie Director
  openMovieDirectorDialog(name: string, biography: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Biography: biography
      },
      width: "50%"
    });
  }

  // Show Movie Details
  openMovieDetailsDialog(description: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Description: description
      },
      width: "50%"

    });

  }
  // Add Movie to your favorite Movie List
  addToFavoriteMovies(movie_id: string): void {
    if (!this.isFavoriteMovie(movie_id)) {
       console.log('Adding the movie_id: ', movie_id);
       this.fetchApiData.addMovieFavoriteMovies(movie_id);
    }
  }
  
  // Remove Movie from favorite Movie List
  removeMovieFromFavorite(movie_id: string): void {
    if( this.isFavoriteMovie(movie_id)) {
      console.log('Removing movie_id: ', movie_id);
      this.fetchApiData.deleteMovieFavoriteMovies(movie_id);      
    }
  }

  // Check if a movie is in the favorite movie list
  isFavoriteMovie(movie_id: string): boolean {
    let user = JSON.parse(localStorage.getItem('user') || '');
    let res = user.FavoriteMovies.includes(movie_id);
    console.log(res);
    return res;    
  }


}