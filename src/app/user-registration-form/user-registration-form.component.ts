// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {
  // Snack-bar with horizontal and vertical position
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  // This is the function responsible for sending the form inputs to the backend
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: () => {
        this.dialogRef.close();
        this.openSnackBar('user registeres successfully!', 'OK');
      },
      error: (result) => {
        this.openSnackBar(result, 'error');
      }
    })
  }

  // Function template for all the SnackBar messages
  openSnackBar(msg1: string, msg2: string): void {
    this.snackBar.open(msg1, msg2, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }
}

