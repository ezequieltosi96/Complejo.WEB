export class TurnById {
    constructor(public code: string,
                public date: string,
                public time: string,
                public field: string,
                public fieldType: string,
                public clientName: string,
                public id: string) {}
}