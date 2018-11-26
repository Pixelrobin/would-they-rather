import React from 'react';

const GameTile = ({ voteData, choosen, rejected }) => {
	return (
		<div className={`game__tile ${ choosen ? 'game__tile--choosen' : '' } ${ rejected ? 'game__tile--rejected' : '' }`}>
			<div className="game__tile__text">{ voteData.option }</div>
			<div className="game__tile__vote">
				<span className="game__tile__vote__number">{ voteData.votes }</span>
				<span className="game__tile__vote__text">VOTES</span>
			</div>
		</div>
	);
}

export default GameTile;