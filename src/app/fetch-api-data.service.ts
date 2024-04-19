import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  withFetch,
} from '@angular/common/http';
import { Observable, firstValueFrom, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

/** 
 * @description Url to fetch data (backend)
 * @constant apiUrl 
 * @type {string}
 */
const apiUrl: string = 'https://moviesflix-99590597ee12.herokuapp.com/';
@Injectable({
  providedIn: 'root',
})

export class FetchApiDataService {
  /**
  * @description Inject the HttpClient module. Make the class avaible by using this.http
  * @constructor
  * @param {HttpClient} http - Angular's HttpClient module for making HTTP requests.
  */

  constructor(private http: HttpClient) {
  }
  

  /**
  * @description Make an API call for the user registration.
  * @param {any} userDetails userDetails for registration.
  * @returns {Observable<any>} Observable for the API response.
  */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
    * @description Make an API call for user login.
    * @param {any} userDetails - User details for login.
    * @returns {Observable<string>} - Observable for the API response containing the user token.
    */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
    * @description Make an API call to retrieve all movies.
    * @returns {Observable<any>} - Observable for the API response containing all movies.
    */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
     * @description Make an API call to retrieve a single movie.
     * @param {string} title - title of the movie to be retrieved.
     * @returns {Observable<any>} - Observable for the API response containing the requested movie.
     */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
    * @description Make an API call to retrieve a director by name.
    * @param {string} directorName - Name of the director to be retrieved.
    * @returns {Observable<any>} - Observable for the API response containing the requested director.
    */
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/directors/' + directorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
    * @description Make an API call to retrieve a genre by name.
    * @param {string} genreName - Name of the genre to be retrieved.
    * @returns {Observable<any>} - Observable for the API response containing the requested genre.
    */
  public getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + '/movies/genre/' + genreName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call to get the Users
  public getUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @description Making the api call for getting user endpoint
   * @param Username
   * @returns  {object} user
   * @throws error
   */
  public getOneUser(): Observable<any> {
    let user = JSON.parse(localStorage.getItem('user') || '');
    // const u = localStorage.getItem('user');
    // let user = JSON.parse(u || '');
    this.getUsers().subscribe((response) => {
      user = response.filter((item: any) => item.Username == user.Username);
    });
    //this.userData.next(user);
    return user;
  }

  /**
      *  Method to get user's fav movies
      * @returns user's favorite movies
      * @throws error
      */
  getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies;
  }

  /**
   * @description Make an API call to add a favorite movie for a user.
   * @param {string} movie_id - ID of the movie to be added to favorites.
   * @returns {Observable<any>} - Observable for the API response.
   */
  addMovieFavoriteMovies(movie_id: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    user.FavoriteMovies.push(movie_id);
    console.log('Pushing the movie_id', movie_id);
    localStorage.setItem('user', JSON.stringify(user));

    console.log(apiUrl + 'users/' + user.Username + '/movies/' + movie_id);
    return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movie_id, '', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }


  /**
    * @description Make an API call to delete a favorite movie for a user.
    * @param {string} movie_id - ID of the movie to be removed from favorites.
    * @returns {Observable<any>} - Observable for the API response.
    */
  deleteMovieFavoriteMovies(movie_id: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const index = user.FavoriteMovies.indexOf(movie_id);
    if (index < 0) {
      console.log('The movie was already removed from the Favorite List');
    } else {
      user.FavoriteMovies.splice(index, 1); // Second parameter means remove one item only
    }
    localStorage.setItem('user', JSON.stringify(user));

    console.log(apiUrl + 'users/' + user.Username + '/movies/' + movie_id);
    return this.http
      .delete(apiUrl + 'users/' + user.Username + '/movies/' + movie_id, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }


  /**
    * @description Make an API call to update user information.
    * @param {any} updatedUser - New user information.
    * @returns {Observable<any>} - Observable for the API response.
    */
  editUser(updatedUser: any): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return this.http
      .put(apiUrl + 'users/' + user.Username, updatedUser, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }


  /**
    * @description Make an API call to delete a user.
    * @returns {Observable<any>} - Observable for the API response.
    */
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + user.Username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }


  /**
    * @description Extract non-typed response data from the API response.
    * @param {any} res - API response.
    * @returns {any} - Extracted response data.
    * @private
    */
  private extractResponseData(res: any): any {
    const body = res;
    console.log(body);
    return body || {};
  }

  /**
   * @description Handle HTTP errors and log them.
   * @param {HttpErrorResponse} error - HTTP error response.
   * @returns {any} - Error details.
   * @private
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    const err = new Error('Something bad happened; please try again later.');
    return throwError(() => err);
  }
}
