import React, { useEffect, useState } from "react";
import { assets } from "../assets/index";
import Timer from "./Timer";
import "./QuizQuestion.css";

const QuizQuestion = () => {
  const API_URL = "https://api.jsonserve.com/Uw5CrX";
  const [data, setData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const proxyUrl = "https://api.allorigins.win/get?url=";
        const encodedUrl = encodeURIComponent(API_URL);
        const res = await fetch(`${proxyUrl}${encodedUrl}`);
        const jsonResponse = await res.json();
        const parsedData = JSON.parse(jsonResponse.contents);
        setData(parsedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchApiData();
  }, []);

  const handleAnswerChange = (questionId, optionId) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionId });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    data.questions.forEach((question) => {
      const selectedOption = selectedAnswers[question.id];
      const correctOption = question.options.find((option) => option.is_correct);
      if (selectedOption && selectedOption === correctOption.id) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowScore(true);
  };

  const getStatusCounts = () => {
    if (!data) return { confirmed: 0, visited: 0, notVisited: 0 };

    const totalQuestions = data.questions.length;
    const confirmed = Object.values(selectedAnswers).filter(Boolean).length;
    const visited = Object.keys(selectedAnswers).length;
    const notVisited = totalQuestions - visited;

    return {
      confirmed,
      visited: visited - confirmed,
      notVisited,
    };
  };

  const { confirmed, visited, notVisited } = getStatusCounts();

  return (
    <div className="question-wrap">
      <div className="quiz-header">
        <h1 className="quiz-title">Quiz Application</h1>
        {quizStarted && !showScore && <Timer />}
      </div>
      {!quizStarted ? (
        <div className="start-button-container">
          <button className="start-quiz-button" onClick={() => setQuizStarted(true)}>
            Start Quiz
          </button>
        </div>
      ) : data ? (
        <>
          {showScore ? (
            <div className="thank-you-container">
              <div className="quiz-results-container">
                <img src={assets.ThankU} alt="Thank You Icon" className="thank-you-image" />
                <h1 className="thank-you-title">Thank You!</h1>
                <div className="quiz-result">
                  <div>
                    <h2 className="quiz-result-title">Quiz Results</h2>
                    <p className="result-text">Correct Answers: {score}</p>
                    <p className="result-text">
                      <span className="incorrect-label">
                        Incorrect Answers: {data.questions.length - score}
                      </span>
                    </p>
                  </div>
                  <div className="status-list">
                    <div className="status-item">
                      <div className="status-indicator confirmed"></div>
                      <span>Confirmed Answer: {confirmed}</span>
                    </div>
                    <div className="status-item">
                      <div className="status-indicator visited"></div>
                      <span>Not Answered: {notVisited}</span>
                    </div>
                    <div className="status-item">
                      <div className="status-indicator not-visited"></div>
                      <span>Not Visited: {notVisited}</span>
                    </div>
                  </div>
                </div>
                <div className="questions-summary">
                  <h3>Questions & Correct Answers:</h3>
                  {data.questions.map((question) => {
                    const correctOption = question.options.find((option) => option.is_correct);
                    return (
                      <div key={question.id} className="question-summary-item">
                        <p>
                          <strong>{question.description}</strong>
                        </p>
                        <p className="correct-answer">Correct Answer: {correctOption.description}</p>
                        <p
                          className={`your-answer ${
                            selectedAnswers[question.id] !== correctOption.id &&
                            selectedAnswers[question.id]
                              ? "incorrect"
                              : ""
                          }`}
                        >
                          Your Answer: {" "}
                          {selectedAnswers[question.id] ? (
                            question.options.find(
                              (option) => option.id === selectedAnswers[question.id]
                            )?.description
                          ) : (
                            <span className="not-answered">Not Answered</span>
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              {data.questions.length > 0 && (
                <div className="question-content">
                  <p>
                    <span>{currentQuestionIndex + 1}. </span>
                    {data.questions[currentQuestionIndex].description}
                  </p>
                  <div>
                    {data.questions[currentQuestionIndex].options.map((option) => (
                      <label
                        key={option.id}
                        className={`option-label ${
                          selectedAnswers[data.questions[currentQuestionIndex].id] === option.id
                            ? "selected-option"
                            : ""
                        }`}
                        onClick={() =>
                          handleAnswerChange(data.questions[currentQuestionIndex].id, option.id)
                        }
                      >
                        <input
                          type="radio"
                          name={`answer-${data.questions[currentQuestionIndex].id}`}
                          value={option.id}
                          checked={
                            selectedAnswers[data.questions[currentQuestionIndex].id] === option.id
                          }
                          onChange={() =>
                            handleAnswerChange(data.questions[currentQuestionIndex].id, option.id)
                          }
                        />
                        {option.description}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="nav-buttons">
                <button
                  className="button"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                {currentQuestionIndex === data.questions.length - 1 ? (
                  <button className="button" onClick={handleSubmitQuiz}>
                    Submit
                  </button>
                ) : (
                  <button className="button" onClick={handleNextQuestion}>
                    Next
                  </button>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <p className="loading-circle"></p>
      )}
    </div>
  );
};

export default QuizQuestion;



