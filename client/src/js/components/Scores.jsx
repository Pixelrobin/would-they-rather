import React from 'react';

const Scores = ({ data }) => {
	const { scores } = data;
	const top = scores[0];

	const getTableList = () => {
		return scores.map((item, index) => {
			const { name, score } = item;
			
			return (
				<tr className={ index === 0 ? 'scores__table__top' : '' } key={index}>
					<td># { index + 1 }</td>
					<td className="scores__table__name">{ name }</td>
					<td>{ score } Points</td>
				</tr>
			);
		});
	}

	return (
		<div className="scores">
			<table className="scores__table">
				<tbody>
					{ getTableList() }
				</tbody>
			</table>
		</div>
	);
}

export default Scores;