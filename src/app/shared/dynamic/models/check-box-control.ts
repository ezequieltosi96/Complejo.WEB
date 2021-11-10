import { FormControlBase } from "./form-control-base";

export class CheckBoxControl extends FormControlBase<string> {
    override controlType = 'checkbox';
}