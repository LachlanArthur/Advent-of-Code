import '../../extensions.ts';

import example from './example.ts';
import input from './input.ts';

type Resource = 'ore' | 'clay' | 'obsidian' | 'geode';
type Robot = Resource;

interface State {
	blueprint: Blueprint,
	minute: number,
	resources: Record<Resource, number>;
	robots: Record<Robot, number>;
	buildingRobot?: Robot;
}

interface Cost extends Record<Resource, number> { }
interface Resources extends Cost { };

const resourceTypes: Resource[] = [ 'geode', 'obsidian', 'clay', 'ore' ];

interface Blueprint extends Record<Resource, Cost> {
	blueprint: number;
}

function canBuildRobot( state: State, robot: Robot ): Resources | null {
	const oreCost = state.blueprint[ robot ].ore;
	const clayCost = state.blueprint[ robot ].clay;
	const obsidianCost = state.blueprint[ robot ].obsidian;

	if (
		state.resources.ore >= oreCost &&
		state.resources.clay >= clayCost &&
		state.resources.obsidian >= obsidianCost
	) {
		return {
			ore: state.resources.ore - oreCost,
			clay: state.resources.clay - clayCost,
			obsidian: state.resources.obsidian - obsidianCost,
			geode: state.resources.geode,
		}
	}

	return null;
}

function tickState( current: State ) {
	const next: State = {
		blueprint: current.blueprint,
		minute: current.minute + 1,
		resources: {
			ore: current.resources.ore + current.robots.ore,
			clay: current.resources.clay + current.robots.clay,
			obsidian: current.resources.obsidian + current.robots.obsidian,
			geode: current.resources.geode + current.robots.geode,
		},
		robots: {
			ore: current.robots.ore,
			clay: current.robots.clay,
			obsidian: current.robots.obsidian,
			geode: current.robots.geode,
		},
	};

	if ( current.buildingRobot ) {
		next.robots[ current.buildingRobot ]++;
	}

	return next;
}

function nextStates( current: State, maxTime: number ): State[] {
	const next: State[] = [];

	if ( current.minute === maxTime ) return [];

	for ( const resource of resourceTypes ) {
		const newResources = canBuildRobot( current, resource );
		if ( newResources ) {
			next.push( tickState( {
				...current,
				resources: newResources,
				buildingRobot: resource,
			} ) );
		}
	}

	// Don't make a robot
	next.push( tickState( current ) )

	return next.slice( 0, 2 );
}

function* depthFirstSearch<T extends State>( start: T, maxTime: number ) {
	let stack: T[] = [ start ];

	while ( stack.length !== 0 ) {
		const current = stack.pop()!;

		const next = nextStates( current, maxTime ) as T[];

		if ( next.length === 0 ) {
			yield current;
			continue;
		} else {
			stack.push( ...next );
		}
	}
}

function parse( input: string ) {
	return input
		.split( '\n' )
		.map( line => line.match( /\d+/g )!.map( Number ) )
		.map( ( [
			blueprint,
			oreRobotCostOre,
			clayRobotCostOre,
			obsidianRobotCostOre,
			obsidianRobotCostClay,
			geodeRobotCostOre,
			geodeRobotCostObsidian,
		] ) => ( {
			blueprint,
			ore: { ore: oreRobotCostOre, clay: 0, obsidian: 0 } as Cost,
			clay: { ore: clayRobotCostOre, clay: 0, obsidian: 0 } as Cost,
			obsidian: { ore: obsidianRobotCostOre, clay: obsidianRobotCostClay, obsidian: 0 } as Cost,
			geode: { ore: geodeRobotCostOre, clay: 0, obsidian: geodeRobotCostObsidian } as Cost,
		} ) as Blueprint )
}

function countGeodes( blueprints: Blueprint[], maxTime: number ) {
	const blueprintGeodes = new Map<number, number>();

	for ( const blueprint of blueprints ) {

		const startState: State = {
			minute: 0,
			blueprint,
			resources: {
				ore: 0,
				clay: 0,
				obsidian: 0,
				geode: 0,
			},
			robots: {
				ore: 1,
				clay: 0,
				obsidian: 0,
				geode: 0,
			},
		};

		let maxGeodes = 0;
		let endCount = 0;

		for ( const end of depthFirstSearch( startState, maxTime ) ) {
			if ( endCount % 100_000 === 0 ) console.log( endCount );

			if ( end.resources.geode > maxGeodes ) {
				console.log( `[${blueprint.blueprint}] #${endCount}: ${end.resources.geode} geodes` );
				maxGeodes = end.resources.geode;
			}

			endCount++;
		}

		console.log( `Found ${maxGeodes} geodes in ${endCount} routes for blueprint ${blueprint.blueprint}` );

		blueprintGeodes.set( blueprint.blueprint, maxGeodes );

	}

	return blueprintGeodes;
}

function part1( input: string, maxTime: number ) {
	const blueprints = parse( input );

	const blueprintGeodes = countGeodes( blueprints, maxTime );

	return blueprintGeodes.entriesArray()
		.map( entry => entry.product() )
		.sum()
}

console.time( 'part 1 example' );
console.assert( part1( example, 24 ) === 33 );
console.timeEnd( 'part 1 example' );

console.time( 'part 1 input' );
console.log( 'part 1 output:', part1( input, 24 ) );
console.timeEnd( 'part 1 input' );

function part2( input: string, maxTime: number, maxBlueprints: number ) {
	const blueprints = parse( input )
		.slice( 0, maxBlueprints );

	const blueprintGeodes = countGeodes( blueprints, maxTime );

	return blueprintGeodes.valuesArray().product();
}

console.time( 'part 2 example' );
console.assert( part2( example, 32, 2 ) === 3472 );
console.timeEnd( 'part 2 example' );

console.time( 'part 2 input' );
console.log( 'part 2 output:', part2( input, 32, 3 ) );
console.timeEnd( 'part 2 input' );
