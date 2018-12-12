import React from "react";

import GameTile from './GameTile';
import { BubbleLeft, BubbleRight } from '../../media/*.svg';

const Game = ({ data, time }) => {
	const { votes, choice } = data;

	const checkChoosen = id => choice === id;
	const checkRejected = id => {
		if (choice !== -1) {
			return choice !== id
		} else return false;
	}

	return (
		<div className="game">
			<GameTile letter="A" icon={ BubbleLeft } voteData={ votes[0] } choosen={ checkChoosen(0) } rejected={ checkRejected(0) }/>
			<GameTile letter="B" icon={ BubbleRight } voteData={ votes[1] } choosen={ checkChoosen(1) } rejected={ checkRejected(1) }/>
			<div className="game__countdown">{ time }</div>
		</div>
	);
}

export default Game;