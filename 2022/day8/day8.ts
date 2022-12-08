import example from './example';
import input from './input';

function part1( input: string ) {
	const grid = input
		.split( '\n' )
		.map( line => [ ...line ].map( Number ) )

	const tallTrees: number[] = [];

	for ( const [ rowIndex, rowTrees ] of grid.entries() ) {
		for ( const [ colIndex, tree ] of rowTrees.entries() ) {
			const colTrees = grid.map( row => row[ colIndex ] );

			const topTrees = colTrees.slice( 0, rowIndex );
			const bottomTrees = colTrees.slice( rowIndex + 1 );
			const leftTrees = rowTrees.slice( 0, colIndex );
			const rightTrees = rowTrees.slice( colIndex + 1 );

			const visibleTop = topTrees.every( t => t < tree );
			const visibleBottom = bottomTrees.every( t => t < tree );
			const visibleLeft = leftTrees.every( t => t < tree );
			const visibleRight = rightTrees.every( t => t < tree );

			const visible = visibleTop || visibleBottom || visibleLeft || visibleRight;

			if ( visible ) {
				tallTrees.push( tree );
			}
		}
	}

	return tallTrees.length;

}

console.assert( part1( example ) === 21 );

console.log( part1( input ) );

function part2( input: string ) {
	const grid = input
		.split( '\n' )
		.map( line => line.split( '' ).map( Number ) )

	const findVisible = ( start: number, trees: number[] ): number => {
		let count = 0;

		for ( const tree of trees ) {
			if ( tree >= start ) {
				count++;
				break;
			}

			count++;
		}

		return count;
	}

	const treeScores: number[] = [];
	const scoreGrid: number[][] = [];

	for ( const [ rowIndex, rowTrees ] of grid.entries() ) {
		scoreGrid.push( new Array( grid.length ).fill( 0 ) );

		// Exclude edge trees
		if ( rowIndex === 0 || rowIndex === grid.length - 1 ) continue;

		for ( const [ colIndex, tree ] of rowTrees.entries() ) {

			// Exclude edge trees
			if ( colIndex === 0 || colIndex === rowTrees.length - 1 ) continue;

			const colTrees = grid.map( row => row[ colIndex ] );

			const topTrees = colTrees.slice( 0, rowIndex ).reverse();
			const bottomTrees = colTrees.slice( rowIndex + 1 );
			const leftTrees = rowTrees.slice( 0, colIndex ).reverse();
			const rightTrees = rowTrees.slice( colIndex + 1 );

			const visibleTop = findVisible( tree, topTrees );
			const visibleBottom = findVisible( tree, bottomTrees );
			const visibleLeft = findVisible( tree, leftTrees );
			const visibleRight = findVisible( tree, rightTrees );

			const score = visibleTop * visibleBottom * visibleLeft * visibleRight;

			treeScores.push( score );

			scoreGrid[ rowIndex ][ colIndex ] = score;
		}
	}

	return Math.max( ...treeScores );
}

console.assert( part2( example ) === 8 );

console.log( part2( input ) );
