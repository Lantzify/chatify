require('dotenv').config()
import React, { useRef, useState, } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
});

const auth = firebase.auth();
const firestore = firebase.firestore();



const commands = {
  "--help": "",
  "login": "",
  "register": "", 
  "cls": ""
};



function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">


      <section>
        {user ? <ChatRoom /> :  <Terminal />}
      </section>

    </div>
  );
}

function Terminal(){
  
  const [formValue, setFormValue] = useState('');

  const commands = async (e) => {
    e.preventDefault();

    console.log(commands[formValue])

    messages.map(msg => <ChatMessage key={msg.id} message={msg} />);
  };

  return(<>
    <form onSubmit={commands}>
      $ <input className="current-message" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
    </form>
  </>)
}

function AddToTerminal(command) {
  const { text, userName } = props.message;

  return (<>
    <div>
        <span>&lt;</span>{userName}<span>&gt;</span>{text}
    </div>
  </>)
}

/*function Register() {

  return(
 
    <form onSubmit={registerUser}>
      <input className="current-message" value={userName} onChange={(e) => setUserNameValue(e.target.value)} />
      <input className="current-message"value={password} onChange={(e) => setPasswordValue(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  )
}
*/

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    await messagesRef.add({
      text: formValue,
      userName: auth.currentUser.displayName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })

    setFormValue('');
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <span ref={dummy}></span>
    </main>

    <form onSubmit={sendMessage}>
      <span>[#{auth.currentUser.displayName}]</span>
      <input className="current-message" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
    </form>
  </>)
}


function ChatMessage(props) {
  const { text, userName } = props.message;

  return (<>
    <div>
        <span>&lt;</span>{userName}<span>&gt;</span>{text}
    </div>
  </>)
}

export default App;