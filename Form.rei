type form;

type shouldDisplayError('error) = {
  error: 'error,
  isTouched: bool,
  submitted: bool,
};

type field('a, 'action, 'error) = {
  value: 'a,
  valueForDisplay: result('a, 'error),
  validatedValue: result('a, 'error),
  onChange: 'action => unit,
};

let validatedValueToOpt: field('a, _, _) => option('a);

let useForm: unit => form;

let useFieldWithReducer:
  (
    ~form: form,
    ~initialValue: 'state,
    'state => result('state, 'error),
    ~displayError: shouldDisplayError('error) => bool=?,
    ('action, 'state) => 'state
  ) =>
  field('state, 'action, 'error);

let useField:
  (
    ~form: form,
    ~initialValue: 'state,
    ~displayError: shouldDisplayError('error) => bool=?,
    'state => result('state, 'error)
  ) =>
  field('state, 'state, 'error);

let onSubmit: form => unit;
let isValid: form => bool;

module ExternalState: {
  type externalState('state) = ('state, ('state => 'state) => unit);

  let useFieldWithReducer:
    (
      ~form: form,
      ~state: externalState('state),
      'state => result('state, 'error),
      ~displayError: shouldDisplayError('error) => bool=?,
      ('action, 'state) => 'state
    ) =>
    field('state, 'action, 'error);

  let useField:
    (
      ~form: form,
      ~state: externalState('state),
      ~displayError: shouldDisplayError('error) => bool=?,
      'state => result('state, 'error)
    ) =>
    field('state, 'state, 'error);
};
