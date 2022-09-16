import { useState } from "react";
import { NameFormData } from "../types";

interface Props {
  sendFormDataSomewhere(formData: NameFormData): void;
}

function Form(props: Props) {
  const [firstName, setFirstName] = useState("Beatriz");
  const [lastName, setLastName] = useState("Solórzano");

  function handleFirstNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFirstName(event.target.value);
  }

  function handleLastNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLastName(event.target.value);
  }

  return (
    <div>
      <form>
        <input type="text" onChange={handleFirstNameChange} value={firstName} />
        <input type="text" onChange={handleLastNameChange} value={lastName} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Form;
