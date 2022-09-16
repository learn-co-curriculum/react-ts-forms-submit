import Form from "./Form";
import { NameFormData } from "../types";

function App() {
  function sendFormDataSomewhere(formData: NameFormData) {
    console.log("Fake function for demo purposes");
  }

  return <Form sendFormDataSomewhere={sendFormDataSomewhere} />;
}

export default App;
