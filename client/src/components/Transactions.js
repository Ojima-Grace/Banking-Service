// import React, { useState, useEffect } from 'react';

// const TransactionsPage = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState('');
//   const [transactions, setTransactions] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch user's accounts from the server
//     fetch('/account/get_accounts')
//       .then((response) => response.json())
//       .then((data) => {
//         setAccounts(data);
//       })
//       .catch((error) => {
//         setError('Error fetching accounts. Please try again later.');
//         console.error('Error fetching accounts:', error);
//       });
//   }, []);

//   const handleAccountChange = (e) => {
//     setSelectedAccount(e.target.value);
//   };

//   const fetchTransactions = () => {
//     if (!selectedAccount) {
//       return;
//     }

//     fetch(`/account/get_all_transactions?account_number=${selectedAccount}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setTransactions(data);
//         setError(null);
//       })
//       .catch((error) => {
//         setError('Error fetching transactions. Please try again later.');
//         console.error('Error fetching transactions:', error);
//       });
//   };

//   return (
//     <div>
//       <h1>Bank Transactions</h1>
//       <h2>Select an Account</h2>
//       <select value={selectedAccount} onChange={handleAccountChange}>
//         <option value="">Select an account</option>
//         {accounts.map((account) => (
//           <option key={account.account_number} value={account.account_number}>
//             {account.account_number} - {account.account_type}
//           </option>
//         ))}
//       </select>
//       <button onClick={fetchTransactions} disabled={!selectedAccount}>
//         View Transactions
//       </button>

//       {error && <p>{error}</p>}

//       {transactions.length > 0 ? (
//         <div>
//           <h2>Transactions for Account: {selectedAccount}</h2>
//           <button onClick={fetchTransactions}>Refresh Transactions</button>
//           {transactions.map((transaction) => (
//             <div key={transaction.transaction_id}>
//               <p>Transaction ID: {transaction.transaction_id}</p>
//               <p>Sender: {transaction.sender_firstname} {transaction.sender_lastname}</p>
//               <p>Receiver: {transaction.receiver_firstname} {transaction.receiver_lastname}</p>
//               <p>Amount: {transaction.amount}</p>
//               <p>Date: {transaction.date}</p>
//               <p>Transaction Type: {transaction.transaction_type}</p>
//               <hr />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No transactions found for this account.</p>
//       )}
//     </div>
//   );
// };

// export default TransactionsPage;

// import React, { useState, useEffect } from 'react';
// import jwtDecode from 'jwt-decode';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';

// const TransactionsPage = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState('');
//   const [transactions, setTransactions] = useState([]);
//   const [error, setError] = useState(null);
//   const [serverError, setServerError] = useState('');
//   const [serverResponse, setServerResponse] = useState('');
//   const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
//   const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (token) {
//       const decodedToken = jwtDecode(token);
//       const currentTime = Date.now() / 1000;

//       if (decodedToken.exp < currentTime) {
//         setServerError('Token has expired. Please log in again.');
//       } else {
//         fetchUserAccounts();
//       }
//     }
//   }, [token]);

//   const fetchUserAccounts = () => {
//     const requestOptions = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${JSON.parse(token)}`,
//       },
//     };

//     fetch('/account/get_accounts', requestOptions)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data && data.length > 0) {
//           setAccounts(data);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         setServerError('An error occurred while fetching user accounts.');
//       });
//   }

//   const handleAccountChange = (e) => {
//     setSelectedAccount(e.target.value);
//   }

//   const fetchTransactions = () => {
//     if (!selectedAccount) {
//       return;
//     }

//     fetch(`/account/get_all_transactions?account_number=${selectedAccount}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setTransactions(data);
//         setError(null);
//       })
//       .catch((error) => {
//         setError('Error fetching transactions. Please try again later.');
//         console.error('Error fetching transactions:', error);
//       });
//   }

//   return (
//     <div>
//       <h1>Bank Transactions</h1>
//       <h2>Select an Account</h2>
//       <select value={selectedAccount} onChange={handleAccountChange}>
//         <option value="">Select an account</option>
//         {accounts.map((account) => (
//           <option key={account.account_number} value={account.account_number}>
//             {account.account_number} - {account.account_type}
//           </option>
//         ))}
//       </select>
//       <button onClick={fetchTransactions} disabled={!selectedAccount}>
//         View Transactions
//       </button>

//       {error && <p>{error}</p>}
//       {serverError && <p>{serverError}</p>}
//       {serverResponse && <p>{serverResponse}</p>}
//       {transactions.length > 0 ? (
//         <div>
//           <h2>Transactions for Account: {selectedAccount}</h2>
//           <button onClick={fetchTransactions}>Refresh Transactions</button>
//           {transactions.map((transaction) => (
//             <div key={transaction.transaction_id}>
//               <p>Transaction ID: {transaction.transaction_id}</p>
//               <p>Sender: {transaction.sender_firstname} {transaction.sender_lastname}</p>
//               <p>Receiver: {transaction.receiver_firstname} {transaction.receiver_lastname}</p>
//               <p>Amount: {transaction.amount}</p>
//               <p>Date: {transaction.date}</p>
//               <p>Transaction Type: {transaction.transaction_type}</p>
//               <hr />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No transactions found for this account.</p>
//       )}
//     </div>
//   );
// };

// export default TransactionsPage;

// import React, { useState, useEffect } from 'react';
// import jwtDecode from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';

// const TransactionsPage = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState('');
//   const [transactions, setTransactions] = useState([]);
//   const [error, setError] = useState(null);
//   const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) {
//       navigate('/login'); // Redirect to login page if token is not available
//     } else {
//       const decodedToken = jwtDecode(token);
//       const currentTime = Date.now() / 1000;

//       if (decodedToken.exp < currentTime) {
//         setError('Token has expired. Please log in again.');
//       } else {
//         fetchUserAccounts();
//       }
//     }
//   }, [token, navigate]);

//   const fetchUserAccounts = () => {
//     const requestOptions = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${JSON.parse(token)}`,
//       },
//     };

//     fetch('/account/get_accounts', requestOptions)
//       .then((res) => res.json())
//       .then((data) => {
//         setAccounts(data);
//       })
//       .catch((err) => {
//         console.log(err);
//         setError('An error occurred while fetching user accounts.');
//       });
//   };

//   const handleAccountChange = (e) => {
//     setSelectedAccount(e.target.value);
//   };

//   const fetchTransactions = () => {
//     if (!selectedAccount) {
//       return;
//     }

//     const requestOptions = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${JSON.parse(token)}`,
//       },
//     };

//     fetch(`/account/get_all_transactions`, requestOptions)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setTransactions(data);
//         setError(null);
//       })
//       .catch((error) => {
//         setError('Error fetching transactions. Please try again later.');
//         console.error('Error fetching transactions:', error);
//       });
//   };

//   return (
//     <div>
//       <h1>Bank Transactions</h1>
//       <h2>Select an Account</h2>
//       <select value={selectedAccount} onChange={handleAccountChange}>
//         <option value="">Select an account</option>
//         {accounts.map((account) => (
//           <option key={account.account_number} value={account.account_number}>
//             {account.account_number} - {account.account_type}
//           </option>
//         ))}
//       </select>
//       <button onClick={fetchTransactions} disabled={!selectedAccount}>
//         View Transactions
//       </button>

//       {error && <p>{error}</p>}

//       {transactions.length > 0 ? (
//         <div>
//           <h2>Transactions for Account: {selectedAccount}</h2>
//           <button onClick={fetchTransactions}>Refresh Transactions</button>
//           {transactions.map((transaction) => (
//             <div key={transaction.transaction_id}>
//               <p>Transaction ID: {transaction.transaction_id}</p>
//               <p>
//                 Sender: {transaction.sender_firstname} {transaction.sender_lastname}
//               </p>
//               <p>
//                 Receiver: {transaction.receiver_firstname} {transaction.receiver_lastname}
//               </p>
//               <p>Amount: {transaction.amount}</p>
//               <p>Date: {transaction.date}</p>
//               <p>Transaction Type: {transaction.transaction_type}</p>
//               <hr />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No transactions found for this account.</p>
//       )}
//     </div>
//   );
// };

// export default TransactionsPage;