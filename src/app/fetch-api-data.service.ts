import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, withFetch } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'http://moviesflix-99590597ee12.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

  /**
   * Making the api call for the user registration endpoint
   * @param userDetails 
   * @returns an observable with the user
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Making the api call for user login endpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError));
  }


  // Making the api call for the get of all movies endpoint
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for the get of one movie endpoint
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call to get the Director endpoint
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/directors/' + directorName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call to get the Users
  public getUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData), catchError(this.handleError)
    );
  }
  // getUser(username: string): Observable<any> {
  //   const user = JSON.parse(localStorage.getItem('user') || '{}'); // Ask
  //   return user;
  // }

  /**
    * @description Making the api call for getting user endpoint
    * @param userName 
    * @returns user's details
    * @throws error
    */

  public getOneUser() {
    // let user = JSON.parse(localStorage.getItem('user') || '');
    const u = localStorage.getItem('user');
    let user = JSON.parse(u || '');
    this.getUsers().subscribe((response) => {
      user = response.filter((item: any) => item.Username == user.Username);
    })
    //this.userData.next(user);
    return user;
  }

  // Making the api call to get the favorite movies from a user endpoint
  getFavoriteMovies(favoriteMovies: string[]): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies;
  }

  // Making the api call to add a movie to the favorite movies list from a user endpoint
  editFavoriteMovies(movie_id: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    // user.FavoriteMovies.push(movie_id);
    // localStorage.setItem('user', JSON.stringify(user));

    return this.http.post(apiUrl + 'users/' + user.Username + 'movies/' + movie_id, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

    //  Making the api call to delete a movie from the User favorite movie list 
    deleteMovie(movie_id: string): Observable<any> {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      return this.http.delete(apiUrl + `users/${user.Username}/movies/${movie_id}`, {
        headers: new HttpHeaders(
          {
            Authorization: 'Bearer ' + token,
          })
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
    }
    
  // Making the api call to update the user endpoint
  editUser(updatedUser: any): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //  Making the api call for the delete user
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    const err = new Error('Something bad happened; please try again later.');
    return throwError(() => err);
  }
}
