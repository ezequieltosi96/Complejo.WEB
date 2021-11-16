export class CreateReservationLoggedInClientCommand {
    constructor(public idClient: string,
                public date: Date,
                public time: string,
                public idField: string) {}
}