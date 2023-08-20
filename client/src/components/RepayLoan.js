// import React, { useState, useEffect } from "react";
// import { Form, Button, Alert } from "react-bootstrap";
// import { useForm } from "react-hook-form";
// import jwtDecode from "jwt-decode";

// const RepayLoanPage = () => {
//   const [serverError, setServerError] = useState("");
//   const [serverResponse, setServerResponse] = useState("");
//   const [userLoans, setUserLoans] = useState([]);
//   const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
//   const { register, handleSubmit, formState: { errors } } = useForm();

//   useEffect(() => {
//     if (token) {
//       const decodedToken = jwtDecode(token);
//       const currentTime = Date.now() / 1000;

//       if (decodedToken.exp < currentTime) {
//         setServerError("Token has expired. Please log in again.");
//       } else {
//         fetchUserLoans();
//       }
//     }
//   }, [token]);

//   const fetchUserLoans = () => {
//     const requestOptions = {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${JSON.parse(token)}`,
//       },
//     };

//     fetch("/account/get_all_loans", requestOptions)
//       .then((res) => res.json())
//       .then((data) => {
//         setUserLoans(data);
//       })
//       .catch((err) => {
//         console.log(err);
//         setServerError("An error occurred while fetching user loans.");
//       });
//   };

//   const onSubmit = (data) => {
//     const requestOptions = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${JSON.parse(token)}`,
//       },
//       body: JSON.stringify({
//         // loan_id: data.loan_id,
//         loan_id: parseInt(data.loan_id),
//       }),
//     };

//     fetch("/account/repay_loan", requestOptions)
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);
//         if (data.errors && data.errors.loan_id) {
//           setServerError(data.message);
//         } else {
//           setServerResponse(data.message);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         setServerError("An error occurred while repaying the loan.");
//       });
//   };

//   return (
//     <div className="d-flex flex-column align-items-center justify-content-center">
//       <div>
//         <h1 className="text-center mb-5">Repay Loan</h1>
//       </div>
//       {serverError && (
//         <Alert variant="danger" onClose={() => setServerError("")} dismissible>
//           <p>{serverError}</p>
//         </Alert>
//       )}
//       {serverResponse && (
//         <Alert variant="success" onClose={() => setServerResponse("")} dismissible>
//           <p>{serverResponse}</p>
//         </Alert>
//       )}
//       <Form onSubmit={handleSubmit(onSubmit)}>
//         <Form.Select
//           aria-label="Default select example"
//           className="mb-3"
//           {...register("loan_id", { required: true })}
//         >
//           <option>Select loan to repay</option>
//           {userLoans.map((loan) => (
//             <option key={loan.id} value={loan.id}>
//               Loan ID: {loan.id} - Amount: {loan.amount} Nigerian Naira
//             </option>
//           ))}
//         </Form.Select>
//         {errors.loan_id && (
//           <small style={{ color: "red" }}>Please select a loan to repay</small>
//         )}
//         <div className="text-center">
//           <Button type="submit" className="btn btn-dark">
//             Repay Loan
//           </Button>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default RepayLoanPage;

import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const RepayLoanPage = () => {
  const [serverError, setServerError] = useState("");
  const [serverResponse, setServerResponse] = useState("");
  const [userLoans, setUserLoans] = useState([]);
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
  const { register, reset, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        setServerError("Token has expired. Please log in again.");
      } else {
        fetchUserLoans();
      }
    }
  }, [token]);

  const fetchUserLoans = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };

    fetch("/account/get_all_loans", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        const filteredLoans = data.filter((loan) => !loan.is_repaid);
        setUserLoans(filteredLoans);
      })
      .catch((err) => {
        console.log(err);
        setServerError("An error occurred while fetching user loans.");
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
        loan_id: parseInt(data.loan_id),
      }),
    };

    fetch("/account/repay_loan", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.errors && data.errors.loan_id) {
          setServerError(data.message);
        } else {
          setServerResponse(data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setServerError("An error occurred while repaying the loan.");
      });

    reset()
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div>
        <h1 className="text-center mb-5">Repay Loan</h1>
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
          {...register("loan_id", { required: true })}
        >
          <option>Select loan to repay</option>
          {userLoans.map((loan) => (
            <option key={loan.id} value={loan.id}>
              {/* Loan ID: {loan.id} -  */}
              Amount: ₦{loan.amount} - Acc No: {loan.account_number} ({loan.account_type})
            </option>
          ))}
        </Form.Select>
        {errors.loan_id && (
          <small style={{ color: "red" }}>Please select a loan to repay</small>
        )}
        <div className="text-center">
          <Button type="submit" className="btn btn-dark">
            Repay Loan
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RepayLoanPage;