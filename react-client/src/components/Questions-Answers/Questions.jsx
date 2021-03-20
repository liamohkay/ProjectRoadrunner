/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Highlighter from 'react-highlight-words';
import Answers from './Answers.jsx';
import AnswerModals from './AnswerModals.jsx';
import SearchBar from './SearchBar.jsx';
import QuestionModals from './QuestionModals.jsx';

const Questions = (props) => {
  const [questions, setQuestions] = useState([]);
  const [addQuestions, hasClicked] = useState(false);
  const [currentQuestion, changeQuestionLen] = useState(2);
  const [helpfulClicked, setHelpfulClicked] = useState([]);
  const [searchValue, setSearchValue] = useState([]);
  const [search, setSearch] = useState('');
  const [report, setReport] = useState([]);


  useEffect(() => {
    getQuestions();
  }, [props.currentProduct]);

  let getQuestions = () => {
    if (props.currentProduct.id) {
      const id = props.currentProduct.id
      axios.get(`/api/qa/questions?product_id=${id}&count=100`)
        .then((question) => {
          setQuestions(question.data.results);
        });
    }
  };

  const increaseHelpfulness = (question) => {
    const id = question.question_id;
    setHelpfulClicked(prevArray=> [...prevArray, id]);
    axios.put(`/api/qa/questions/${id}/helpful`, null)
      .then(() => { getQuestions(); })
      .catch((err) => { console.log(err); });
  };

  const reportQuestion = (question) => {
    const id = question.question_id;
    setReport(prevArray=> [...prevArray, id]);
    axios.put(`/api/qa/questions/${id}/report`, null)
      .then(() => { console.log('success') })
      .catch((err) => { console.log(err); });
  };

  const insertQuestion = (question, index) => {
    const date = new Date(question.question_date);
    return (
      <div widgetname="QA" className="Question" key={index}>
        <div widgetname="QA" className="question_body">
          <p widgetname="QA" className="Qprompt">Q:</p>
          <p widgetname="QA" className="QuestionPrompt">{search.length > 2 ? <Highlighter searchWords={[search]} textToHighlight={question.question_body} /> : question.question_body}</p>
          {helpfulClicked.indexOf(question.question_id) < 0
            ? (
              <div widgetname="QA" className="Qhelpful" onClick={() => { increaseHelpfulness(question); }}>
                <p widgetname="QA">
                  Helpful ?
                  <span widgetname="QA" className="underline"> Yes </span>
                  {question.question_helpfulness}
                </p>
              </div>
            )
            : (
              <div widgetname="QA" className="Qhelpful">
                <p widgetname="QA">
                  Helpful? Yes
                  {' '}
                  {question.question_helpfulness}
                </p>
              </div>
            ) }
          {<AnswerModals question={question} product={props.currentProduct} getQuestions={getQuestions} />}
        </div>
        <Answers key={index} id={question.question_id} questionInfo={question} product={props.currentProduct} />
        <div widgetname="QA" className="nameNHelpfulness">
          by {" "}
          {question.asker_name}
          ,{' '}
          {date.toDateString().substring(4)}
          {' '}
          |
          {report.indexOf(question.question_id) === -1 ? <span widgetname="QA" onClick={() => { reportQuestion(question); }} className="underline"> Report</span>: <span widgetname="QA"> Reported</span>}
        </div>
      </div>
    );
  };

  const clickStuff = () => {
    hasClicked(true);
    changeQuestionLen(currentQuestion + 2);
  };

  const loadMoreQ = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && addQuestions) {
      changeQuestionLen(currentQuestion + 2);
    }
  };

  const insertAllQuestion = () => {
    if (search.length >= 3) {
      return (
        <div widgetname="QA" onScroll={loadMoreQ} className={currentQuestion > 2 ? 'Questions' : 'Questions2'}>
          <div>

            {searchValue.slice(0, currentQuestion).map((q, index) => (insertQuestion(q, index)))}
            {!addQuestions
              ? (
                <div widgetname="QA">
                  <button widgetname="QA" type="button" className="moreadd" onClick={() => { clickStuff(); }}>MORE ANSWERED QUESTIONS</button>
                  <QuestionModals product={props.currentProduct} getQuestions={getQuestions} />
                </div>
              ) : <QuestionModals product={props.currentProduct} getQuestions={getQuestions} />}
          </div>
        </div>
      );
    }
    return (
      <div widgetname="QA" onScroll={loadMoreQ} className={currentQuestion > 2 ? 'Questions' : 'Questions2'}>
        {questions.slice(0, currentQuestion).map((q, index) => (insertQuestion(q, index)))}
        {!addQuestions
          ? (
            <div widgetname="QA" className="questionAdd">
              <button widgetname="QA" type="button" className="moreadd" onClick={() => { clickStuff(); }}>MORE ANSWERED QUESTIONS</button>
              <QuestionModals product={props.currentProduct} getQuestions={getQuestions} />
            </div>
          ) : <QuestionModals product={props.currentProduct} getQuestions={getQuestions} />}
      </div>
    );
  };
  return (
    <div>
      {questions.length > 0
        ? (
          <div widgetname="QA" >
            <h1 widgetname="QA" className="QATitle">QUESTIONS & ANSWERS</h1>
            <div widgetname="QA" className="SearchBar">
              <SearchBar questions={questions} setSearchValue={setSearchValue} searchValue={searchValue} setSearch={setSearch} search={search} insertAllQuestion={insertAllQuestion} />
            </div>
            {insertAllQuestion()}
          </div>
        )
        : <QuestionModals product={props.currentProduct} getQuestions={getQuestions} />}
    </div>
  );
};

export default Questions;
