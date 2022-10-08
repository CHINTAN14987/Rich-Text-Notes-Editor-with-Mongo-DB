import { useState } from "react";
import "./SignUp.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
    username: "",
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  const [formPayload, setFormPayload] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormPayload({ ...formPayload, [name]: value });
  };

  const handleFocus = (event) => {
    const { name } = event.target;
    const errors = { ...formErrors };
    if (name === "username") {
      delete errors.username;
    }
    if (name === "email") {
      delete errors.email;
    }
    if (name === "password") {
      delete errors.password;
    }
    setFormErrors(errors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const errors = inputValidationErrors(formPayload);
      const isError = Object.keys(errors).length !== 0;
      if (isError) {
        setFormErrors(errors);
        return;
      }
      const {
        data: { isUserRegister, message },
      } = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/signup`,
        formPayload
      );
      console.log("message: ", message);
      console.log("isUserRegister: ", isUserRegister);
      if (isUserRegister) {
        await Toast.fire({
          icon: "success",
          title: message,
        });
      }
      navigate("/");
      setFormPayload(initialValues);
    } catch (error) {
      const {
        response: { data },
      } = error;
      await Toast.fire({
        icon: "error",
        title: data.message,
      });
      console.log(error);
    }
  };

  const inputValidationErrors = (values) => {
    const errors = {};
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!values.username) {
      errors.username = "Username is required!";
    }

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid email format!";
    }

    if (!values.password) {
      errors.password = "Password is required!";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 16) {
      errors.password = "Password cannot exceed more than 16 characters";
    }
    return errors;
  };

  return (
    <div>
      <div className="signUpContainer">
        <form onSubmit={handleSubmit}>
          <div className="signUp_Flex_Container">
            <h3 className="title">Create Your Account</h3>
            <input
              className="input"
              placeholder="User Name"
              value={formPayload.username}
              name="username"
              type="text"
              onChange={handleChange}
              onFocus={handleFocus}
            />
            <p className="signup_Error">{formErrors.username}</p>

            <input
              className="input"
              placeholder="Email"
              value={formPayload.email}
              name="email"
              onChange={handleChange}
              onFocus={handleFocus}
            />
            <p className="signup_Error">{formErrors.email}</p>

            <input
              className="input"
              placeholder="Password"
              value={formPayload.password}
              name="password"
              type="password"
              onChange={handleChange}
              onFocus={handleFocus}
            />
            <p className="signup_Error">{formErrors.password}</p>
            <button>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
