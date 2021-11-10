import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BaseComponentService } from 'src/app/services/base/base-component.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  public loggedIn: boolean = false;

  constructor(private readonly authService: AuthService, 
              private readonly baseComponentService: BaseComponentService) 
  { 
    this.loggedIn = authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.authService.Logged.subscribe(
      res => this.loggedIn = res
    );
  }

  public terminateSession(): void {
    this.authService.terminateSession();
    this.baseComponentService.toastr.info('Sesion finalizada.', 'Exito!');
    this.baseComponentService.router.navigate(['home/index']);
  }

}
