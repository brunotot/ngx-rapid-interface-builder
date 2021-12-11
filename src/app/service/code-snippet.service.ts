import { Injectable } from '@angular/core';
import { FormControlWrapper, InputType } from 'ngx-painless-form';
import { Select2OptionData } from 'ngx-painless-form/src/type/FormInputConfig';
import { InputTypeDiscriminator } from '../type/CodeSnippetTypes';

const SELECT_RANDOM_DATA: Select2OptionData[] = [
  {id: '1', text: 'Option 1'},
  {id: '2', text: 'Option 2'},
  {id: '3', text: 'Option 3'}
]
const CODE_SNIPPET_PREFIX = `@Component({/* ... */})
export class AppComponent implements OnInit {
  onSubmitFn = (formValue: IForm) => {
    alert(JSON.stringify(formValue, null, 2))
  }

  generatedForm: FormControlWrapper = new FormControlWrapper()\n  `;
const CODE_SNIPPET_SUFFIX = `  .toForm();\n\n  /* omitted getters, setters and overriden methods */\n}`;

@Injectable({
  providedIn: 'root'
})
export class CodeSnippetService {
  stringify({ displayConfigs }: FormControlWrapper): string {
    let string = '';
    for (let displayConfig of displayConfigs) {
      let displayConfigAny: any = displayConfig;
      let inputTypeName = displayConfigAny.inputTypeName.toLowerCase();
      let inputTypeNameSplit = inputTypeName.split('_');
      let functionName = 'with';
      for (let inputTypeNameVal of inputTypeNameSplit) {
        functionName += inputTypeNameVal.charAt(0).toUpperCase() + inputTypeNameVal.slice(1);
      }
      string += `  .${functionName}({\n  `;
      string += `    formControlName: '${displayConfig.formControlName}',\n  `;
      string += `    label: '${displayConfig.label}',\n  `;
      string += (displayConfig.placeholder || '').length > 0 ? `    placeholder: '${displayConfig.placeholder}',\n  ` : '';

      let validatorConfig = displayConfig.validatorConfigs?.find(v => (v as any)['validatorName'] === 'required')
      string += validatorConfig ? `    validatorConfigs: [
        Validators.required()
      ],\n  ` : '';
      let additionalConfigAny = (displayConfig as any).additionalConfig;
      for (let key of Object.keys(additionalConfigAny)) {
        let value = additionalConfigAny[key];
        string += `    ${key}: `;
        if (typeof value === 'string') {
          string += `'${value}',\n  `
        } else if (typeof value === 'number') {
          string += `${value},\n  `
        } else if (typeof value === 'boolean') {
          string += `${!!value},\n  `
        } else if (Array.isArray(value)) {
          string += '[\n      ';
          for (let v of value) {
            if (typeof v === 'number') {
              string += `  ${value},\n    `
            } else if (typeof v === 'string') {
              string += `  '${value}',\n    `
            } else {
              // Select
              string += `  {id: '${v.id}', text: '${v.text}'},\n      `
            }
          }
          string += '],\n  '
        }
      }
      string += `  })\n  `
    }
    return `${CODE_SNIPPET_PREFIX}${string}${CODE_SNIPPET_SUFFIX}`;
  }

  getInputTypeSelectData(): Select2OptionData[] {
    return Object.keys(this.inputTypeDict).map(inputType => {
      return {
        id: inputType,
        text: inputType
      }
    })
  }

  inputTypeDict: {[key: string]: string | InputTypeDiscriminator} = {
    CHECKBOX: "checkbox",
    COLOR: "color",
    DATE: "date",
    DATETIME: "datetime-local",
    EMAIL: "email",
    HIDDEN: "hidden",
    MONTH: "month",
    NUMBER: "number",
    PASSWORD: "password",
    PHONE: "tel",
    SEARCH: "search",
    TEXT: "text",
    TEXTAREA: "textarea",
    TIME: "time",
    URL: "url",
    WEEK: "week",
    FILE_SINGLE: "file",
    FILE_MULTIPLE: {inputType: InputType.FILE, additionalConfig: {multiple: true}},
    SELECT_SINGLE: {inputType: InputType.SELECT, additionalConfig: {data: SELECT_RANDOM_DATA}},
    SELECT_MULTIPLE: {inputType: InputType.SELECT, additionalConfig: {multiple: true, data: SELECT_RANDOM_DATA}},
    RANGE: {inputType: InputType.RANGE, additionalConfig: {min: 1, max: 20}}
  }

  constructor() { }
}
