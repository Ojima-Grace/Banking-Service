// import React, { useState } from 'react';
// import { Form, Button, Alert } from 'react-bootstrap';
// import { login } from '../auth';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';

// const LoginPage = () => {
//     const { register, handleSubmit, reset, formState: { errors } } = useForm();
//     const [errorMessage, setErrorMessage] = useState('');
//     const navigate = useNavigate();
//     const [serverError, setServerError] = useState('');

//     const loginUser = (data) => {
//         const requestOptions = {
//             method: "POST",
//             headers: {
//                 'content-type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         };

//         fetch('/auth/login', requestOptions)
//             .then(res => res.json())
//             .then(data => {
//                 console.log(data.access_token);
//                 if (data && data.access_token) {
//                     login(data.access_token);
//                     navigate('/');
//                 } else {
//                     setServerError(data.message)
//                 }
//             })
//             .catch(err => {
//                 console.log(err);
//             });

//         reset();
//     };

//     return (
//         <div className="d-flex flex-column align-items-center justify-content-center mt-2">
//             <div>
//                 <h1 className="text-center">Login Page</h1>
//             </div>
//             {serverError && (
//                 <Alert variant="danger" onClose={() => setServerError('')} dismissible> 
//                     <p>{serverError}</p>
//                 </Alert>
//             )}
            
//             <Form>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Email</Form.Label>
//                     <Form.Control type="email" placeholder="name@example.com" {...register('email', { required: true })} />
//                     {errors.email && <small style={{ color: 'red' }}>Email is required</small>}
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Password</Form.Label>
//                     <Form.Control type="password" placeholder="........" {...register('password', { required: true })} />
//                     {errors.password && <small style={{ color: 'red' }}>Password is required</small>}
//                 </Form.Group>
//             </Form>
//             <div className="text-center">
//                 <Button as="sub" variant="dark" onClick={handleSubmit(loginUser)}>Login</Button>
//             </div>
//             <div className="text-center mt-3">
//                 <small>You do not have an Account? <a href="/signup">Signup here</a></small>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;

import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { login } from '../auth';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const LoginPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const loginUser = (data) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    fetch('/auth/login', requestOptions)
      .then(res => res.json())
      .then(data => {
        if (data && data.access_token) {
          login(data.access_token);
          navigate('/');
        } else {
          setServerError(data.message);
        }
      })
      .catch(err => {
        console.log(err);
        setServerError('An error occurred while logging in. Please try again.');
      });

    reset();
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-2">
      <div>
        <h1 className="text-center">Login Page</h1>
      </div>
      {serverError && (
        <Alert variant="danger" onClose={() => setServerError('')} dismissible>
          <p>{serverError}</p>
        </Alert>
      )}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="name@example.com" {...register('email', { required: true })} />
          {errors.email && <small style={{ color: 'red' }}>Email is required</small>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="........" {...register('password', { required: true })} />
          {errors.password && <small style={{ color: 'red' }}>Password is required</small>}
        </Form.Group>
      </Form>
      <div className="text-center">
        <Button as="sub" variant="dark" onClick={handleSubmit(loginUser)}>Login</Button>
      </div>
      <div className="text-center mt-3">
        <small>You do not have an Account? <a href="/signup">Signup here</a></small>
      </div>
    </div>
  );
};

export default LoginPage;