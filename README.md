<hr>
<div align="center">
  <h1 align="center">
    useSimpleForm()
  </h1>
</div>

<p align="center">
  <a href="https://bundlephobia.com/result?p=react-use-simple-form">
    <img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/react-use-simple-form?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Types" href="https://www.npmjs.com/package/react-use-simple-form">
    <img alt="Types" src="https://img.shields.io/npm/types/react-use-simple-form?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/react-use-simple-form">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/react-use-simple-form?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="License" href="https://mit-license.org/">
    <img alt="MIT License" src="https://img.shields.io/npm/l/react-use-simple-form?style=for-the-badge&labelColor=24292e">
  </a>
</p>

<pre align="center">npm i react-use-simple-form</pre>
<hr>

Manage the state for simple forms in a flexible and un-opinionated way. This library has no UI components, and only simplifies the management of state and validation.  

## Quick Start

Create your custom hook to manage your state

```tsx harmony
import { useSimpleForm, SimpleFormValidators } from "react-use-simple-form";

// Specify the type of your state
type State = {
    name: string,
    age: number,
};

// and the initial state
const initialState: State = {
    name: '',
    age: 0,
}

// and optionally, validators
const validators: SimpleFormValidators<State> = {
    name: /^[a-zA-Z- ]{2,50}$/, // you can specify a regex
    age: (ageToValidate, entireForm) => ageToValidate >= 25 && ageToValidate < 90, // or a function
    // fields without validators specified will be assumed to be valid
}


export const ExampleComponent: React.FC = () => {
    const myForm = useSimpleForm(initialState, validators)
    console.log(myForm)
    return (
        <div>
            <label>Name</label>
            <input
                id={'name-input'}
                className={ myForm.manager.name.isValid ? 'valid' : 'invalid' }
                type={'text'}
                value={myForm.manager.name.value}
                onChange={(e) => myForm.manager.name.set(e.target.value)}
            />

            <label>Age</label>
            <input
                className={ myForm.manager.age.isValid ? 'valid' : 'invalid' }
                type={'number'}
                step={1}
                min={0}
                max={100}
                value={myForm.manager.age.value}
                onChange={(e) => myForm.manager.age.set(parseFloat(e.target.value))}
            />

            <button disabled={!myForm.isValid} onClick={() => {}}>
                Submit
            </button>

            <button onClick={() => myForm.set(initialState)}>
                Reset
            </button>
        </div>
    );
};
```
