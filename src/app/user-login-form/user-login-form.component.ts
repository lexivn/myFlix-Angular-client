import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParseTreeResult, Token } from '@angular/compiler';
import { stringify } from 'querystring';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss'
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: ''};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar) {}

  ngOnInit(): void {      
  }

    // This is the function responsible for sending the form inputs to the backend
    loginUser(): void {
      // this.fetchApiData.userRegistration(this.userData).subscribe((response) => {
      //   // Logic for a successful user registration goes here! (To be implemented)
      //   this.dialogRef.close(); // This will close the modal on success!
      //   this.snackBar.open('user registeres successfully!', 'OK', {
      //     duration: 2000
      //   });
      // }, (response) => {
      //   this.snackBar.open(response, 'OK', {
      //     duration: 2000
      //   });
      // });
  
      this.fetchApiData.userLogin(this.userData).subscribe({
        next: (result) => {
          this.dialogRef.close();
          console.log(result);
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('token', result.token);
          this.snackBar.open('user login successfully!', 'OK', {
            duration: 2000
          });
        },
        error:(result) => {
            this.snackBar.open(result, 'error', {
              duration: 2000
            })
        }
        
      })   
    }

}
