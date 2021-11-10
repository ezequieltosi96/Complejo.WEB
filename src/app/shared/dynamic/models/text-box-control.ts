import { FormControlBase } from "./form-control-base";

export class TextBoxControl extends FormControlBase<string> {
    override controlType = 'textbox';
}