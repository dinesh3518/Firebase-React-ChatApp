import React, { useState, useEffect } from 'react';
import { db, authG } from './firebase';
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function Chat() {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [inChat, setInChat] = useState(false);
  const navigate = useNavigate();

  const messagesRef = collection(db, 'messages');

  useEffect(() => {
    if (room) {
      const queryMessages = query(
        messagesRef,
        where('room', '==', room),
        orderBy('createdAt')
      );

      const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMessages(newMessages);
      });

      return unsubscribe;
    }
  }, [room]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim().length <= 0) return;
    try {
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: authG.currentUser.uid,
        userPicture: authG.currentUser.photoURL,
        room,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error adding message: ', error);
    }
  };

  return (
    <>
      {!inChat ? (
        <div className="vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#2ec9f4' }}>
          <div className="d-flex m-5" style={{ maxWidth: '35rem' }}>
            <input
              placeholder="Enter Room name.."
              onChange={(e) => setRoom(e.target.value)}
              value={room}
              className="form-control"
            />
            <button type="submit" onClick={() => setInChat(true)} className="btn btn-primary">
              Enter
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2 min-vh-100 d-flex flex-column rounded-2 flex-wrap align-items-center bg-success">
          <h1 className="text-center mb-2">Welcome to: {room}</h1>
          <button
            className="btn btn-light mb-3"
            style={{ maxWidth: '10rem' }}
            onClick={() => {
              authG.signOut();
              cookies.remove('auth-token');
              navigate('/');
            }}
          >
            Sign out
          </button>
          <div className="container border flex-wrap d-flex flex-column justify-content-end rounded-4" style={{ maxWidth: '35rem', backgroundColor: '#2ec9f4', boxShadow: '3px 3px 3px 6px black' }}>
            <div className="m-2 d-flex flex-column justify-content-end"
             style={{ overflow: 'auto', minHeight: '28rem' }}>
              {messages.map((message) => (
                <div key={message.id} className={`d-flex ${message.user === authG.currentUser.uid ? 'flex-row-reverse' : 'float-left'}`}>
                  <img src={message.userPicture} className="img-fluid rounded-circle" style={{ height: '2rem', width: '2rem' }} alt="..." />
                  <h5 className="text-dark p-1">{message.text}</h5>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="m-2 form-group d-flex">
              <input
                placeholder="Type your message..."
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                className="form-control"
              />
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
