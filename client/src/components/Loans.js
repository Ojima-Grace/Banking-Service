import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const LoansPage = () => {
    const [loans, setLoans] = useState([]);
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            
            if (decodedToken.exp < currentTime) {
                setServerError('Token has expired. Please log in again.');
                navigate('/login');
            } else {
                const requestOptions = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                };
                fetch("/account/get_all_loans", requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        if (Array.isArray(data)) {
                            setLoans(data);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        serverError("An error occurred while fetching the accounts.");
                    });
            }
        } 
    }, [token, navigate]
    );
    
    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div>
        <h1 className="text-center mb-5">Loans</h1>
      </div>
      <div className="text-center">
        {Array.isArray(loans) && loans.length > 0 ? (
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Account Number</th>
                <th scope="col">Account Type</th>
                <th scope="col">Amount</th>
                <th scope="col">Loan Purpose</th>
                <th scope="col">Date Collected</th>
                <th scope="col">Repaid</th>
                <th scope="col">Repaid Amount</th>
                <th scope="col">Date Repaid</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.account_number}</td>
                  <td>{loan.account_type}</td>
                  <td>₦{loan.amount}</td>
                  <td>{loan.purpose}</td>
                  <td>{formatDate(loan.date_created)}</td>
                  <td>{loan.is_repaid ? "Yes" : "No"}</td>
                  <td>₦{loan.repayment_amount}</td>
                  <td>{formatDate(loan.repayment_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Loans found.</p>
        )}
      </div>
    </div>
  );
};

export default LoansPage;