import React, { useEffect, useState } from "react";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import jwtDecode from "jwt-decode";

const TransferPage = () => {
  const [serverError, setServerError] = useState("");
  const [serverResponse, setServerResponse] = useState("");
  const [userAccounts, setUserAccounts] = useState([]);
  const [receiverFullName, setReceiverFullName] = useState("");
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
  const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        setServerError("Token has expired. Please log in again.");
      } else {
        fetchUserAccounts();
      }
    }
  }, [token]);

  const fetchUserAccounts = () => {
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
        if (data && data.length > 0) {
          setUserAccounts(data);
        }
      })
      .catch((err) => {
        console.log(err);
        setServerError("An error occurred while fetching user accounts.");
      });
  };

  const handleReceiverAccountChange = (e) => {
    const receiverAccountNumber = e.target.value;
    setValue("receiver_account_number", receiverAccountNumber);

    // Make a request to fetch the receiver's full name from the /account/get_all_accounts endpoint which is a GET request
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };

    fetch(`/account/get_all_accounts`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        const receiverData = data.find((account) => account.account_number === receiverAccountNumber);
        if (receiverData) {
          setReceiverFullName(`${capitalizeFirstLetter(receiverData.firstname)} ${capitalizeFirstLetter(receiverData.lastname)}`);
        } else {
          setReceiverFullName("");
        }
      })
      .catch((err) => {
        console.log(err);
        setServerError("An error occurred while fetching receiver details.");
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
        sender_account_number: data.sender_account_number,
        receiver_account_number: data.receiver_account_number,
        amount: parseFloat(data.amount),
      }),
    };

    fetch("/account/credit_account", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.errors) {
          const errorMessage = Object.values(data.errors).join(". ");
          setServerError(errorMessage);
        } else {
          setServerResponse(data.message);
          reset();
          setReceiverFullName("");
        }
      })
      .catch((err) => {
        console.log(err);
        setServerError("An error occurred while performing the credit transaction.");
      });
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div>
        <h1 className="text-center mb-5">Credit Account</h1>
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
          {...register("sender_account_number", { required: true })}
        >
          <option>Select sender account</option>
          {userAccounts.map((account) => (
            <option key={account.account_number} value={account.account_number}>
              {`${account.account_number} - ${account.account_type}`} ({`₦${account.balance}`})
            </option>
          ))}
        </Form.Select>
        {errors.sender_account_number && (
          <small style={{ color: "red" }}>Sender account number is required</small>
        )}
        <Form.Control
          type="text"
          placeholder="Receiver account number"
          className="mb-3"
          {...register("receiver_account_number", { required: true })}
          onChange={(e) => handleReceiverAccountChange(e)}
        />
        {errors.receiver_account_number && (
          <small style={{ color: "red" }}>Receiver account number is required</small>
        )}
        <Form.Control
          type="text"
          placeholder="Receiver full name"
          className="mb-3"
          value={receiverFullName}
          readOnly
        />
        <InputGroup className="mb-3">
          <InputGroup.Text>₦</InputGroup.Text>
          <Form.Control
            type="number"
            placeholder="Amount"
            {...register("amount", { required: true, min: 1 })}
          />
        </InputGroup>
        {errors.amount && (
          <small style={{ color: "red" }}>Amount must be greater than 0</small>
        )}
        <div className="text-center">
          <Button type="submit" className="btn btn-dark">
            Credit Account
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TransferPage;