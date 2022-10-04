import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';

function Chats(props) {
	const [chats, setChats] = useState([]);
	const { currentUser } = useContext(AuthContext);
	const { dispatch } = useContext(ChatContext);
	useEffect(() => {
		const getChats = () => {
			const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
				setChats(doc.data());
			});
			return () => { unsub(); };
		}
		currentUser.uid && getChats();
	}, [currentUser.uid])

	const handleSelect = (userInfo) => {
		dispatch({ type: "CHANGE_USER", payload: userInfo })
	}
	return (
		<div className='chats'>
			{Object.entries(chats)?.sort((a,b)=> b[1].date - a[1].date).map(item =>
				<div className='userChat' key={item[0]} onClick={() => handleSelect(item[1].userInfo)}>
					<img src={item[1].userInfo.photoURL} alt='' />
					<div className='userChatInfo'>
						<span>{item[1].userInfo.displayName}</span>
						<p>{item[1].userInfo.lastMessage}</p>
					</div>
				</div>)}

		</div>
	);
}

export default Chats;