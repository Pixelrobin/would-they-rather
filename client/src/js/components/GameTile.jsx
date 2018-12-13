import React from 'react';

const GameTile = ({ letter, icon, voteData, choosen, rejected }) => {
	return (
		<div className={`game__tile ${ choosen ? 'game__tile--choosen' : '' } ${ rejected ? 'game__tile--rejected' : '' }`}>
			<div class="game__tile__icon">
				<img src={ icon } alt=""/>
				<span>{ letter }</span>
			</div>
			
			<div className="game__tile__text"><span>{ voteData.option }</span></div>
			<div className="game__tile__vote">
				<span className="game__tile__vote__number">{ voteData.votes }</span>
				<span className="game__tile__vote__text">VOTES</span>
			</div>
		</div>
	);
}

export default GameTile;