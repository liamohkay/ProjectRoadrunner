import React, { useEffect, useState } from 'react';
import axios from 'axios';
import header from '../../../../../config.js';
import AnswerModals from '../AnswerModals.jsx';
import AnswerPicture from '../AnswerPicture.jsx';

const AnswerTest = (props) => {
  const [answers, setAnswers] = useState([]);
  const [helpfulClicked, setHelpfulClicked] = useState([]);
  const [moreAnswers, setMoreAnswers] = useState(false);
  const [picmodal, setPicModal] = useState(false);
  const [report, setReport] = useState([]);

  useEffect(() => {
    getAnswers();
  }, [helpfulClicked, props.questionInfo]);
  let getAnswers = () => {
    const { id } = props;
    axios.get(`/api/qa/answers`)
      .then((answersList) => {
        setAnswers(answersList.data.results);
      })
      .catch((err) => { console.error(err); });
  };
  const increaseHelpfulness = (answer) => {
    const id = answer.answer_id || 11111;
    setHelpfulClicked((prevArray) => [...prevArray, id]);
    axios.put(`/api/qa/ahelpfulness`, null)
      .then(() => { getAnswers(); })
      .catch((err) => { console.log(err); });
  };

  const reportAnswer = (answer) => {
    const id = answer.answer_id;
    setReport((prevArray) => [...prevArray, id])
    axios.put(`/api/qa/report`, null)
      .catch((err) => { console.log(err); });
  };

  const insertAnswers = (answer, index) => {
    const date = new Date(answer.date);
    return (
      <div widgetName="QA" className="singleAnswer" key={index}>
        <div className="dog">
          <span widgetName="QA" className="aInAnswer">A: </span>
          <div widgetName="QA">{answer.body}</div>
        </div>
        <div widgetName="QA">
          <AnswerPicture answer={answer} key={index} />
        </div>
        {answer.answerer_name === 'Seller' ? (
          <div widgetName="QA" className="AnswerHelp">
            <p widgetName="QA" className="answerUser">
              by {' '}
              <span style={{ fontWeight: 'bold' }}>{answer.answerer_name}</span>
              ,{' '}
              {date.toDateString().substring(4)}
            </p>
            <div widgetName="QA" className="helpItem">
              {helpfulClicked.indexOf(answer.answer_id) < 0 ? (
                <div>
                  {' '}
                  <p widgetName="QA" onClick={() => { increaseHelpfulness(answer); }}>
                    {' '}
                    Helpful?
                    <span widgetName="QA" className="underline">Yes</span>
                    {' '}
                    (
                    {answer.helpfulness}
                    )
                  </p>
                  {' '}
                </div>
              )

                : (
                  <div>
                    {' '}
                    <p widgetName="QA">
                      Helpful? Yes (
                      {answer.helpfulness}
                      )
                    </p>
                    {' '}
                  </div>
                )}
            </div>
            {report.indexOf(answer.answer_id) === -1 ? <div widgetName="QA" className="helpItem"><p onClick={() => { reportAnswer(answer); }} className="underline"> Report</p></div> : <div widgetName="QA" className="helpItem"><p>Reported</p></div>}
          </div>
        )
          : (
            <div widgetName="QA" className="AnswerHelp">
              <p widgetName="QA" className="answerUser">
                by {' '}
                {answer.answerer_name}
                , {' '}
                {date.toDateString().substring(4)}
                {' '}
                |
                {' '}
              </p>
              <div className="helpItem">
                {helpfulClicked.indexOf(answer.answer_id) < 0 ? (
                  <div widgetName="QA">
                    {' '}
                    <p widgetName="QA" onClick={() => { increaseHelpfulness(answer); }}>
                      {' '}
                      Helpful?
                      <span widgetName="QA" className="underline">Yes</span>
                      {' '}
                      (
                      {answer.helpfulness}
                      )
                    </p>
                    {' '}
                  </div>
                )
                  : (
                    <div widgetName="QA">
                      {' '}
                      <p widgetName="QA">
                        Helpful? Yes (
                        {answer.helpfulness}
                        )
                      </p>
                      {' '}
                    </div>
                  )}
              </div>
              {report.indexOf(answer.answer_id) === -1 ? <div widgetName="QA" className="helpItem"><p onClick={() => { reportAnswer(answer); }} className="underline"> Report</p></div> : <div widgetName="QA" className="helpItem"><p>Reported</p></div>}
            </div>
          )}
      </div>
    );
  };

  return (
    <div widgetName="QA" className="AllAnswers">
      {!moreAnswers
        ? (
          <div widgetName="QA" className="MoreAnswers">
            {answers.slice(0, 2).map((answer, index) => insertAnswers(answer, index))}
            {answers.length > 2 ? <button widgetName="QA" type="button" className="moreButton" onClick={() => { setMoreAnswers(!moreAnswers); }}>See more Answers</button> : null}
          </div>
        )
        : (
          <div widgetName="QA" className="MoreAnswers">
            {answers.map((answer, index) => insertAnswers(answer, index))}
            {answers.length > 2 ? <button widgetName="QA" type="button" className="moreButton" onClick={() => { setMoreAnswers(!moreAnswers); }}>Collpase answers</button> : null}
          </div>
        ) }
    </div>
  );
};

export default AnswerTest;
