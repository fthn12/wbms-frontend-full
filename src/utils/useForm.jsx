import { useState } from "react";

export const useForm = (initialValues, submitted = false) => {
  const [values, setValues] = useState(initialValues);
  const [isSubmitted, setIsSubmitted] = useState(submitted);

  const handleInputChange = (e) => {
    const { value, name } = e.target;

    setValues((prev) => {
      return { ...prev, [name]: value };
    });

    setIsSubmitted(false);
  };

  return { values, setValues, isSubmitted, setIsSubmitted, handleInputChange };
};

export const Form = (props) => {
  return <form autoComplete="off">{props.children}</form>;
};
