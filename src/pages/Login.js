import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import "../styles.scss"

function Login() {
	const [error, setError] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const email = e.target[0].value;
		const password = e.target[1].value;

		try {
			await signInWithEmailAndPassword(auth,email,password);
			navigate("/");
		} catch (error) {
			setError(true);
			console.log(error);
		}
	}
	return (
		<div className='formContainer'>
			<div className='formWrapper'>
				<span className='logo'>Fire chat</span>
				<span className='title'>Login</span>
				<form onSubmit={handleSubmit}>
					<input type="email" placeholder='email' />
					<input type="password" placeholder='password' />
					<button>Sign in</button>
					{error && <span>Something went wrong</span>}
				</form>
				<p>Don't have an account? <Link to={"/register"}>Register</Link></p>
			</div>
		</div>
	);
}

export default Login;