import { Component, OnInit } from '@angular/core';
import { Form, FormControlWrapper, IForm, InputType, ToastService, Validators } from 'ngx-painless-form';
import { IValidatorConfig } from 'ngx-painless-form/src/model/FormControlWrapper';
import { IAjax } from 'ngx-painless-form/src/utility/InputEntityUtils';
import { CodeSnippetService } from 'src/app/service/code-snippet.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {
  generatedForm!: Form;
  generatedCode: string = '';
  values: IForm[] = [
    {inputType: 'TEXT', formControlName: 'firstName', label: 'First name', placeholder: 'Enter first name', isRequired: true},
    {inputType: 'TEXT', formControlName: 'lastName', label: 'Last name', placeholder: 'Enter last name', isRequired: false},
    {inputType: 'DATE', formControlName: 'dateOfBirth', label: 'Date of birth', placeholder: 'Enter date of birth', isRequired: false}
  ]

  getForm() {
    let formControlWrapper = new FormControlWrapper();
    this.values.forEach(value => {
      let validatorConfigs: IValidatorConfig[] = [];
      if (value['isRequired']) {
        validatorConfigs.push(Validators.required());
      }

      let valueAsAny: any = value;
      let inputTypeObj = this.codeSnippetService.inputTypeDict[valueAsAny['inputType']]
      let inputType = typeof inputTypeObj === 'string' ? inputTypeObj : inputTypeObj.inputType;
      let additionalConfig = typeof inputTypeObj === 'string' ? {} : inputTypeObj.additionalConfig;

      let config = {
        ...additionalConfig,
        formControlName: value['formControlName'],
        inputType: inputType,
        label: value['label'],
        placeholder: value['placeholder'],
        validatorConfigs: validatorConfigs,
        inputTypeName: valueAsAny['inputType'],
        additionalConfig
      } as any;
      if (inputType === InputType.SELECT) {
        if (!!additionalConfig.multiple) {
          formControlWrapper.withSelectMultiple(config)
        } else {
          formControlWrapper.withSelectSingle(config)
        }
      } else {
        formControlWrapper.set(config)
      }
    });
    this.generatedCode = this.codeSnippetService.stringify(formControlWrapper);
    return formControlWrapper.toForm(this.generatedForm?.value);
  }

  onSubmitFn = (formValue: IForm): any => alert(JSON.stringify(formValue, null, 2))
  InputType = InputType;
  getDisplayName = (value: IForm): string => value['formControlName'] as string;
  ajax: IAjax = {
    loadData: async (paginationState, displayConfigsByFormControlName) => {
      return {
        data: this.values,
        count: this.values.length
      }
    },
    onDelete: async value => {
      this.values = this.values.filter(v => v !== value)
      this.generatedForm = this.getForm();
    },
    onUpdate: async value => {
      this.values = this.values.map(v => {
        if (v['formControlName'] === value['formControlName']) {
          v = value;
        }
        return v;
      })
      this.generatedForm = this.getForm();
    },
    onCreate: async value => {
      this.values.push(value);
      this.generatedForm = this.getForm();
    }
  }

  formInstance: FormControlWrapper = new FormControlWrapper()
    .withSelectSingle({
      formControlName: 'inputType',
      label: 'Input type',
      placeholder: 'Select input type',
      validatorConfigs: [Validators.required('Input type field is mandatory!')],
      data: this.codeSnippetService.getInputTypeSelectData()
    })
    .withText({
      formControlName: 'formControlName',
      label: 'Form control name',
      placeholder: 'Enter form control name',
      validatorConfigs: [Validators.required('Form control name field is mandatory!')]
    })
    .withText({
      formControlName: 'label',
      label: 'Label',
      placeholder: 'Enter label',
      validatorConfigs: [Validators.required('Label field is mandatory!')]
    })
    .withText({
      formControlName: 'placeholder',
      label: 'Placeholder',
      placeholder: 'Enter placeholder'
    })
    .withCheckbox({
      formControlName: 'isRequired',
      label: 'Validator required active'
    })
    .buildInitialControls();

  constructor(private toast: ToastService, private codeSnippetService: CodeSnippetService) { }

  ngOnInit(): void {
    this.generatedForm = this.getForm();
  }
}
