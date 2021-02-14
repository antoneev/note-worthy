import React, { Component } from "react";
import PropTypes from "prop-types";
import ChatBot, { Loading } from "react-simple-chatbot";
import axios from "axios";

class DBPedia extends Component {
  getAnswers() {}

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: "",
      trigger: false,
    };

    this.triggetNext = this.triggetNext.bind(this);
  }

  componentWillMount() {
    const self = this;
    const { steps } = this.props;
    const search = steps.search.value;
    // const endpoint = encodeURI("https://dbpedia.org");
    // const query = encodeURI(`
    //   select * where {
    //   ?x rdfs:label "${search}"@en .
    //   ?x rdfs:comment ?comment .
    //   FILTER (lang(?comment) = 'en')
    //   } LIMIT 100
    // `);

    // const queryUrl = `https://dbpedia.org/sparql/?default-graph-uri=${endpoint}&query=${query}&format=json`;

    // const xhr = new XMLHttpRequest();

    // xhr.addEventListener("readystatechange", readyStateChange);

    async function readyStateChange() {
      try {
        const config = {
          headers: {
            Authorization: `Token fb1a40839a88eff4e966e2aff720cf2d1deeca4e`,
          },
        };
        const response = await axios.post(
          "https://treehacks-server-oj3ri.ondigitalocean.app/quickstart/chatbot/3/",
          {
            question: search,
          },
          config
        );

        self.setState({ loading: false, result: response.data.answer });

        console.log(response);
      } catch (err) {
        console.log(err);

        console.log(err);
      }

      //   if (this.readyState === 4) {
      // const data = JSON.parse(this.responseText);
      // const bindings = data.results.bindings;
      // if (bindings && bindings.length > 0) {
      // } else {
      //   self.setState({ loading: false, result: "Not found." });
      // }
      //   }
    }

    readyStateChange();

    // xhr.open("GET", queryUrl);
    // xhr.send();
  }

  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { trigger, loading, result } = this.state;

    return (
      <div className="dbpedia">
        {loading ? (
          <Loading />
        ) : result == null ? (
          "Sorry, we can't find answer for that one! You can try another. Thanks for using Note-Worthy!"
        ) : (
          result
        )}
        {!loading && (
          <div
            style={{
              textAlign: "center",
              marginTop: 20,
            }}
          >
            {!trigger && (
              <button
                className="bg-purple-700 p-2"
                onClick={() => this.triggetNext()}
              >
                Search Again
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}

DBPedia.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
};

DBPedia.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
};

const config = {
  width: "300px",
  height: "400px",
  floating: true,
};

const ExampleDBPedia = () => (
  <ChatBot
    steps={[
      {
        id: "1",
        message: "Search for your doubts here 😀",
        trigger: "search",
      },
      {
        id: "search",
        user: true,
        trigger: "3",
      },
      {
        id: "3",
        component: <DBPedia />,
        waitAction: true,
        trigger: "1",
      },
    ]}
    {...config}
  />
);

export default ExampleDBPedia;
