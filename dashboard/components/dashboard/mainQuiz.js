import React from "react";
import { quizData } from "./quizData";

class MainQuiz extends React.Component {
  state = {
    currentQuestion: 0,
    myAnswer: null,
    options: [],
    score: 0,
    disabled: true,
    isEnd: false,
  };

  loadQuizData = () => {
    // console.log(quizData[0].question)
    this.setState(() => {
      return {
        questions: quizData[this.state.currentQuestion].question,
        answer: quizData[this.state.currentQuestion].answer,
        options: quizData[this.state.currentQuestion].options,
      };
    });
  };

  componentDidMount() {
    this.loadQuizData();
  }
  nextQuestionHandler = () => {
    // console.log('test')
    const { myAnswer, answer, score } = this.state;

    if (myAnswer === answer) {
      this.setState({
        score: score + 1,
      });
    }

    this.setState({
      currentQuestion: this.state.currentQuestion + 1,
    });
    console.log(this.state.currentQuestion);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentQuestion !== prevState.currentQuestion) {
      this.setState(() => {
        return {
          disabled: true,
          questions: quizData[this.state.currentQuestion].question,
          options: quizData[this.state.currentQuestion].options,
          answer: quizData[this.state.currentQuestion].answer,
        };
      });
    }
  }
  //check answer
  checkAnswer = (answer) => {
    this.setState({ myAnswer: answer, disabled: false });
  };
  finishHandler = () => {
    if (this.state.currentQuestion === quizData.length - 1) {
      this.setState({
        isEnd: true,
      });
    }
    if (this.state.myAnswer === this.state.answer) {
      this.setState({
        score: this.state.score + 1,
      });
    }
  };
  render() {
    const { options, myAnswer, currentQuestion, isEnd } = this.state;

    if (isEnd) {
      return (
        <div className="result">
          <h3 className="font-medium text-2xl">
            {" "}
            Quiz Score: {this.state.score} / {quizData.length} answers correct{" "}
          </h3>
          <div className="">
            The correct answers for the quiz are:
            <ul className="ul">
              {quizData.map((item, index) => (
                <li className="mt-4 ui floating message options" key={index}>
                  <div className="resultTable">
                    {" "}
                    Question: {item.question}{" "}
                    <div>
                      {" "}
                      Correct Answer:{" "}
                      <span id="correctAnswer"> {item.answer} </span>{" "}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button className="ui inverted button">Back to Dashboard</button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="App w-1/2">
          <h1 className="font-semibold text-3xl">{this.state.questions} </h1>
          <span className="font-normal text-1xl pb-5">{`Question ${
            this.state.currentQuestion + 1
          } / ${quizData.length} remaining `}</span>
          {options.map((option) => (
            <p
              key={option.id}
              className={`pb-2  mt-3 ui floating message options
         ${myAnswer === option ? "selected" : null}
         `}
              onClick={() => this.checkAnswer(option)}
            >
              {option}
            </p>
          ))}
          {currentQuestion < quizData.length - 1 && (
            <button
              className="ui inverted button pl-5 pr-10 pt-2 mt-4 pb-2 bg-gray-700"
              disabled={this.state.disabled}
              onClick={this.nextQuestionHandler}
            >
              Next
            </button>
          )}
          {/* //adding a finish button */}
          {currentQuestion === quizData.length - 1 && (
            <button
              className="ui inverted button pl-5 pr-10 pt-2 pb-2 mt-4 bg-gray-700"
              onClick={this.finishHandler}
            >
              Finish
            </button>
          )}
        </div>
      );
    }
  }
}
export default MainQuiz;
