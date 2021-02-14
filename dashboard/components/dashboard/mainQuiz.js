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
    notStart: false,
  };

  loadQuizData = () => {
    // console.log(this.props.ques[0]);

    // {

    // }
    this.setState(() => {
      return {
        // questions: quizData[this.state.currentQuestion].question,
        // answer: quizData[this.state.currentQuestion].answer,
        // options: quizData[this.state.currentQuestion].options,

        questions:
          this.props.q[this.state.currentQuestion] == null
            ? quizData[this.state.currentQuestion].question
            : this.props.q[this.state.currentQuestion].text,
        answer:
          this.props.q[this.state.currentQuestion] == null
            ? quizData[this.state.currentQuestion].answer
            : this.props.q[this.state.currentQuestion].options[
                this.props.q[this.state.currentQuestion].answerIndex
              ],
        options:
          this.props.q[this.state.currentQuestion] == null
            ? quizData[this.state.currentQuestion].options
            : this.props.q[this.state.currentQuestion].options,
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
          questions: this.props.q[this.state.currentQuestion].text,
          answer: this.props.q[this.state.currentQuestion].options[
            this.props.q[this.state.currentQuestion].answerIndex
          ],
          options: this.props.q[this.state.currentQuestion].options,
        };
      });
    }
  }
  //check answer
  checkAnswer = (answer) => {
    this.setState({ myAnswer: answer, disabled: false });
  };
  finishHandler = () => {
    if (this.state.currentQuestion === this.props.q.length - 1) {
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
            Quiz Score: {this.state.score} / {this.props.q.length} answers
            correct{" "}
          </h3>
          <div className="">
            The correct answers for the quiz are:
            <ul className="ul">
              {this.props.q.map((item, index) => (
                <li
                  key={index}
                  className="mt-4 ui floating message options"
                  key={index}
                >
                  <div className="resultTable">
                    {" "}
                    Question: {item.text}{" "}
                    <div>
                      {" "}
                      Correct Answer:{" "}
                      <span id="correctAnswer">
                        {" "}
                        {item.options[item.answerIndex]}{" "}
                      </span>{" "}
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
      // TODO:
      if (this.state.currentQuestion == 0) {
        return (
          <div>
            <div>
              {this.state.notStart && (
                <div>Sorry No Questions are available for now!</div>
              )}

              <button
                className="bg-indigo-700 p-2 rounded-md"
                onClick={() => {
                  if (
                    this.props.q == null ||
                    this.props.q.length == 0 ||
                    this.props.q.length == 1
                  ) {
                    this.setState({
                      notStart: true,
                    });
                  } else {
                    this.setState({
                      currentQuestion: currentQuestion + 1,
                    });
                  }
                }}
              >
                Click to start the quiz!
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="App w-1/2">
            <h1 className="font-semibold text-3xl">{this.state.questions} </h1>
            <span className="font-normal text-1xl pb-5">{`Question ${this.state
              .currentQuestion + 1} / ${this.props.q.length} remaining `}</span>
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
            {currentQuestion < this.props.q.length - 1 && (
              <button
                className="ui inverted button pl-5 pr-10 pt-2 mt-4 pb-2 bg-gray-700"
                disabled={this.state.disabled}
                onClick={this.nextQuestionHandler}
              >
                Next
              </button>
            )}
            {/* //adding a finish button */}
            {currentQuestion === this.props.q.length - 1 && (
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
}
export default MainQuiz;
