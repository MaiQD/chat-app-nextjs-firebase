import React, { useContext } from 'react';
import Cam from '../img/cam.png'
import Add from '../img/add.png'
import More from '../img/more.png'
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';

function Chat(props) {
	const {data} = useContext(ChatContext);
	console.log(data);
	return (
		<div className='chat'>
			<div className='chatInfo'>
				<span>{data.user?.displayName}</span>
				<div className='chatIcons'>
					<img src={Cam} alt=''></img>
					<img src={Add} alt=''></img>
					<img src={More} alt=''></img>
				</div>
			</div>
			<Messages/>
			<Input/>
		</div>
	);
}

export default Chat;