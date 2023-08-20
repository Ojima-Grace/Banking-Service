import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const OpenAccountPage = () => {
  const [accountType, setAccountType] = useState("");
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
  const [serverResponse, setServerResponse] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleAccountTypeChange = (event) => {
    setAccountType(event.target.value);
  };

  useEffect(
    () => {
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          setServerError("Token has expired. Please log in again.");
          navigate("/login");
        }
      }
   }, [token, navigate],
  );

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Make an API request to create the account
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
      body: JSON.stringify({ account_type: accountType }),
    };

    fetch("/account/create_account", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === `You already have a ${accountType} account` || data.message === `Please select either savings or current account`) {
          setServerError(data.message);
        } else {
          setServerResponse(data.message);
          navigate("/accounts");
        }
      })
      .catch((err) => {
        console.log(err);
        setServerError("An error occurred while opening the account.");
      });

    setAccountType("");
  };

  return (
    <>
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div>
          <h1 className="text-center mb-5">Open Account</h1>
        </div>

        {serverError && (
          <Alert variant="danger" onClose={() => setServerError("")} dismissible>
            <p>{serverError}</p>
          </Alert>
        )}

        <Form onSubmit={handleFormSubmit}>
          <Form.Select
            aria-label="Default select example"
            className="mb-3"
            value={accountType}
            onChange={handleAccountTypeChange}
          >
            <option>Account type</option>
            <option value="savings">Savings</option>
            <option value="current">Current</option>
          </Form.Select>
          <div className="text-center">
            <Button type="submit" className="btn btn-dark">
              Open
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default OpenAccountPage;