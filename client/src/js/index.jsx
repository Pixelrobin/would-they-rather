import React from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';

import Game from './components/Game';
import TableList from './components/TableList';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = { data: {} }
	}

	componentDidMount() {
		this.socket = io('http://localhost:80');

		const stateUpdater = name => data => {
			let newState = Object.assign({}, this.state);
			newState[name] = data;

			console.log(data);

			this.setState(newState);
		}
		
		this.socket.on('data', stateUpdater('data'));
		this.socket.on('time', stateUpdater('time'));
	}

	componentWillUnmount() {
		this.socket.removeAllListeners();
		this.socket.close();
	}

	render() {
		const { data, time } = this.state;

		if (data) {
			if (data.type === 'game') return <Game data={ data } time={ time }/>
			else if (data.type === 'tables') return <TableList data={ data }/>
		}

		return <React.Fragment></React.Fragment>
	}
}

let app = document.getElementById("app");

ReactDOM.render(<App/>, app);