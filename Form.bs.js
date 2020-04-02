

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as React from "react";
import * as Belt_Result from "bs-platform/lib/es6/belt_Result.js";
import * as Caml_option from "bs-platform/lib/es6/caml_option.js";
import * as Caml_chrome_debugger from "bs-platform/lib/es6/caml_chrome_debugger.js";

function validatedValueToOpt(param) {
  var match = param.validatedValue;
  if (match.tag) {
    return ;
  } else {
    return Caml_option.some(match[0]);
  }
}

function addField(form, handler, validator) {
  var submit = form.submit;
  var isValid = form.isValid;
  form.submit = (function (param) {
      Curry._1(submit, /* () */0);
      return Curry._1(handler, /* () */0);
    });
  form.isValid = (function (param) {
      if (Curry._1(isValid, /* () */0)) {
        return Curry._1(validator, /* () */0);
      } else {
        return false;
      }
    });
  return /* () */0;
}

function useForm(param) {
  return {
          submit: (function (param) {
              return /* () */0;
            }),
          isValid: (function (param) {
              return true;
            })
        };
}

function useFieldWithReducer(form, param, validator, $staropt$star, reducer) {
  var setValue = param[1];
  var value = param[0];
  var displayError = $staropt$star !== undefined ? $staropt$star : (function (param) {
        if (param.isTouched) {
          return false;
        } else {
          return param.submitted;
        }
      });
  var match = React.useState((function () {
          return false;
        }));
  var setIsTouched = match[1];
  var match$1 = React.useState((function () {
          return false;
        }));
  var setIsSubmitted = match$1[1];
  var onSubmit = function (param) {
    Curry._1(setIsTouched, (function (param) {
            return false;
          }));
    return Curry._1(setIsSubmitted, (function (param) {
                  return true;
                }));
  };
  var validatedValue = Curry._1(validator, value);
  addField(form, onSubmit, (function (param) {
          return Belt_Result.isOk(validatedValue);
        }));
  var valueForDisplay;
  if (validatedValue.tag) {
    var error = validatedValue[0];
    valueForDisplay = Curry._1(displayError, {
          error: error,
          isTouched: match[0],
          submitted: match$1[0]
        }) ? /* Error */Caml_chrome_debugger.variant("Error", 1, [error]) : /* Ok */Caml_chrome_debugger.variant("Ok", 0, [value]);
  } else {
    valueForDisplay = /* Ok */Caml_chrome_debugger.variant("Ok", 0, [validatedValue[0]]);
  }
  return {
          value: value,
          valueForDisplay: valueForDisplay,
          validatedValue: validatedValue,
          onChange: (function (action) {
              var nextValue = Curry._2(reducer, action, value);
              Curry._1(setValue, (function (param) {
                      return nextValue;
                    }));
              return Curry._1(setIsTouched, (function (param) {
                            return true;
                          }));
            })
        };
}

function useField(form, state, displayError, validator) {
  return useFieldWithReducer(form, state, validator, displayError, (function (newValue, param) {
                return newValue;
              }));
}

var ExternalState = {
  useFieldWithReducer: useFieldWithReducer,
  useField: useField
};

function useFieldWithReducer$1(form, initialValue, validator, displayError, reducer) {
  return useFieldWithReducer(form, React.useState((function () {
                    return initialValue;
                  })), validator, displayError, reducer);
}

function useField$1(form, initialValue, displayError, validator) {
  return useField(form, React.useState((function () {
                    return initialValue;
                  })), displayError, validator);
}

function onSubmit(param) {
  var submit = param.submit;
  return Curry._1(submit, /* () */0);
}

function isValid(param) {
  var isValid$1 = param.isValid;
  return Curry._1(isValid$1, /* () */0);
}

export {
  validatedValueToOpt ,
  useForm ,
  useFieldWithReducer$1 as useFieldWithReducer,
  useField$1 as useField,
  onSubmit ,
  isValid ,
  ExternalState ,
  
}
/* react Not a pure module */
