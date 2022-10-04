import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

function Message({ message }) {

	const { currentUser } = useContext(AuthContext);
	const { data } = useContext(ChatContext);

	const ref = useRef()
	
	useEffect(() => {
		ref.current?.scrollIntoView({ behavior: "smooth" })
	}, [message])

	const isOwner = () => message.senderId === currentUser.uid;
	return (
		<div ref={ref} className={`message ${isOwner() && 'owner'}`}>
			<div className='messageInfo'>
				<img src={isOwner ? currentUser.photoURL : data.user.photoURL} alt='' />
				<span>Just now</span>
			</div>
			<div className='messageContent'>
				{message.text && <p>{message.text}</p>}
				{message.img && <img src={message.img} alt='' />}

			</div>
		</div>
	);
}

export default Message;