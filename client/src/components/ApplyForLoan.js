import React, { useEffect, useState } from "react";
import { Form, InputGroup, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ApplyForLoan = () => {
  const [serverError, setServerError] = useState("");
  const [serverResponse, setServerResponse] = useState("");
  const [accounts, setAccounts] = useState([]);
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
  const { register, reset, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        setServerError("Token has expired. Please log in again.");
        navigate("/login");
      } else {
        fetchAccounts();
      }
    }
  }, [token, navigate]);

  const fetchAccounts = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };

    fetch("/account/get_accounts", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setAccounts(data);
      })
      .catch((err) => {
        console.log(err);
        setServerError("An error occurred while fetching accounts.");
      });
  };

  const onSubmit = (data) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
      body: JSON.stringify({
        account_number: data.account_number,
        amount: parseFloat(data.amount),
        purpose: data.purpose,
      }),
    };

    fetch("/account/apply_loan", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.errors) {
          const errorMessage = Object.values(data.errors).join(". ");
          setServerError(errorMessage);
        } else {
          setServerResponse(data.message);
          // navigate("/loans");
          reset()
        }
      })
      .catch((err) => {
        console.log(err);
        setServerError("An error occurred while applying for the loan.");
      });
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div>
        <h1 className="text-center mb-5">Apply For Loan</h1>
      </div>
      {serverError && (
        <Alert variant="danger" onClose={() => setServerError("")} dismissible>
          <p>{serverError}</p>
        </Alert>
      )}
      {serverResponse && (
        <Alert variant="success" onClose={() => setServerResponse("")} dismissible>
          <p>{serverResponse}</p>
        </Alert>
      )}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Select
          aria-label="Default select example"
          className="mb-3"
          {...register("account_number", { required: true })}
        >
          <option>Select account to receive loan</option>
          {accounts.map((account) => (
            <option key={account.account_number} value={account.account_number}>
              {`${account.account_number} - ${account.account_type} (₦${account.balance})`}
            </option>
          ))}
        </Form.Select>
        {errors.account_number && (
          <small style={{ color: "red" }}>Account number is required</small>
        )}
        <InputGroup className="mb-3">
          <InputGroup.Text>₦</InputGroup.Text>
          <Form.Control
            type="number"
            aria-label="Naira amount"
            {...register("amount", { required: true, min: 1 })}
          />
        </InputGroup>
        {errors.amount && (
          <small style={{ color: "red" }}>Amount must be greater than 0</small>
        )}
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control
            type="text"
            placeholder="Purpose for loan"
            {...register("purpose", { required: true, minLength: 3, maxLength: 30 })}
          />
        </Form.Group>
        {errors.purpose && (
          <small style={{ color: "red" }}>Purpose is required (3-30 characters)</small>
        )}
        <div className="text-center">
          <Button type="submit" className="btn btn-dark">
            Apply
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ApplyForLoan;