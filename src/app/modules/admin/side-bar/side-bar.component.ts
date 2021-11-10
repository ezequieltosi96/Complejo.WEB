import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BaseComponentService } from 'src/app/services/base/base-component.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

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
