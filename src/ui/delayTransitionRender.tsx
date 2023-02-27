import React from 'react';

interface DelayTransitionRenderProps {
	delay: number;
	timeout: object;
}
interface DelayTransitionRenderState {
	shouldRender: boolean;
}
export const delayTransitionRender = <P extends object>(Component: React.ComponentType<P>) =>
	class DelayedTransitionWrapper extends React.Component<P & DelayTransitionRenderProps & any, DelayTransitionRenderState> {
		private timeout: NodeJS.Timer;

		constructor(props) {
			super(props);
			this.state = {
				shouldRender: props.delay === 0
			};
		}

		componentDidMount() {
			if (this.props.delay !== 0) {
				this.timeout = setTimeout(() => this.setState({ shouldRender: true }), this.props.delay);
			}
		}
		componentWillUnmount() {
			clearTimeout(this.timeout);
		}

		render() {
			// console.log('should render', this.state.shouldRender);
			return this.state.shouldRender || typeof window === `undefined` ? <Component {...this.props as P} /> : null;
		}
	};
