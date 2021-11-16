export class CreateReservationUnregisteredClientCommand {
    constructor(public clientName: string,
                public clientLastName: string,
                public clientDni: string,
                public clientPhoneNumber: string,
                public clientEmail: string,
                public date: Date,
                public time: string,
                public idField: string) {}
}