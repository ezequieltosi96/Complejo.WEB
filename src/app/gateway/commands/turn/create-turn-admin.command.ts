export class CreateTurnAdminCommand {
    constructor(public date: Date,
                public time: string,
                public idField: string,
                public clientName: string,
                public clientLastName: string,
                public clientDni: string,
                public clientPhoneNumber: string,
                public clientEmail: string) {}
}