import { } from '../../extensions.ts';
import { bench } from '../../bench.ts';
import { CharGrid } from '../../grid.ts';
import { cycleSkipper } from '../../loops.ts';

import example from './example.ts';
import example2 from './example2.ts';
import input from './input.ts';

enum Pulse {
	low,
	high,
}

interface Module {
	inputs: Module[];
	outputs: Module[];
	execute( event: PulseEvent ): PulseEvent[];
}

class FlipFlop implements Module {
	public state = false;
	constructor(
		public inputs: Module[],
		public outputs: Module[],
	) { }
	execute( event: PulseEvent ): PulseEvent[] {
		if ( event.pulse === Pulse.high ) return [];
		this.state = !this.state;
		return this.outputs.map(
			output => new PulseEvent( this, output, this.state ? Pulse.high : Pulse.low )
		);
	}
}

class Conjunctor implements Module {
	public lastPulse = new Map<Module, Pulse>();
	constructor(
		public inputs: Module[],
		public outputs: Module[],
	) {
		for ( const input of inputs ) {
			this.lastPulse.set( input, Pulse.low );
		}
	}
	execute( event: PulseEvent ): PulseEvent[] {
		this.lastPulse.set( event.from, event.pulse );

		const pulse = this.lastPulse.valuesArray().every( last => last === Pulse.high )
			? Pulse.low
			: Pulse.high;

		return this.outputs.map( output => new PulseEvent( this, output, pulse ) );
	}
}

class Broadcaster implements Module {
	constructor(
		public inputs: Module[],
		public outputs: Module[],
	) { }
	execute( event: PulseEvent ): PulseEvent[] {
		return this.outputs.map( output => new PulseEvent( this, output, event.pulse ) );
	}
}

class Button implements Module {
	public inputs = [];
	constructor(
		public outputs: Module[],
	) { }
	execute( event: PulseEvent ): PulseEvent[] {
		throw new Error( 'Cannot execute button module' );
	}
	press(): PulseEvent[] {
		return this.outputs.map( output => new PulseEvent( this, output, Pulse.low ) );
	}
}

class Dummy implements Module {
	public outputs = [];
	constructor(
		public inputs: Module[],
	) { }
	execute( event: PulseEvent ): PulseEvent[] {
		return [];
	}
}

class PulseEvent {
	constructor(
		public from: Module,
		public to: Module,
		public pulse: Pulse,
	) { }
}

function parse( input: string ) {
	const inputs = new Map<string, string[]>();
	const outputs = new Map<string, string[]>();
	const modules = new Map<string, Module>();

	for ( const line of input.split( '\n' ) ) {
		const [ inputNameStr, outputNamesStr ] = line.split( ' -> ' );
		const outputNames = outputNamesStr.split( ', ' );

		if ( inputNameStr === 'broadcaster' ) {
			modules.set( inputNameStr, new Broadcaster( [], [] ) );
			outputs.set( inputNameStr, outputNames );
			for ( const output of outputNames ) {
				inputs.push( output, inputNameStr );
			}
			continue;
		}

		const inputType = inputNameStr.slice( 0, 1 );
		const inputName = inputNameStr.slice( 1 );

		if ( inputType === '%' ) {
			modules.set( inputName, new FlipFlop( [], [] ) );
		} else {
			modules.set( inputName, new Conjunctor( [], [] ) );
		}

		outputs.set( inputName, outputNames );
		for ( const output of outputNames ) {
			inputs.push( output, inputName );
		}
	}

	for ( const [ name, module ] of modules ) {
		module.inputs = ( inputs.get( name ) ?? [] ).map( name => {
			return modules.get( name ) ?? new Dummy( [ module ] );
		} );
		module.outputs = ( outputs.get( name ) ?? [] ).map( name => {
			return modules.get( name ) ?? new Dummy( [ module ] );
		} );
	}

	const broadcaster = modules.get( 'broadcaster' )!;
	const button = new Button( [ broadcaster ] );
	modules.set( 'button', button );
	broadcaster.inputs = [ button ];

	return modules;
}

function part1( input: string, presses: number ) {
	const modules = parse( input );
	const button = modules.get( 'button' )! as Button;

	const pulseTotals = new Map<Pulse, number>( [
		[ Pulse.low, 0 ],
		[ Pulse.high, 0 ],
	] );

	const updateTotals = ( events: PulseEvent[] ) => {
		for ( const { pulse } of events ) {
			pulseTotals.increment( pulse );
		}
	}

	const dispatchEvents = ( events: PulseEvent[] ): PulseEvent[] => {
		return events.flatMap( event => event.to.execute( event ) );
	}

	console.log( { modules } );

	for ( let i = 0; i < presses; i++ ) {
		let events = button.press();
		updateTotals( events );

		while ( events.length > 0 ) {
			events = dispatchEvents( events );
			updateTotals( events );
		}
	}

	return pulseTotals.get( Pulse.low )! * pulseTotals.get( Pulse.high )!;

	// cycleSkipper( {
	// 	start: {},
	// 	transition: ( last ) => ( {} ),
	// 	identity: ( state ) => '',
	// 	iterations: 1000,
	// } );
}

// bench( 'part 1 example', () => part1( example, 1 ), 32000000 );
// bench( 'part 1 example', () => part1( example, 1000 ), 32000000 );
// bench( 'part 1 example', () => part1( example2, 1000 ), 11687500 );

bench( 'part 1 input', () => part1( input, 1000 ) );

// function part2( input: string ) {

// }

// bench( 'part 2 example', () => part2( example ), undefined );

// bench( 'part 2 input', () => part2( input ) );
