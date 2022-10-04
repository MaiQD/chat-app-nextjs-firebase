import { async } from '@firebase/util';
import React, { useContext, useState } from 'react';
import { collection, query, where, getDocs, setDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from '../context/ChatContext';

function Search(props) {
	const [username, setUsername] = useState('');
	const [user, setUser] = useState();
	const [error, setError] = useState(false);

	const { currentUser } = useContext(AuthContext);
	const { dispatch } = useContext(ChatContext);

	const handleSearch = async () => {
		const userRef = collection(db, "users");
		const q = query(userRef, where("displayName", "==", username));
		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			querySnapshot.forEach((doc) => {
				setUser(doc.data());
			});
		} else {
			setUser(null);
		}
	}
	const handleKeyDown = (e) => {
		e.code === "Enter" && handleSearch();
	}
	const handleSelect = async () => {
		//check whether the group(chats in firestore) exists, if not create
		const combinedId =
			currentUser.uid > user.uid
				? currentUser.uid + user.uid
				: user.uid + currentUser.uid;
		try {
			const res = await getDoc(doc(db, "chats", combinedId));

			if (!res.exists()) {
				//create a chat in chats collection
				await setDoc(doc(db, "chats", combinedId), { messages: [] });

				//create user chats
				await updateDoc(doc(db, "userChats", currentUser.uid), {
					[combinedId + ".userInfo"]: {
						uid: user.uid,
						displayName: user.displayName,
						photoURL: user.photoURL,
					},
					[combinedId + ".date"]: serverTimestamp(),
				});

				await updateDoc(doc(db, "userChats", user.uid), {
					[combinedId + ".userInfo"]: {
						uid: currentUser.uid,
						displayName: currentUser.displayName,
						photoURL: currentUser.photoURL,
					},
					[combinedId + ".date"]: serverTimestamp(),
				});
			}
			dispatch({ type: "CHANGE_USER", payload: user })
		} catch (err) { }

		setUser(null);
		setUsername("")
	}
	return (
		<div className='search'>
			<div className='searchForm'>
				<input type="text" placeholder='Find a user' onKeyDown={handleKeyDown} onChange={(e) => setUsername(e.target.value)} />
			</div>
			{(error) && <span>Not found user</span>}
			{user &&
				<div onClick={handleSelect} className='userChat'>
					<img src={user?.photoURL} alt='' />
					<div className='userChatInfo'>
						<span>{user?.displayName}</span>
					</div>

				</div>}
		</div>
	);
}

export default Search;