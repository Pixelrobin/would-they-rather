import React from 'react';

const Scores = ({ data }) => {
	const { tables } = data;

	const getTableList = () => {
		return tables.map((table, index) => {
			const { name, score, top } = table;
			
			return (
				<tr className={ top ? 'scores__table__top' : '' } key={index}>
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