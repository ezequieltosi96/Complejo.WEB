import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  public isLoggedIn: string;
  
  public year: number = new Date().getFullYear();

  constructor(private readonly authService: AuthService) {
    this.isLoggedIn = authService.isLoggedIn() ? 'Si' : 'No';
  }

  ngOnInit(): void {
    this.authService.Logged.subscribe(
      res => {
        this.isLoggedIn = res ? 'Si' : 'No';
      }
    );
  }

}
