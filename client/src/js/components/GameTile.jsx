import React from 'react';

import Confetti from './Confetti';

const ConditionalConfetti = props => {
	if (props.show) {
		return <Confetti { ...props }></Confetti>
	} else return <React.Fragment></React.Fragment>
}

class GameTile extends React.Component {
	constructor(props) {
		super(props);

		this.tile = React.createRef();
	}
	
	componentDidMount() {

	}

	render() {
		const { letter, icon, voteData, choosen, rejected } = this.props;

		return (
			<React.Fragment>
				<div ref={ this.tile } className={`game__tile ${ choosen ? 'game__tile--choosen' : '' } ${ rejected ? 'game__tile--rejected' : '' }`}>
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

				<ConditionalConfetti show={ choosen } padding={ 200 } elementRef={ this.tile } />
			</React.Fragment>
		);
	}
}

export default GameTile;