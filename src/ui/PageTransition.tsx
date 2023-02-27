//Import necessary dependencies
import React from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';
import { Globals } from '../utils/Globals';
import { delayTransitionRender } from './delayTransitionRender';

//This variable will be responsible for our animation duration
const timeout = 400;
export const pageTransitionEvent = 'PageTransition::exit';

export interface IPageTransitionProps {
	location: any;
}

//This object contains basic styles for animation, but you can extend them to whatever you like. Be creative!
const getTransitionStyles = {
	entering: {
		// position: 'absolute',
		opacity: 0
	},
	entered: {
		transition: `opacity ${timeout}ms ease-in-out`,
		opacity: 1
	},
	exiting: {
		// position: 'absolute',
		transition: `opacity ${timeout}ms ease-in-out`,
		opacity: 0
	}
};
// @ts-ignore
const DelayedTransition = delayTransitionRender(Transition);

class PageTransition extends React.PureComponent<IPageTransitionProps> {
	render() {
		//Destructuring props to avoid garbage this.props... in return statement
		const { children, location } = this.props;
		let opacity = 0;

		const firstLoad = Globals.SITE_FIRST_LOAD;
		if (Globals.SITE_FIRST_LOAD) {
			opacity = 1;
			Globals.SITE_FIRST_LOAD = false;
		}
		let currTimeout = timeout;
		if (typeof window === 'undefined') {
			opacity = 1;
		}

		var defaultStyle = {
			transition: 'opacity ' + `${currTimeout}ms ease-in-out`,
			opacity: opacity
		};

		return (
			//Using TransitionGroup and ReactTransition which are both
			//coming from  'react-transition-group' and are required for transitions to work
			<TransitionGroup>
				<DelayedTransition
					//the key is necessary here because our ReactTransition needs to know when pages are entering/exiting the DOM
					key={location.pathname}
					//duration of transition
					delay={firstLoad ? 0 : currTimeout}
					timeout={{
						enter: currTimeout,
						exit: currTimeout
					}}
					onEnter={node => node.offsetHeight}
					mountOnEnter={true}
					unmountOnExit={true}
				>
					{//Application of the styles depending on the status of page(entering, exiting, entered) in the DOM
					status => (
						<div
							style={{
								...defaultStyle,
								...getTransitionStyles[status]
							}}
						>
							{children}
						</div>
					)}
				</DelayedTransition>
			</TransitionGroup>
		);
	}
}

export default PageTransition;
