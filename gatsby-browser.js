import { globalHistory } from '@reach/router';

const pageTransitionEvent = 'PageTransition::exit';

const transitionDelay = 400;

// exports.shouldUpdateScroll = () => false;
export const shouldUpdateScroll = ({ routerProps: { location }, getSavedScrollPosition }) => {
	if (location.action === 'PUSH') {
		window.setTimeout(() => {
			window.scrollTo(0, 0);
			const event = new global.window.CustomEvent(pageTransitionEvent, {
				detail: { location }
			});
			global.window.dispatchEvent(event);
		}, transitionDelay);
	} else {
		const savedPosition = getSavedScrollPosition(location);
		window.setTimeout(() => {
			window.scrollTo(...(savedPosition || [0, 0]));
			const event = new global.window.CustomEvent(pageTransitionEvent, {
				detail: { location }
			});
			global.window.dispatchEvent(event);
		}, transitionDelay);
	}
	return false;
};

export const onInitialClientRender = () => {
	/**
	 * This is a workaround for a bug in Gatsby
	 *
	 * See https://github.com/gatsbyjs/gatsby/issues/8357 for more details
	 */
	globalHistory._onTransitionComplete();
};
