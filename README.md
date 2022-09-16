# React Forms Submit

## Learning Goals

- Handle a form's submit event in React
- Use controlled inputs to validate values

## Introduction

In this lesson, we'll discuss how to handle form submission in React.

If you want to code along there is starter code in the `src` folder. Make sure
to run `npm install && npm start` to see the code in the browser. There will be
some TypeScript errors upon running it the first time, but we will fix them
throughout the code along.

## Submitting a Controlled Form

Now that we've learned how to control a form with state, we want to set up a way
to submit our form. For this, we add the `onSubmit` event listener to our `form`
element:

```jsx
// src/components/Form.js
return (
  <form onSubmit={handleSubmit}>
    <input type="text" onChange={handleFirstNameChange} value={firstName} />
    <input type="text" onChange={handleLastNameChange} value={lastName} />
    <button type="submit">Submit</button>
  </form>
);
```

Now, whenever the form is submitted (by pressing the Enter or Return key in an
input field, or by clicking a Submit button), the `handleSubmit` callback
function will be called. We don't have the `handleSubmit` function yet, so let's
write it out:

```jsx
function handleSubmit(event) {
  event.preventDefault();
  const formData = {
    firstName: firstName,
    lastName: lastName,
  };
  props.sendFormDataSomewhereb(formData);
  setFirstName("");
  setLastName("");
}
```

We're missing something though - the typing for the `event` parameter.
TypeScript rightfully doesn't like that it default to the `any` type, so let's
change that. We can use the IDE trick we learned to figure out what umbrella
type the `onSubmit` event falls under. Hover over the `onSubmit` attribute in
the JSX, and we should find that it's a `React.FormEvent` on an
`HTMLFormElement`.

Let's type the parameter like so:

```ts
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  // ...
}
```

Now, we can look at each line of code in this function:

- `event.preventDefault()`: The default behavior of a form is to [try and submit
  the form data based on a defined action][], which effectively causes the
  browser to refresh the page. We didn't (and don't need to) define an action.
  The result, however, is that the form makes a new request to the current page,
  causing a refresh. By using `event.preventDefault()`, we stop this behavior
  from happening.

[try and submit the form data based on a defined action]:
  https://www.w3schools.com/html/html_forms.asp

- `const formData = { firstName: firstName, lastName: lastName }`: Here, we are
  putting together the current form data into an object using the values stored
  in state.
- `props.sendFormDataSomewhere(formData)`: A form, when submitted, should send
  the form data somewhere. As mentioned a moment ago, the traditional HTML way
  was to send data to a server or another page using the `action` attribute. In
  React, we handle requests with asynchronous JavaScript. We won't go into the
  details of how this works just yet, but we can think of
  `sendFormDataSomewhere()` as the code that handles sending our data off. This
  function might be defined in the same form component, or can be passed down as
  a prop, as shown in our example.
- `setFirstName("")`: if we want to clear the input fields after the user
  submits something, all we need to do is set state! In a traditional JavaScript
  or TypeScript form, you might do something like `event.target.reset()` to
  clear out the form fields. Here, because we are using controlled inputs,
  setting state to an empty string clears out the values from the input fields
  once the data has been submitted.

You can contrast this to handling an _uncontrolled_ form being submitted, in
which case you would need to access the input fields from the DOM instead of
accessing the values from state:

```jsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  // in an uncontrolled form, you need to access the input fields from the DOM
  const formData = {
    firstName: e.target[0].value,
    lastName: e.target[1].value,
  };
  props.sendFormDataSomewhere(formData);
}
```

Since we don't have a server to send our data to, let's remove our
`sendFormDataSomewhere()` function, the `props` parameter, and the `Props`
interface. Instead, we'll demonstrate submission by modifying our `Form`
component to access submitted values from state and list them in the DOM:

```jsx
import { useState } from "react";

function Form() {
  const [firstName, setFirstName] = useState("Beatriz");
  const [lastName, setLastName] = useState("Solórzano");
  const [submittedData, setSubmittedData] = useState<NameFormData[]>([]);

  function handleFirstNameChange(event: React.ChangeEvent<HTLMInputElement>) {
    setFirstName(event.target.value);
  }

  function handleLastNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLastName(event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = { firstName: firstName, lastName: lastName };
    const dataArray = [...submittedData, formData];
    setSubmittedData(dataArray);
    setFirstName("");
    setLastName("");
  }

  const listOfSubmissions = submittedData.map((data, index) => {
    return (
      <div key={index}>
        {data.firstName} {data.lastName}
      </div>
    );
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleFirstNameChange} value={firstName} />
        <input type="text" onChange={handleLastNameChange} value={lastName} />
        <button type="submit">Submit</button>
      </form>
      <h3>Submissions</h3>
      {listOfSubmissions}
    </div>
  );
}

export default Form;
```

> **Note**: You may also have to remove the prop being passed down to `Form` in
> the parent `App` component to appease TypeScript.

The above component will render previous form submissions on the page! We have a
fully functioning controlled form.

Before we move on, let's address the following line:

```ts
const [submittedData, setSubmittedData] = useState<NameFormData[]>([]);
```

Here, we had to explicitly type our state because when initializing state with
an empty array in React, type inference assumes the array has a type called
[`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never).

To avoid that, we explicitly type our `submittedData` as an array made up of
`NameFormData` typed objects. You may have noticed that type in the original
starter code as well - where did that come from? If we look at the top of the
file, we'll see it's being imported from a `types.ts` file. Opening that file
will reveal the `NameFormData` interface.

In this case, we defined the interface in a separate file because it's also
being used in `App.tsx`. To avoid redundant definitions of the same exact
interface, we instead opted to define it in a singular file that gets imported
where needed. You may find yourself having to do so when your projects get
bigger and data gets passed around.

## Validating Inputs

One benefit we get from having our form's input values held in state is an easy
way to perform validations when the form is submitted. For example, let's say we
want to require that a user enter some data into our form fields before they can
submit the form successfully.

In our `handleSubmit` function, we can add some validation logic to check if the
form inputs have the required data, and hold some error messages in state:

```jsx
// add state for holding error messages
// we MUST explicitly type our state array here since we're initializing it as an empty array
const [errors, setErrors] = useState<string[]>([]);

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  // first name is required
  if (firstName.length > 0) {
    const formData = { firstName: firstName, lastName: lastName };
    const dataArray = [...submittedData, formData];
    setSubmittedData(dataArray);
    setFirstName("");
    setLastName("");
    setErrors([]);
  } else {
    setErrors(["First name is required!"]);
  }
}
```

Then, we can display an error message to our user in the JSX:

```jsx
return (
  <div>
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleFirstNameChange} value={firstName} />
      <input type="text" onChange={handleLastNameChange} value={lastName} />
      <button type="submit">Submit</button>
    </form>
    {/* conditionally render error messages */}
    {errors.length > 0
      ? errors.map((error, index) => (
          <p key={index} style={{ color: "red" }}>
            {error}
          </p>
        ))
      : null}
    <h3>Submissions</h3>
    {listOfSubmissions}
  </div>
);
```

> **Note**: Alternatively, there are some validation attributes features built
> into HTML forms themselves, such as a [`required` attribute][required], that
> can prevent users from submitting altogether if a specific input is not filled
> in correctly. Still, it's good to know how to do these validations by hand in
> more complex cases, such as checking that a password meets certain
> requirements.

## Conclusion

By setting up our form components using controlled inputs, we give React state
control over the data being displayed in the DOM. As a benefit of having the
form data in state, we can more easily access it once a form is submitted and
either pass it along to another component or use it to make a fetch request. We
can also more easily perform some validation logic when the form data is
submitted.

## Resources

- [React Forms](https://reactjs.org/docs/forms.html)
- [Using built-in Form Validation][validation]

[required]:
  https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/required
[validation]:
  https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#using_built-in_form_validation
