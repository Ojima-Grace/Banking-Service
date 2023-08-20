import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";  
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const { register, watch, handleSubmit, reset, formState: { errors } } = useForm();
    const [show,setShow]=useState(false)
    const [serverResponse,setServerResponse]=useState('')
    const navigate = useNavigate();
    const [serverError,setServerError]=useState('')

    const submitForm = (data) => {
        const body = {
            firstname: data.firstName,
            lastname: data.lastName,
            email: data.email,
            password: data.password,
            phone_number: data.phone
        }

        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(body),
        };

        fetch('/auth/signup', requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data && data.message) {
                    setServerResponse(data.message);
                    setShow(true);
                    if (data.message !== "Account created successfully") {
                      setServerError(data.message);
                    } else {
                      setServerError("");
                      navigate("/login");
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                setServerError('An error occurred while signing up.')
            });
        reset();
    }

    return (
      <>
        <div className="d-flex flex-column align-items-center justify-content-center">
            <div>
                <h1 className="text-center">Sign Up Page</h1>
            </div>
            {serverError && (
                <Alert variant="danger" onClose={() => setServerError("")} dismissible> 
                    <p>{serverError}</p>
                </Alert>
            )}

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>First name</Form.Label>
                    <Form.Control type="text" placeholder="John" 
                    {...register("firstName", { required: true, maxLength: 25 })}
                    {...register("firstName", { required: true, minLength: 2 })}
                    />
                    {errors.firstName && <small style={{color: 'red'}}>First name is required</small>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control type="text" placeholder="Doe" 
                    {...register("lastName", { required: true, maxLength: 25 })}
                    {...register("lastName", { required: true, minLength: 2 })}
                    />
                    {errors.lastName && <small style={{color: 'red'}}>Last name is required</small>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Telepone</Form.Label>
                    <Form.Control type="number" placeholder="optional" 
                    {...register("phone", { required: false, maxLength: 25 })}
                    {...register("phone", { required: false, pattern: {
                        value: /^(\+234|0)[\d]{10}$/,
                        message: "Invalid phone number",
                      },
                    })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" 
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                    {...register("email", { required: true, minLength: 2 })}
                    {...register("email", { required: true, maxLength: 25 })} 
                    />
                    {errors.email && <small style={{color: 'red'}}>Email is required</small>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="........" 
                    {...register("password", { required: true, minLength: 8 })}
                    {...register("password", { required: true, maxLength: 25 })}
                    />
                    {errors.password && <small style={{color: 'red'}}>Password is required</small>}
                </Form.Group>
            </Form>
            <div className="text-center" >
                <Button as="sub" className="btn btn-dark" onClick={handleSubmit(submitForm)}>Sign Up</Button>
            </div>
            <div className="text-center mt-3">
                <small>Already have an Account? <a href="/login">Login here</a></small>
            </div>
        </div>  
      </>   
    );
}
export default SignUpPage;

// import React, { useState } from "react";
// import { Form, Button, Alert } from "react-bootstrap";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";

// const SignUpPage = () => {
//   const {
//     register,
//     watch,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();
//   const [show, setShow] = useState(false);
//   const [serverResponse, setServerResponse] = useState("");
//   const navigate = useNavigate();
//   const [serverError, setServerError] = useState("");

//   const submitForm = (data) => {
//     const body = {
//       firstname: data.firstName,
//       lastname: data.lastName,
//       email: data.email,
//       password: data.password,
//       phone_number: data.phone,
//     };

//     const requestOptions = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     };

//     fetch("/auth/signup", requestOptions)
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);
//         if (data && data.message) {
//           setServerResponse(data.message);
//           setShow(true);
//           if (data.message !== "Account created successfully") {
//             setServerError(data.message);
//           } else {
//             setServerError("");
//             navigate("/login");
//           }
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         setServerError("An error occurred while signing up.");
//       });
//     reset();
//   };

//   return (
//     <>
//       <div className="d-flex flex-column align-items-center justify-content-center">
//         <div>
//           <h1 className="text-center">Sign Up Page</h1>
//         </div>
//         {serverError && (
//           <Alert
//             variant="danger"
//             onClose={() => setServerError("")}
//             dismissible
//           >
//             <p>{serverError}</p>
//           </Alert>
//         )}

//         <Form>
//           <Form.Group className="mb-3">
//             <Form.Label>First name</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="John"
//               {...register("firstName", { required: true, maxLength: 25 })}
//               {...register("firstName", { required: true, minLength: 2 })}
//             />
//             {errors.firstName && (
//               <small style={{ color: "red" }}>First name is required</small>
//             )}
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>Last name</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Doe"
//               {...register("lastName", { required: true, maxLength: 25 })}
//               {...register("lastName", { required: true, minLength: 2 })}
//             />
//             {errors.lastName && (
//               <small style={{ color: "red" }}>Last name is required</small>
//             )}
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>Telephone</Form.Label>
//             <Form.Control
//               type="tel"
//               placeholder="optional"
//               {...register("phone", { required: false, maxLength: 25 })}
//               {...register("phone", {
//                 required: false,
//                 pattern: /^(\+234|0)[\d]{10}$/,
//               })}
//             />
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               placeholder="name@example.com"
//               {...register("email", {
//                 required: true,
//                 pattern: /^\S+@\S+$/i,
//                 minLength: 2,
//                 maxLength: 25,
//               })}
//             />
//             {errors.email && (
//               <small style={{ color: "red" }}>Email is required</small>
//             )}
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="........"
//               {...register("password", { required: true, minLength: 8 })}
//               {...register("password", { required: true, maxLength: 25 })}
//             />
//             {errors.password && (
//               <small style={{ color: "red" }}>Password is required</small>
//             )}
//           </Form.Group>
//         </Form>
//         <div className="text-center">
//           <Button
//             as="sub"
//             className="btn btn-dark"
//             onClick={handleSubmit(submitForm)}
//           >
//             Sign Up
//           </Button>
//         </div>
//         <div className="text-center mt-3">
//           <small>
//             Already have an Account? <a href="/login">Login here</a>
//           </small>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SignUpPage;
