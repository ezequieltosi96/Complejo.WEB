import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CancelTurnCommand } from 'src/app/gateway/commands/turn/cancel-turn.command';
import { TurnById } from 'src/app/models/turn/turn-by-id';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { TurnService } from 'src/app/services/turn.service';
import { FontAwesome } from 'src/app/shared/utils/enums.utils';

@Component({
  selector: 'app-consult-result',
  templateUrl: './consult-result.component.html',
  styleUrls: ['./consult-result.component.css']
})
export class ConsultResultComponent implements OnInit {

  public code!: string;

  public turn!: TurnById;

  public twitterIcon: string = FontAwesome.TWITTER;
  public wspIcon: string = FontAwesome.WHATSAPP;
  public text: string = "";

  public loading: boolean = true;

  constructor(private readonly bService: BaseComponentService,
              private readonly route: ActivatedRoute,
              private readonly turnService: TurnService) { 
                this.code = this.route.snapshot.paramMap.get('code')!;
              }

  ngOnInit(): void {
    this.startLoading();

    console.log(this.code)

    this.getTurnByCodePromise(this.code)
      .finally(() => this.stopLoading());
  }


  getTurnByCodePromise(code: string) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.turnService.GetTurnByCode(code).subscribe(
        res => {
          this.turn = res;
          this.composeText();
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

  composeText() {
    const turnDescription = `El Complejo Fútbol\n\n${this.turn.clientName} aquí va tu reserva.\n\nFecha: ${this.turn.date}\nHora: ${this.turn.time}:00 hs\nCancha: ${this.turn.fieldType} - ${this.turn.field}\nCódigo: ${this.turn.code}\n\nAnte cualquier consulta no dudes en contactarnos.\nTe esperamos!\n\nEl Complejo Fútbol.`;

    this.text = encodeURIComponent(turnDescription);
  }

  cancelReservation() {
    this.startLoading();

    this.turnService.CancelTurn(new CancelTurnCommand(this.turn.id)).subscribe(
      res => {
        this.stopLoading();
        this.bService.toastr.success('Turno cancelado', 'Éxito!');
        this.bService.router.navigate(['/home/index']);
      },
      err => {
        const error = this.bService.handleErrorMessage(err);
        this.bService.toastr.error(error.message, error.title);
        this.stopLoading();
      }
    );
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
