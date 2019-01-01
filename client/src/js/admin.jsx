import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			questions: [],
			options: []
		}

		this.questions = React.createRef();
		this.start = React.createRef();
		this.buttonA = React.createRef();
		this.buttonB = React.createRef();
	}

	componentDidMount() {
		fetch('/questions')
			.then(res => res.json())
			.then(questions => this.setState({ questions }));
		
		this.start.current.addEventListener('click', e => {
			e.preventDefault();

			const questions = this.questions.current;
			const selected = questions.options[questions.selectedIndex].value;

			fetch(`/start/${ selected }`)
				.then(res => res.json())
				.then(options => this.setState({ options }));
		});

		const endRound = id => e => {
			if (this.state.options[id]) {
				e.preventDefault();

				fetch(`/end/${ id }`)
					.then(res => res.text())
					.then(res => this.setState({ options: [] }));
			}
		}

		this.buttonA.current.addEventListener('click', endRound(0));
		this.buttonB.current.addEventListener('click', endRound(1));
	}

	render() {
		const { options, questions } = this.state;

		const selectOptions = questions.map((question, ind) => {
			return <option key={ ind } value={ind}>{ `${ question[0] } or ${ question[1] }` }</option>
		});

		return (
			<div className="admin">
				<h1>Would They Rather Admin</h1>

				<select ref={ this.questions }>{ selectOptions }</select>
				<button ref={ this.start }>Start Question</button>

				<div className="options">
					<button ref={this.buttonA}>{ options[0] ? options[0] : '...' }</button>
					<button ref={this.buttonB}>{ options[1] ? options[1] : '...' }</button>
				</div>
			</div>
		)
	}
}

let app = document.getElementById("app");

ReactDOM.render(<App/>, app);