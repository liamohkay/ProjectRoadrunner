import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Highlighter from 'react-highlight-words';
import AnswerTest from './AnswerTest.jsx';
import AnswerModals from '../AnswerModals.jsx';
import SearchBar from '../SearchBar.jsx';
import QuestionModals from '../QuestionModals.jsx';

const QuestionTest = (props) => {
  const [questions, setQuestions] = useState([]);
  const [addQuestions, hasClicked] = useState(false);
  const [currentQuestion, changeQuestionLen] = useState(2);
  const [helpfulClicked, setHelpfulClicked] = useState([]);
  const [searchValue, setSearchValue] = useState([]);
  const [search, setSearch] = useState('');
  const [report, setReport] = useState([])


  useEffect(() => {
    getQuestions();
  }, []);

  let getQuestions = () => {
    if (props.currentProduct.id) {
      const id = props.currentProduct.id
      axios.get('/api/qa/')
        .then((question) => {
          setQuestions(question.data.results);
        });
    }
  };

  const increaseHelpfulness = (question) => {
    const id = question.question_id;
    setHelpfulClicked(prevArray=> [...prevArray, id]);
    axios.put(`/api/qa/qhelpfulness`, null)
      .then(() => { getQuestions(); })
      .catch((err) => { console.log(err); });
  };

  const reportQuestion = (question) => {
    const id = question.question_id;
    setReport(prevArray=> [...prevArray, id]);
    axios.put(`/api/qa/report`, null)
      .catch((err) => { console.log(err); });
  };

  const insertQuestion = (question, index) => {
    const date = new Date(question.question_date);
    return (
      <div widgetName="QA" className="Question" key={index}>
        <div widgetName="QA" className="question_body">
          <p widgetName="QA" className="Qprompt">Q:</p>
          <p widgetName="QA" className="QuestionPrompt">{search.length > 2 ? <Highlighter searchWords={[search]} textToHighlight={question.question_body} /> : question.question_body}</p>
          {helpfulClicked.indexOf(question.question_id) < 0
            ? (
              <div widgetName="QA" className="Qhelpful" onClick={() => { increaseHelpfulness(question); }}>
                <p widgetName="QA">
                  Helpful ?
                  <span widgetName="QA" className="underline"> Yes </span>
                  {question.question_helpfulness}
                </p>
              </div>
            )
            : (
              <div widgetName="QA" className="Qhelpful">
                <p widgetName="QA">
                  Helpful? Yes
                  {' '}
                  {question.question_helpfulness}
                </p>
              </div>
            ) }
          {<AnswerModals question={question} product={props.currentProduct} getQuestions={getQuestions} />}
        </div>
        <AnswerTest key={index} id={question.question_id} questionInfo={question} product={props.currentProduct} />
        <div widgetName="QA" className="nameNHelpfulness">
          by {" "}
          {question.asker_name}
          ,{' '}
          {date.toDateString().substring(4)}
          {' '}
          |
          {report.indexOf(question.question_id) === -1 ? <span widgetName="QA" onClick={() => { reportQuestion(question); }} className="underline"> Report</span>: <span widgetName="QA"> Reported</span>}
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
        <div widgetName="QA" onScroll={loadMoreQ} className={currentQuestion > 2 ? 'Questions' : 'Questions2'}>
          <div>

            {searchValue.slice(0, currentQuestion).map((q, index) => (insertQuestion(q, index)))}
            {!addQuestions
              ? (
                <div widgetName="QA">
                  <button widgetName="QA" type="button" className="moreadd" onClick={() => { clickStuff(); }}>MORE ANSWERED QUESTIONS</button>
                  <QuestionModals product={props.currentProduct} getQuestions={getQuestions} />
                </div>
              ) : <QuestionModals product={props.currentProduct} getQuestions={getQuestions} />}
          </div>
        </div>
      );
    }
    return (
      <div widgetName="QA" onScroll={loadMoreQ} className={currentQuestion > 2 ? 'Questions' : 'Questions2'}>
        {questions.slice(0, currentQuestion).map((q, index) => (insertQuestion(q, index)))}
        {!addQuestions
          ? (
            <div widgetName="QA" className="questionAdd">
              <button widgetName="QA" type="button" className="moreadd" onClick={() => { clickStuff(); }}>MORE ANSWERED QUESTIONS</button>
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
          <div widgetName="QA" >
            <h1 widgetName="QA" className="QATitle">QUESTIONS & ANSWERS</h1>
            <div widgetName="QA" className="SearchBar">
              <SearchBar questions={questions} setSearchValue={setSearchValue} searchValue={searchValue} setSearch={setSearch} search={search} insertAllQuestion={insertAllQuestion} />
            </div>
            {insertAllQuestion()}
          </div>
        )
        : <QuestionModals product={props.currentProduct} getQuestions={getQuestions} />}
    </div>
  );
};

export default QuestionTest;
