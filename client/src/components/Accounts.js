import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const AccountsPage = () => {
    const [accounts, setAccounts] = useState([]);
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
                fetch("/account/get_accounts", requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        if (Array.isArray(data)) {
                            setAccounts(data);
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
        <h1 className="text-center mb-5">Accounts</h1>
      </div>
      <div className="text-center">
        {Array.isArray(accounts) && accounts.length > 0 ? (
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Account Number</th>
                <th scope="col">Account Type</th>
                <th scope="col">Account Balance</th>
                <th scope="col">Date Created</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.account_number}</td>
                  <td>{account.account_type}</td>
                  <td>₦{account.balance}</td>
                  <td>{formatDate(account.date_created)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No accounts found.</p>
        )}
      </div>
    </div>
  );
};

export default AccountsPage;