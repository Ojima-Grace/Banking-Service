# Banking-Service API with Flask-RESTful

The Banking API is a simple RESTful API built using Flask-RESTful that allows users to perform basic banking operations. It provides endpoints for managing accounts, transactions, and user authentication.

## Features

***Account Management:*** Create, retrieve, update, deactivate and activate user accounts.

***Transaction Handling:*** Apply for loan, perform deposit, and balance inquiry transactions.

***User Authentication:*** Secure endpoints using JWT-based authentication.

***Error Handling:*** Proper HTTP status codes and error messages for better user experience.

***Data Validation:*** Input validation and error handling to ensure data integrity.

## API Endpoints

### auth

***POST /auth/signup:*** Signup a new user.

***POST /auth/login:*** User login to obtain an authentication token.

***POST /auth/refresh:*** User generates refresh authenntication token.

***POST /auth/logout:*** Logout a user.

### account

***POST /account/create_account:*** Create a new account (either "savings", "current" or both).

***GET /account/user:*** Get user details.

***GET /account/get_account:*** Get user account number and details.

***POST /account/apply_loan:*** Apply for loan.

***GET /account/get_all_loans:*** Get all loans of current user.

***POST /account/repay_loan:*** Repay existing loans.

***POST /account/credit_account:*** Deposit funds into an account.

***PUT /account/deactivate_account:*** Deactivate an account.

***PUT /account/activate_account:*** Activate an account.

***GET /account/get_all_accounts:*** Get a list of all users' accounts.

## Authentication

The API uses JWT-based authentication. To access protected endpoints, include the JWT token in the Authorization header as `Bearer <token>`.

## Error Handling

The API returns appropriate HTTP status codes and error messages in case of errors.
