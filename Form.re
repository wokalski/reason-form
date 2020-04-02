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

let validatedValueToOpt = 
  fun
  | {validatedValue: Ok(x)} => Some(x)
  | {validatedValue: Error(_)} => None;

type form = {
  mutable submit: unit => unit,
  mutable isValid: unit => bool,
};

let addField = (form, handler, validator) => {
  let submit = form.submit;
  let isValid = form.isValid;
  form.submit = (
    () => {
      submit();
      handler();
    }
  );
  form.isValid = (
    () => {
      isValid() && validator();
    }
  );
};

let useForm = () => {
  {submit: () => (), isValid: () => true};
};

module ExternalState = {
  type externalState('state) = ('state, ('state => 'state) => unit);

  let useFieldWithReducer =
      (
        ~form,
        ~state as (value, setValue),
        validator,
        ~displayError=({error: _, isTouched, submitted}) => {
                        !isTouched && submitted
                      },
        reducer,
      ) => {
    let (isTouched, setIsTouched) = React.useState(() => false);
    let (submitted, setIsSubmitted) = React.useState(() => false);
    let onSubmit = () => {
      setIsTouched(_ => false);
      setIsSubmitted(_ => true);
    };
    let validatedValue = {
      validator(value);
    };
    addField(form, onSubmit, () => Belt.Result.isOk(validatedValue));
    let valueForDisplay = {
      switch (validatedValue) {
      | Error(error) =>
        if (displayError({error, isTouched, submitted})) {
          Error(error);
        } else {
          Ok(value);
        }
      | Ok(value) => Ok(value)
      };
    };
    {
      value,
      valueForDisplay,
      validatedValue,
      onChange: action => {
        let nextValue = reducer(action, value);
        setValue(_ => nextValue);
        setIsTouched(_ => true);
      },
    };
  };
  let useField = (~form, ~state, ~displayError=?, validator) => {
    useFieldWithReducer(
      ~form, ~state, validator, ~displayError?, (newValue, _) =>
      newValue
    );
  };
};

let useFieldWithReducer =
    (~form, ~initialValue, validator, ~displayError=?, reducer) => {
  ExternalState.useFieldWithReducer(
    ~form,
    ~state=React.useState(() => initialValue),
    validator,
    ~displayError?,
    reducer,
  );
};

let useField = (~form, ~initialValue, ~displayError=?, validator) => {
  ExternalState.useField(
    ~form,
    ~state=React.useState(() => initialValue),
    ~displayError?,
    validator,
  );
};

let onSubmit = ({submit}) => submit();
let isValid = ({isValid}) => isValid();
