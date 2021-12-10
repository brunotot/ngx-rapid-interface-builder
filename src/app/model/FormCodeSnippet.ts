export default class FormCodeSnippet {
  code: string = `formInstance: FormControlWrapper = new FormControlWrapper()
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
  .toForm();
`

  constructor() {
  }
}