import React from "react";

import GameTile from './GameTile';
import Confetti from './Confetti';

import { BubbleLeft, BubbleRight } from '../../media/*.svg';

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.confetti = React.createRef();

		this.tileA = React.createRef();
		this.tileB = React.createRef();
	}

	componentDidUpdate(prevProps) {
		const chosen = this.props.data.choice;

		if (chosen !== prevProps.data.choice) {
			let tile;
			
			switch (chosen) {
				case 0: tile = this.tileA; break;
				case 1: tile = this.tileB; break;
			}

			console.log(tile);

			if (tile) {
				const bounds = tile.current.getBounds();

				this.confetti.current.burst(bounds);
			}
		}
	}

	render() {
		const { data, time } = this.props;
		const { votes, choice } = data;

		const checkChoosen = id => choice === id;
		const checkRejected = id => {
			if (choice !== -1) {
				return choice !== id
			} else return false;
		}

		return (
			<React.Fragment>
				<div className="game">
					<GameTile ref={ this.tileA } letter="A" icon={ BubbleLeft } voteData={ votes[0] } choosen={ checkChoosen(0) } rejected={ checkRejected(0) }/>
					<GameTile ref={ this.tileB } letter="B" icon={ BubbleRight } voteData={ votes[1] } choosen={ checkChoosen(1) } rejected={ checkRejected(1) }/>
					<div className="game__countdown">{ time }</div>
				</div>

				<Confetti ref={ this.confetti } padding={ 200 }></Confetti>
			</React.Fragment>
		);
	}
}

export default Game;