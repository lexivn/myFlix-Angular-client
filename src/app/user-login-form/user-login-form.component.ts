import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { ParseTreeResult, Token } from '@angular/compiler';
import { stringify } from 'querystring';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';

/**
* @description Component representing the user registration form.
* @selector 'app-user-registration-form'
* @templateUrl './user-registration-form.component.html'
* @styleUrls ['./user-registration-form.component.scss']
*/
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss'
})
export class UserLoginFormComponent implements OnInit {
  // Snack-bar with horizontal and vertical position
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  @Input() userData = { Username: '', Password: '' };

  /**
   * @constructor
   * @param {FetchApiDataService} fetchApiData - Service for user registration API calls.
   * @param {MatDialogRef<UserRegistrationFormComponent>} dialogRef - Reference to the dialog for closing.
   * @param {MatSnackBar} snackBar - Angular Material's MatSnackBar service for notifications.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * @description Sends user registration form information to the backend.
   * Closes the dialog on success and displays a success message. Shows an error message on failure.
   */  
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe({
      // Logic for a successful user registration goes here! (To be implemented)
      next: (result) => {
        console.log("This is the result", result);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.dialogRef.close();   // This will close the modal on success
        this.openSnackBar('user login successfully!', 'OK');
        this.router.navigate(['movies']);
      },
      error: (result) => {
        this.openSnackBar(result, 'error');
      }
    })
  }

  
  /**
   * @function tration form information to the backend.
   * @param {string} msg1
   * @param {string} msg2
   * Closes the dialog on success and displays a success message. Shows an error message on failure.
   */
  openSnackBar(msg1: string, msg2: string): void {
    this.snackBar.open(msg1, msg2, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }
}
