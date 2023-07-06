import React, { useState, useEffect } from 'react';
import Answer from '../Answer/Answer.jsx';
import { getAnswers, markQuestionAsHelpful } from '../routes.js';
import AnswerModal from '../Answer/AnswerModal.jsx';

const Question = ({ questionId, question, productName }) => {

  const [helpfulness, setHelpfulness] = useState(question.question_helpfulness);
  const [voted, setVoted] = useState(false);
  const [answerData, setAnswerData] = useState([]);
  const [alreadyReported, setAlreadyReported] = useState(false);
  const [visibleAnswers, setVisibleAnswers] = useState(2);
  const [allAnswersLoaded, setallAnswersLoaded] = useState(false);


  useEffect(() => {
    getAnswers(questionId)
      .then((response) => {
        setAnswerData(response);
      })
      .catch((error) => console.error('Error fetching answers in Question component', error));
  }, [questionId]);

  useEffect(() => {
    if (visibleAnswers >= answerData.length) {
      setallAnswersLoaded(true);
    }
  }, [visibleAnswers, answerData]);

  const handleLoadMore = () => {
    setVisibleAnswers(visibleAnswers+2);
    setallAnswersLoaded(true);
  };

  const handleClick = () => {
    if (!voted) {
      markQuestionAsHelpful(question.question_id);
      setHelpfulness(helpfulness + 1);
      setVoted(true);
    } else {
      alert('You can only vote once, sorry!');
    }
  };

  const handleReport = () => {
    setAlreadyReported(true);
    alert('Question reported')
  };


  return (
    <div>
      <div className="flex flex-row items-center justify-between items-center w-full">
        <h4 className="mr-4 p-3">
          <b>Q: {question.question_body}</b>
        </h4>
        <div className="flex items-center" id="question-buttons" style={{ whiteSpace: 'nowrap' }}>
          <small className="flex items-baseline">
            <div className="helpful">
              Helpful?&nbsp; <button onClick={handleClick} style={{ textDecorationLine: 'underline' }}>Yes ({helpfulness}) </button>&nbsp; | &nbsp;
            </div>
            <div className="answerModal mr-2">
              <AnswerModal productName={productName} question={question.question_body} questionId={questionId} />
            </div>
            <div className="reported">
              {alreadyReported ? (
                <button disabled>Reported</button>
              ) : (
                <button style={{ textDecorationLine: 'underline' }} onClick={() => handleReport()}>
                  Report
                </button>
              )}
            </div>
          </small>
        </div>

      </div>
      {answerData.length === 0 ? (
        <><div className="flex flex-row items-center justify-between items-center w-full mr-4 p-3"><p><b>A: </b>No answers to this question!</p></div><br /></>
      ) : (
        <>
          {answerData.length > visibleAnswers ? (
            answerData.slice(0, visibleAnswers).map((answer) => (
              <div className="flex flex-row items-center justify-between items-center w-full mr-4 p-3"><Answer key={answer.answer_id} answerId={answer.answer_id} answer={answer} helpfulness={answer.helpfulness} setHelpfulness={setHelpfulness}/></div>
            ))
          ) : (
            answerData.map((answer) => (
              <div className="flex flex-row items-center justify-between items-center w-full mr-4 p-3">
              <Answer key={answer.answer_id} answerId={answer.answer_id} answer={answer} helpfulness={answer.helpfulness} setHelpfulness={setHelpfulness}/></div>
            ))
          )}
        </>
      )}
    </div>
  )
};

  export default Question;


