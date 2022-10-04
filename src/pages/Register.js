import { React, useState } from 'react';
import "../styles.scss"
import AddAvatar from "../img/addAvatar.png"

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';


function Register() {
	const [error, setError] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const displayName = e.target[0].value;
		const email = e.target[1].value;
		const password = e.target[2].value;
		const file = e.target[3].files[0];

		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const storageRef = ref(storage, displayName);

			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on('state_changed',
				(progress) => { },
				(error) => {
					console.log(error);
					setError(true);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
						console.log('File available at', downloadURL);
						await updateProfile(userCredential.user, {
							displayName, photoURL: downloadURL
						});
						await setDoc(doc(db, 'users', userCredential.user.uid), {
							uid: userCredential.user.uid,
							displayName,
							email,
							photoURL: downloadURL
						})
						await setDoc(doc(db, 'userChats', userCredential.user.uid), {})
						navigate("/");
					});
				}
			);
		} catch (error) {
			setError(true);
			console.log(error);
		}

	}
	return (
		<div className='formContainer'>
			<div className='formWrapper'>
				<span className='logo'>Fire chat</span>
				<span className='title'>Register</span>
				<form onSubmit={handleSubmit}>
					<input type="text" placeholder='display name' />
					<input type="email" placeholder='email' />
					<input type="password" placeholder='password' />
					<input style={{ display: "none" }} type="file" id='file' />
					<label htmlFor='file'>
						<img src={AddAvatar} alt="add avatar" />
						<span>Add an avatar</span>
					</label>
					<button>Sign up</button>
					{error && <span>Something went wrong</span>}
				</form>
				<p>You do have an account? <Link to={"/login"}>Login</Link></p>
			</div>
		</div>
	);
}

export default Register;