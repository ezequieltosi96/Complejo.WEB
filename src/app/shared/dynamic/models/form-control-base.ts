import { ValidatorFn } from "@angular/forms";
import { ComboBox } from "src/app/models/responses/combo-box";

export class FormControlBase<T> {

    public value: T | undefined;
    public key: string;
    public label: string;
    public validators?: ValidatorFn[];
    public errorMessage: string;
    public order: number;
    public controlType: string;
    public type: string;
    public options: ComboBox[];
    public defaultOption?: string;

    constructor(options: {
                    value?: T;
                    key?: string;
                    label?: string;
                    validators?: ValidatorFn[];
                    errorMessage?: string;
                    order?: number;
                    controlType?: string;
                    type?: string;
                    options?: ComboBox[];
                    defaultOption?: string;
                } = {}) {

      this.value = options.value;
      this.key = options.key || '';
      this.label = options.label || '';
      this.validators = options.validators;
      this.errorMessage = options.errorMessage || '';
      this.order = options.order === undefined ? 1 : options.order;
      this.controlType = options.controlType || '';
      this.type = options.type || '';
      this.options = options.options || [];
      this.defaultOption = options.defaultOption;

    }
    
}