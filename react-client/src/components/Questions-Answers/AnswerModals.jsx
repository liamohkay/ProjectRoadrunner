import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
// import firebase from '../../../../firebase.js'

const AnswerModals = (props) => {
  const [answer, setAnswer] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('');
  const [photos, setPhotos] = useState([])
  const [photoClicked, setClicked] = useState(false)
  const [imgPreview, setImgPreview] = useState([])
  const [photosURL, setPhotosURL] = useState([])

  useEffect(() => {
    imageDisplay();
  }, [photos, imgPreview]);

  const upload = () => {
    const empty = [];
    const id = props.question.question_id;
    if (photos.length > 0) {
      for (let i = 0; i < photos.length; i++) {
        const imageFile = photos[i];
        uploadImageAsPromise(imageFile);
      }
    } else {
      axios.post(`/api/qa/questions/${id}/answers`, {
        body: answer,
        name: nickname,
        email,
        photos: [],
      })
        .then(() => {console.log('success'); })
        .then(()=> {props.getQuestions(); })
        .catch((err)=> {console.log(err); });
    }

    function uploadImageAsPromise(imageFile) {
      return new Promise(function (resolve, reject) {
        let storageRef = firebase.storage().ref("/"+imageFile.name);
        let task = storageRef.put(imageFile)

        task.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            switch (error.code) {
              case 'storage/unauthorized':
                break;
              case 'storage/canceled':
                break;
              case 'storage/unknown':
                break;
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            task.snapshot.ref.getDownloadURL().then((downloadURL) => {
              empty.push(downloadURL)
              console.log('File available at', downloadURL);
                if(empty.length === photos.length) {
                axios.post(`/api/qa/questions/${props.question.question_id}/answers`,{
                  body: answer,
                  name: nickname,
                  email: email,
                  photos: empty
                })
                .then(() => {console.log('success')})
                .then( ()=> {props.getQuestions()})
                .catch( (err)=> {console.log('error')})
              }
            });
          }
        );
      });
    }
  }
  let validEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  let submitHandler = (e) => {
    e.preventDefault();
    const error = [];
    if (answer.length === 0) { error.push('You must enter the following: Question'); }
    if (nickname.length === 0) { if (error.length === 0) { error.push('You must enter the following: Name'); } else { error.push(', Name'); } }
    if (email.length === 0) { if (error.length === 0) { error.push('You must enter the following: Email'); } else { error.push(', Email'); } }
    else if (!validEmail(email)) { if (error.length === 0) { error.push('The email address provided is not in correct email format'); } else {error.push(', and The email address provided is not in correct email format'); } }

    if (error.length === 0) {
      upload();
      setClicked(!photoClicked);
    } else { alert(error.join('')); }
  };

  let imageDisplay = () => {
    if (photos.length > 4) {
      return (
        <div className="allImages">
          {imgPreview.map((image) => (<img className='img' src={image} alt="" key={image} />))}
        </div>
      );
    }
    return (
      <div className="allImages">
        <input type="file" style={{ width: '705px' }} onChange={getPhoto} />
        <div>
          {imgPreview.map((image) => (<img className='img' src={image} alt="" key={image} />))}
        </div>
      </div>
    );
  };

  let getPhoto = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let img = e.target.files[0];
    reader.onloadend = () => {
      setPhotos([...photos, img])
      setImgPreview([...imgPreview, reader.result]);
    };
    if (img) { reader.readAsDataURL(img); }
  };

  return (
    <div>
      <Modal
        ariaHideApp={false}
        isOpen={photoClicked}
        className="ModalStyle"
        overlayClassName="ModalOverlay"
        onRequestClose={() => setClicked(!photoClicked)}
        contentLabel="Example Modal"
      >
        <div className="AnswerModal">
          <div className="ModalHeader">
            <h1 widgetname="QA" style={{ paddingTop: '5%' }}>Submit your answer</h1>
            <h3 widgetname="QA">
              {props.question.question_body}
              :
              {props.product.name}
            </h3>
          </div>
          <form onSubmit={submitHandler}>
            <div className="modalTitle">
              <p widgetname="QA">
                Your Answer
                <span style={{color: 'red'}}> *</span>
              </p>
              <label>
                <textarea widgetname="QA" onChange={(e) => setAnswer(e.target.value)} style={{ width: '100%', height: '75px' }} maxLength="1000" value={answer} />
              </label>
            </div>
            <div>
              <label>
                What is your nickname?
                <span style={{ color: 'red' }}> *</span>
                <input widgetname="QA" type="text" style={{ width: '80%' }} placeholder="Example: jack543!" onChange={(e)=> setNickname(e.target.value)} value={nickname} />
              </label>
              <p widgetname="QA" style={{ fontStyle: 'italic' }}>For privacy reasons, do not use your full name or email address</p>
            </div>
            <div>
              <p widgetname="QA">
                Your Email
                <span style={{ color: 'red' }}> *</span>
              </p>
              <label>
                <input widgetname="QA" type="text" style={{ width: '80%' }} placeholder="Example: jack@email.com" onChange={(e)=> setEmail(e.target.value)} value={email} />
              </label>
              <p widgetname="QA" style={{ fontStyle: 'italic' }}>For authentication reasons, you will not be emailed</p>
            </div>
            <input widgetname="QA" style={{ borderRadius: '5px', height: '50px', width: '100px', float: 'right' }}type="submit" value="Submit" />
            {imageDisplay()}
          </form>
        </div>
      </Modal>
      <p onClick={()=>{setClicked(!photoClicked)}} className="addAnswer">Add Answer</p>
    </div>
  );
};

export default AnswerModals;
