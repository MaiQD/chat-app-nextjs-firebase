import { async } from '@firebase/util';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db, storage } from '../firebase';
import Attach from '../img/attach.png'

function Input(props) {

	const [text, setText] = useState("");
	const [img, setImg] = useState(null);

	const { currentUser } = useContext(AuthContext);
	const { data } = useContext(ChatContext);

	const handleSend = async () => {
		if (img) {
			try {
				const storageRef = ref(storage, uuid());

				const uploadTask = uploadBytesResumable(storageRef, img);

				uploadTask.on('state_changed',
					(progress) => { },
					(error) => { },
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
							console.log('File available at', downloadURL);
							await updateDoc(doc(db, "chats", data.chatId), {
								"messages": arrayUnion({
									id: uuid(),
									text,
									senderId: currentUser.uid,
									date: Timestamp.now(),
									img: downloadURL
								})
							})
						});
					}
				);
			} catch (error) {
				console.log(error);
			}
		}
		else {
			await updateDoc(doc(db, "chats", data.chatId), {
				"messages": arrayUnion({
					id: uuid(),
					text,
					senderId: currentUser.uid,
					date: Timestamp.now()
				})
			})
		}
		await updateDoc(doc(db, "userChats", currentUser.uid), {
			[data.chatId + '.lastMessage']: {
				text
			},
			[data.chatId + '.date']: serverTimestamp()
		})
		await updateDoc(doc(db, "userChats", data.user.uid), {
			[data.chatId + '.lastMessage']: {
				text
			},
			[data.chatId + '.date']: serverTimestamp()
		})
		setText('');
		setImg(null);
	}
	return (
		<div className='input'>
			<input type="text" placeholder='Type something...' value={text} onChange={e => setText(e.target.value)} />
			<div className='send'>
				<img src='' alt='' />
				<input id='file' type={'file'} files={img} onChange={e => setImg(e.target.files[0])} style={{ display: 'none' }} />
				<label htmlFor='file'>
					<img src={Attach} alt=''></img>
				</label>
				<button onClick={handleSend}>Send</button>
			</div>
		</div>
	);
}

export default Input;