import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BaseComponentService } from 'src/app/services/base/base-component.service';

@Component({
  selector: 'app-admin-nav-bar',
  templateUrl: './admin-nav-bar.component.html',
  styleUrls: ['./admin-nav-bar.component.css']
})
export class AdminNavBarComponent implements OnInit {

  constructor(private readonly authService: AuthService,
              private readonly baseComponentService: BaseComponentService) { }

  ngOnInit(): void {
  }

  terminateSession() {
    this.authService.terminateSession();
    this.baseComponentService.toastr.info('Sesion finalizada.', 'Exito!');
    this.baseComponentService.router.navigate(['home/index']);
  }

}
