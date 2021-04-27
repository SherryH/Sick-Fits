import { useState, useEffect } from 'react';

const useForm = (givenInputs) => {
  // set values for all the input fields on the form
  const initialInputs = givenInputs || {
    name: 'default name',
    price: 123,
    image: '',
    description: 'nice item description!',
  };
  const [inputs, setInputs] = useState(initialInputs);

  const initial = Object.values(initialInputs).join('');
  useEffect(() => {
    setInputs(initialInputs);
  }, [initial]);

  // default Inputs look like
  /**
   * inputs = {
   *   name: 'default name',
   *   price: 123
   * }
   */

  // for type = number, change the value to int or float.
  // by default everything is text from the form

  const handleChange = (e) => {
    let { name, type, value } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      console.log('file ', e.target.files);
      [value] = e.target.files;
    }
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const resetForm = () => {
    setInputs(initialInputs);
  };

  const clearForm = () => {
    // form inputs are in the structure of object
    // transform object into array for easier manipulation
    // Object.entries() and Object.fromEntries()
    const inputsArray = Object.entries(inputs).map(([key, value]) => [key, '']);
    setInputs(Object.fromEntries(inputsArray));
  };

  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
};

export default useForm;
