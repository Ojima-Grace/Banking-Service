// import React, { useState, useEffect } from 'react';
// import { Navbar, Nav, NavDropdown, Offcanvas, Container } from 'react-bootstrap';
// import { useAuth, logout } from '../auth';

// const LoggedInLinks = () => {
//   const [user, User] = useState([]);
//   const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
//   // get when access token is expired and render the server error that from server that Token is expired 
//   const [serverError, setServerError] = useState("");
  
//   useEffect(
//     () => {
//       const requestOptions = {
//         method: "GET",
//         headers: {
//           'content-type': 'application/json',
//           'Authorization': `Bearer ${JSON.parse(token)}`
//         },
//       };
//       fetch('/account/user', requestOptions)
//         .then(res => res.json())
//         .then(data => {
//           // console.log(data);
//             User(data);
//           }
//         })
//         .catch(err => console.log(err));
//     })
//   const { firstname } = user;

//   const capitalizeFirstLetter = (string) => {
//     return string.charAt(0).toUpperCase() + string.slice(1);
//   }

//   return (
//     <>
//       <Navbar.Brand href="#">OjBank</Navbar.Brand>
//       <Navbar.Toggle aria-controls="offcanvasNavbar-expand-xxl" />
//         <Navbar.Offcanvas
//           id="offcanvasNavbar-expand-xxl"
//           aria-labelledby="offcanvasNavbarLabel-expand-xxl"
//           placement="end"
//         >
//           <Offcanvas.Header closeButton>
//             <Offcanvas.Title id="offcanvasNavbarLabel-expand-xxl">
//                 OjBank
//             </Offcanvas.Title>
//           </Offcanvas.Header>
//           <Offcanvas.Body>
//             <Nav className="justify-content-end flex-grow-1 pe-3">
//               {/* <h4 className='user'>Hi, {firstname}</h4> */}
//               {firstname && <h4 className='user'>Hi, {capitalizeFirstLetter(firstname)}</h4>}
//               <Nav.Link href="/">Home</Nav.Link>
//               <Nav.Link href="/open-bank-account">Open Bank Account</Nav.Link>
//               <Nav.Link href="/accounts">Accounts</Nav.Link>
//               <Nav.Link href="/account-balance">Account Balance</Nav.Link>
//               <Nav.Link href="/loans">Loans</Nav.Link>
//               <NavDropdown
//                 title="Activate/Deactivate Account"
//                 id="offcanvasNavbarDropdown-expand-xxl"
//               >
//                 <NavDropdown.Item href="/activate">Activate</NavDropdown.Item>
//                 <NavDropdown.Item href="/deactivate">
//                     Deactivate
//                 </NavDropdown.Item>
//               </NavDropdown>
//               <Nav.Link href="/login" onClick={()=>{logout()}} >Logout</Nav.Link>
//             </Nav>
//           </Offcanvas.Body>
//         </Navbar.Offcanvas>
//     </>
//   );
// }

// const LoggedOutLinks = () => {
//   return (
//     <>
//       <Navbar.Brand href="#">OjBank</Navbar.Brand>
//     </>
//   )
// }

// const MyNavbar = () => {
//   const [logged, auth] = useAuth();

//   return (
//     <Container>
//       <Navbar expand="xxl" className="bg-body-dark mb-3 w-100">
//         {logged ? (
//           <LoggedInLinks auth={auth} />
//         ) : (
//           <LoggedOutLinks />
//         )}
//       </Navbar>
//       {/* Other content goes here */}

//       {/* Other content goes here */}
//     </Container>
//   );
// }

// export default MyNavbar;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Alert, Navbar, Nav, NavDropdown, Container, Offcanvas } from 'react-bootstrap';
// import jwtDecode from 'jwt-decode';
// import { useAuth, logout } from '../auth';

// const LoggedInLinks = () => {
//   const [user, setUser] = useState([]);
//   const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
//   const navigate = useNavigate();
//   const [tokenExpiredError, setTokenExpiredError] = useState('');
//   const [serverError, setServerError] = useState('');

//   useEffect(() => {
//     if (token) {
//       const decodedToken = jwtDecode(token);
//       const currentTime = Date.now() / 1000;

//       if (decodedToken.exp < currentTime) {
//         setTokenExpiredError('Token has expired. Please log in again.');
//         navigate('/login');
//       } else {
//         const requestOptions = {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         fetch('/account/user', requestOptions)
//           .then((res) => {
//             if (res.status === 401) {
//               throw new Error('Token has expired. Please log in again.');
//             }
//             return res.json();
//           })
//           .then((data) => {
//             setUser(data);
//           })
//           .catch((error) => {
//             console.log(error);
//             setTokenExpiredError(error.message);
//             navigate('/login');
//           });
//       }
//     } else {
//       navigate('/login');
//     }
//   }, [token, navigate]);

//   const { firstname } = user;

//   const capitalizeFirstLetter = (string) => {
//     return string.charAt(0).toUpperCase() + string.slice(1);
//   };

//   return (
//     <>
//       {tokenExpiredError && (
//         <Alert variant="danger" onClose={() => setTokenExpiredError('')} dismissible>
//           <p>{tokenExpiredError}</p>
//         </Alert>
//       )}
//       {serverError && (
//         <Alert variant="danger" onClose={() => setServerError('')} dismissible>
//           <p>{serverError}</p>
//         </Alert>
//       )}
//       <Navbar.Brand href="#">OjBank</Navbar.Brand>
//       <Navbar.Toggle aria-controls="offcanvasNavbar-expand-xxl" />
//       <Navbar.Offcanvas
//         id="offcanvasNavbar-expand-xxl"
//         aria-labelledby="offcanvasNavbarLabel-expand-xxl"
//         placement="end"
//       >
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title id="offcanvasNavbarLabel-expand-xxl">OjBank</Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//           <Nav className="justify-content-end flex-grow-1 pe-3">
//             {firstname && <h4 className="user">Hi, {capitalizeFirstLetter(firstname)}</h4>}
//             <Nav.Link href="/">Home</Nav.Link>
//             <Nav.Link href="/open-bank-account">Open Bank Account</Nav.Link>
//             <Nav.Link href="/accounts">Accounts</Nav.Link>
//             <Nav.Link href="/account-balance">Account Balance</Nav.Link>
//             <Nav.Link href="/loans">Loans</Nav.Link>
//             <NavDropdown
//               title="Activate/Deactivate Account"
//               id="offcanvasNavbarDropdown-expand-xxl"
//             >
//               <NavDropdown.Item href="/activate">Activate</NavDropdown.Item>
//               <NavDropdown.Item href="/deactivate">Deactivate</NavDropdown.Item>
//             </NavDropdown>
//             <Nav.Link href="/login" onClick={() => logout()}>
//               Logout
//             </Nav.Link>
//           </Nav>
//         </Offcanvas.Body>
//       </Navbar.Offcanvas>
//     </>
//   );
// };

// const LoggedOutLinks = () => {
//   return (
//     <>
//       <Navbar.Brand href="#">OjBank</Navbar.Brand>
//     </>
//   );
// };

// const MyNavbar = () => {
//   const [logged, auth] = useAuth();

//   return (
//     <Container>
//       <Navbar expand="xxl" className="bg-body-dark mb-3 w-100">
//         {logged ? <LoggedInLinks auth={auth} /> : <LoggedOutLinks />}
//       </Navbar>
//       {/* Other content goes here */}

//       {/* Other content goes here */}
//     </Container>
//   );
// };

// export default MyNavbar;

import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Offcanvas, Container, Alert } from 'react-bootstrap';
import { useAuth, logout } from '../auth';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const LoggedInLinks = () => {
  const [user, User] = useState([]);
  const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();


  useEffect(
    () => {
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          setServerError('Token has expired. Please log in again.');
          navigate('/login');
        } else {
          const requestOptions = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          };

          fetch('/account/user', requestOptions)
            .then((res) => {
              if (res.status === 401) {
                throw new Error('Token has expired. Please log in again.');
              }
              return res.json();
            })
            .then((data) => {
              User(data);
            })
            .catch((error) => {
              console.log(error);
              setServerError(error.message);
              navigate('/login');
            });
        }
      }
    }, [token]);

  const { firstname } = user;
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <>
      {/* {serverError && (
        <Alert variant="danger" onClose={() => setServerError('')} dismissible>
          <p>{serverError}</p>
        </Alert>
      )} */}
      <Navbar.Brand href="#">OjBank</Navbar.Brand>
      {serverError && (
            <Alert variant="danger" onClose={() => setServerError("")} dismissible>
              <p>{serverError}</p>
            </Alert>
          )}
      <Navbar.Toggle aria-controls="offcanvasNavbar-expand-xxl" />
      <Navbar.Offcanvas
        id="offcanvasNavbar-expand-xxl"
        aria-labelledby="offcanvasNavbarLabel-expand-xxl"
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title id="offcanvasNavbarLabel-expand-xxl">
            OjBank
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="justify-content-end flex-grow-1 pe-3">
            {firstname && <h4 className='user'>Hi, {capitalizeFirstLetter(firstname)}</h4>}
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/open-bank-account">Open Bank Account</Nav.Link>
            <Nav.Link href="/accounts">Accounts</Nav.Link>
            <Nav.Link href="/account-balance">Account Balance</Nav.Link>
            <Nav.Link href="/loans">Loans</Nav.Link>
            <NavDropdown
              title="Activate/Deactivate Account"
              id="offcanvasNavbarDropdown-expand-xxl"
            >
              <NavDropdown.Item href="/activate">Activate</NavDropdown.Item>
              <NavDropdown.Item href="/deactivate">
                Deactivate
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/login" onClick={() => { logout() }} >Logout</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
      {/* <div className="text-center mt-3">
        <Alert variant="danger" onClose={() => setServerError('')} dismissible>
          <p>{serverError}</p>  
        </Alert>
      </div> */}
    </>
  );
}

const LoggedOutLinks = () => {
  return (
    <>
      <Navbar.Brand href="#">OjBank</Navbar.Brand>
    </>
  )
}

const MyNavbar = () => {
  const [logged, auth] = useAuth();

  return (
    <Container>
      <Navbar expand="xxl" className="bg-body-dark mb-3 w-100">
        {logged ? (
          <LoggedInLinks auth={auth} />
        ) : (
          <LoggedOutLinks />
        )}
      </Navbar>
      {/* Other content goes here */}

      {/* Other content goes here */}
    </Container>
  );
}

export default MyNavbar;