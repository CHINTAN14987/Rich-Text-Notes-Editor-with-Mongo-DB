import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import "./Login.css";

const Login = () => {
  const initialValues = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken);
    if (accessToken) {
      navigate("/home");
    }
  }, []);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFocus = (event) => {
    const { name } = event.target;
    const errors = { ...formErrors };
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
      const errors = validate(formData);
      const isError = Object.keys(errors).length !== 0;
      if (isError) {
        setFormErrors(errors);
        return;
      }
      const payload = formData;
      const {
        data: { accessToken, message },
      } = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/`, payload);
      console.log("accessToken: ", accessToken);
      console.log("message: ", message);
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        await Toast.fire({
          icon: "success",
          title: message,
        });
        navigate("/home");
      }
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

  const validate = (values) => {
    const errors = {};
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

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
      <div className="loginContainer">
        <form onSubmit={handleSubmit}>
          <div className="login_Flex_Container">
            <h3 className="title">SignIn Your Account</h3>

            <input
              className="input"
              placeholder="Email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              onFocus={handleFocus}
            />
            <p className="signup_Error">{formErrors.email}</p>

            <input
              className="input"
              placeholder="Password"
              value={formData.password}
              name="password"
              type="password"
              onChange={handleChange}
              onFocus={handleFocus}
            />
            <p className="signup_Error">{formErrors.password}</p>
            <button>Login</button>
            <h3 className="Login_Link_Title">
              New Here?
              <span onClick={() => navigate("/signup")}>Sign up now.</span>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
