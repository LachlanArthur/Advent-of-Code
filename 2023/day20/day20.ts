import { } from '../../extensions.ts';
import { bench } from '../../bench.ts';

import example from './example.ts';
import example2 from './example2.ts';
import input from './input.ts';

enum Pulse {
	low,
	high,
}

interface Module {
	name: string;
	inputs: Module[];
	outputs: Module[];
	execute( event: PulseEvent ): PulseEvent[];
}

class FlipFlop implements Module {
	public state = false;
	constructor(
		public name: string,
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
		public name: string,
		public inputs: Module[],
		public outputs: Module[],
	) {
		this.updateMemory();
	}
	updateMemory() {
		for ( const input of this.inputs ) {
			if ( !this.lastPulse.has( input ) ) {
				this.lastPulse.set( input, Pulse.low );
			}
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
		public name: string,
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
		public name: string,
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
		public name: string,
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
			modules.set( inputNameStr, new Broadcaster( inputNameStr, [], [] ) );
			outputs.set( inputNameStr, outputNames );
			for ( const output of outputNames ) {
				inputs.push( output, inputNameStr );
			}
			continue;
		}

		const inputType = inputNameStr.slice( 0, 1 );
		const inputName = inputNameStr.slice( 1 );

		switch ( inputType ) {
			default:
				throw new Error( `Unknown module type "${inputType}"` );
			case '%':
				modules.set( inputName, new FlipFlop( inputName, [], [] ) );
				break;
			case '&':
				modules.set( inputName, new Conjunctor( inputName, [], [] ) );
				break;
		}

		outputs.set( inputName, outputNames );
		for ( const output of outputNames ) {
			inputs.push( output, inputName );
		}
	}

	for ( const [ name, module ] of modules ) {
		module.inputs = ( inputs.get( name ) ?? [] ).map( name => {
			const input = modules.get( name );
			if ( !input ) {
				const dummy = new Dummy( name, [ module ] );
				modules.set( name, dummy );
				return dummy;
			}
			return input;
		} );
		module.outputs = ( outputs.get( name ) ?? [] ).map( name => {
			const output = modules.get( name );
			if ( !output ) {
				const dummy = new Dummy( name, [ module ] );
				modules.set( name, dummy );
				return dummy;
			}
			return output;
		} );

		if ( module instanceof Conjunctor ) {
			module.updateMemory();
		}
	}

	const broadcaster = modules.get( 'broadcaster' )!;
	const button = new Button( 'button', [ broadcaster ] );
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

	const displayEvents = ( events: PulseEvent[] ): void => {
		for ( const { from, to, pulse } of events ) {
			console.log( '%s -%s-> %s', from.name, Pulse[ pulse ], to.name );
		}
	}

	for ( let i = 0; i < presses; i++ ) {
		let events = button.press();
		updateTotals( events );
		// displayEvents( events );

		while ( events.length > 0 ) {
			events = dispatchEvents( events );
			updateTotals( events );
			// displayEvents( events );
		}
	}

	return pulseTotals.get( Pulse.low )! * pulseTotals.get( Pulse.high )!;
}

bench( 'part 1 example', () => part1( example, 1 ) );
bench( 'part 1 example 2', () => part1( example2, 1 ) );
bench( 'part 1 example', () => part1( example, 1000 ), 32000000 );
bench( 'part 1 example 2', () => part1( example2, 1000 ), 11687500 );

bench( 'part 1 input', () => part1( input, 1000 ) );

// function part2( input: string ) {

// }

// bench( 'part 2 example', () => part2( example ), undefined );

// bench( 'part 2 input', () => part2( input ) );
