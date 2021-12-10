import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent, Form, FormControlWrapper, IForm, InputType, ToastService, Validators } from 'ngx-painless-form';
import { IValidatorConfig } from 'ngx-painless-form/src/model/FormControlWrapper';
import { ISave } from 'ngx-painless-form/src/type/DatatableConfig';
import { Select2OptionData } from 'ngx-painless-form/src/type/FormInputConfig';
import { IAjax } from 'ngx-painless-form/src/utility/InputEntityUtils';
import FormCodeSnippet from 'src/app/model/FormCodeSnippet';

function getInputTypeSelectData(): Select2OptionData[] {
  let inputTypeAny: any = InputType;
  return Object.keys(InputType).map(inputType => {
    return {
      id: inputTypeAny[inputType],
      text: inputType
    }
  })
}

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {

  @ViewChild('formElem') formElem!: BaseFormComponent;
  generatedForm!: Form;

  generatedCode: string = new FormCodeSnippet().code;
  values: IForm[] = [
    {inputType: 'text', formControlName: 'firstName', label: 'First name', placeholder: 'Enter first name', isRequired: true},
    {inputType: 'text', formControlName: 'lastName', label: 'Last name', placeholder: 'Enter last name', isRequired: false},
    {inputType: 'date', formControlName: 'dateOfBirth', label: 'Date of birth', placeholder: 'Enter date of birth', isRequired: false}
  ]

  getForm() {
    let formControlWrapper = new FormControlWrapper();
    this.values.forEach(value => {
      let validatorConfigs: IValidatorConfig[] = [];
      if (value['isRequired']) {
        validatorConfigs.push(Validators.required('This input field is mandatory!'));
      }
      formControlWrapper.set({
        formControlName: value['formControlName'],
        inputType: value['inputType'],
        label: value['label'],
        placeholder: value['placeholder'],
        validatorConfigs: validatorConfigs
      } as any)
    });
    return formControlWrapper.toForm(this.generatedForm?.value);
  }

  onSubmitFn = (formValue: IForm): any => alert(JSON.stringify(formValue, null, 2))
  InputType = InputType;
  getDisplayName = (value: IForm): string => value['label'] as string;
  ajax: IAjax = {
    loadData: async (paginationState, displayConfigsByFormControlName) => {
      return {
        data: this.values,
        count: this.values.length
      }
    },
    onDelete: async value => {
      this.values = this.values.filter(v => v['formControlName'] !== value['formControlName'])
      this.generatedForm = this.getForm();
    },
    onUpdate: async value => {
      
    },
    onCreate: async value => {
      this.values.push(value);
      this.generatedForm = this.getForm();
    }
  }
  onSave: (saveData: ISave) => Promise<IForm[] | void> = async (saveData: ISave) => {
    saveData.deleted.forEach(deletedValue => {
      this.values = this.values.filter(v => v['formControlName'] !== deletedValue['formControlName'])
    })
    saveData.created.forEach(createdValue => {
      this.values.push(createdValue)
    })
    saveData.updated.forEach(updatedValue => {
      this.values = this.values.map(v => {
        if (updatedValue['formControlName'] === v['formControlName']) {
          v = updatedValue;
        }
        return v;
      })
    })
    this.formElem.deepReset()
    this.generatedForm = this.getForm();
  }

  formInstance: FormControlWrapper = new FormControlWrapper()
    .withSelectSingle({
      formControlName: 'inputType',
      label: 'Input type',
      placeholder: 'Select input type',
      validatorConfigs: [Validators.required('Input type field is mandatory!')],
      data: getInputTypeSelectData()
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

  constructor(private toast: ToastService) { }

  ngOnInit(): void {
    this.generatedForm = this.getForm();
  }
}
