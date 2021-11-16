import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TurnById } from 'src/app/models/turn/turn-by-id';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { TurnService } from 'src/app/services/turn.service';

@Component({
  selector: 'app-consult-result',
  templateUrl: './consult-result.component.html',
  styleUrls: ['./consult-result.component.css']
})
export class ConsultResultComponent implements OnInit {

  public code!: string;

  public turn!: TurnById;

  public loading: boolean = true;

  constructor(private readonly bService: BaseComponentService,
              private readonly route: ActivatedRoute,
              private readonly turnService: TurnService) { 
                this.code = this.route.snapshot.paramMap.get('code')!;
              }

  ngOnInit(): void {
    this.startLoading();

    this.getTurnByCodePromise(this.code)
      .finally(() => this.stopLoading());
  }


  getTurnByCodePromise(code: string) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.turnService.GetTurnByCode(code).subscribe(
        res => {
          this.turn = res;
          resolve();
        },
        err => {
          const error = this.bService.handleErrorMessage(err);
          this.bService.toastr.error('Turno inexistente', error.title);
          reject();
        }
      );
    });
  }

  cancelReservation() {
    //TODO: cancelar la reserva
  }

  private startLoading(){
    this.bService.spinner.show();
    this.loading = true;
  }

  private stopLoading(){
    this.bService.spinner.hide();
    this.loading = false;
  }
}
