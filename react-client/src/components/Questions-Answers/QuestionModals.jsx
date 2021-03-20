/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const QuestionModals = (props) => {
  const [addClick, addClicked] = useState(false);
  const [question, setQuestion] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {

  }, []);
  const addQuestions = () => {
    addClicked(!addClick);
    axios.post('/api/qa/questions', {
      body: question,
      name: nickname,
      email,
      product_id: props.product.id,
    })
      .then(() => { props.getQuestions(); })
      .catch((err) => { console.error(err); });
  };

  const validEmail = (e) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(e).toLowerCase());
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const error = [];
    if (question.length === 0) { error.push('You must enter the following: Question')}
    if (nickname.length === 0) { if (error.length === 0) { error.push('You must enter the following: Name'); } else { error.push(', Name'); } }
    if (email.length === 0) {
      if (error.length === 0) { error.push('You must enter the following: Email'); } else { error.push(', Email'); }
    } else if (!validEmail(email)) { if (error.length === 0) { error.push('The email address provided is not in correct email format'); } else { error.push(', and The email address provided is not in correct email format'); } }

    if (error.length === 0) {
      addQuestions();
    } else { alert(error.join('')); }
  };

  return (
    <div>
      <Modal
        ariaHideApp={false}
        isOpen={addClick}
        className="ModalStyle"
        overlayClassName="ModalOverlay"
        onRequestClose={() => addClicked(!addClick)}
        contentLabel="Example Modal"
      >
        <div widgetname="QA" className="QuestionModal">
          <div className="ModalHeader"><h1 style={{paddingTop:'5%'}}>Ask Your Question</h1> <h3>About the {props.product.name}</h3></div>
          <form onSubmit={submitHandler}>
            <div className="modalTitle">
              <p widgetname="QA">
                Your Question
                <span style={{ color: 'red' }}>*</span>
              </p>
              <label>
                <textarea style={{ width: '100%', height: '75px' }} maxLength="1000" onChange={(e) => setQuestion(e.target.value)} value={question} />
              </label>
            </div>
            <div>
              <label>
                What is your nickname?
                <span style={{ color: 'red' }}>*</span>
                <input type="text" style={{ width: '80%' }} placeholder="Example: jackson11!" onChange={(e)=> setNickname(e.target.value)} value={nickname} />
              </label>
              <p style={{ fontStyle: 'italic' }}>For privacy reasons, do not use your full name or email address</p>
            </div>
            <div>
              <p widgetname="QA">
                Your Email
                <span style={{ color: 'red' }}>*</span>
              </p>
              <label>
                <input type="text" style={{ width: '80%' }} placeholder="Why did you like the product or not?" onChange={(e) => setEmail(e.target.value)} value={email} />
              </label>
              <p widgetname="QA" style={{ fontStyle: 'italic' }}>For authentication reasons, you will not be emailed</p>
            </div>
            <input style={{ borderRadius: '5px', height: '50px', width: '100px', float: 'right' }} type="submit" value="Submit" />
          </form>
        </div>
      </Modal>
      <button type="button" className="moreadd" onClick={() => { addClicked(!addClick); }}>ADD A QUESTION +</button>
    </div>
  );
};

export default QuestionModals;
