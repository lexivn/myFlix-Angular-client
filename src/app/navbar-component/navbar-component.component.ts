import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-component',
  templateUrl: './navbar-component.component.html',
  styleUrl: './navbar-component.component.scss'
})
export class NavbarComponentComponent {

  /**
    * @constructor
    * @param {Router} router - Angular's Router service for navigation.
    */   
  constructor(
    public router: Router
  ) {}

  /**
   * navbar element to navigate home page
   */
  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * navbar element to navigate profile page
   */
  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  
  /**
 * This is the function responsible for logging out the user
 * @returns user and token removed from local storage
 * @returns user navigated to welcome page
 */
  public LogOut(): void {
    localStorage.setItem('user', '');
    localStorage.setItem('token', '');
    this.router.navigate(['welcome']);
  }
}
