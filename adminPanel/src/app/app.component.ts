import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNavbarComponent } from "./comp/Navbar/admin-navbar.component"


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AdminNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    if(localStorage.getItem('isLoggedIn') === 'true'){
      return;
    }
    while (true){

      const username = prompt('Enter your username:');
      const password = prompt('Enter your password:');
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        break;
      } else {
        alert('Invalid username or password. Please try again.');
      }
    }
  }
  title = 'adminPanel';
}
