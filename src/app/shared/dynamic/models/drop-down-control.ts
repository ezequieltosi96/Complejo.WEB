import { FormControlBase } from "./form-control-base";

export class DropDownControl extends FormControlBase<string> {
    override controlType = 'dropdown';
}