import * as React from 'react';

if (typeof window !== 'undefined') {
	require('intersection-observer'); // optional polyfill
}
import Observer from '@researchgate/react-intersection-observer';
import * as styles from './ViewableMonitor.module.scss';
import { ScrollMonitor } from '../../utils/ScrollMonitor';
import { ReactElement } from 'react';

export default class ViewableMonitor extends React.Component<{ disabled?: boolean; delay?: number | boolean; fadeOnly?: boolean }> {
	// private handleNode:any;

	private static SCROLL_MONITOR = new ScrollMonitor();

	handleChange = (event, unobserve) => {
		if (event.isIntersecting) {
			unobserve();
			const target = event.target;
			if (this.props.fadeOnly) {
				target.classList.add(styles.fadeIn);
				return;
			}

			let inClass = ViewableMonitor.SCROLL_MONITOR.scrollingDown ? styles.fadeInUp: styles.fadeInDown;
			let inClassGlobal = ViewableMonitor.SCROLL_MONITOR.scrollingDown ? 'moduleAnimateInUp' :'moduleAnimateInDown';
			if (this.props.delay) {
				if (typeof this.props.delay === 'number') {
					target.classList.add(styles['visibleDelay-' + this.props.delay]);
				}
			}
			target.classList.add(inClass);
			target.classList.add(inClassGlobal);
			target.classList.add('moduleAnimateIn');
		}
	};

	render() {
		if (this.props.disabled) {
			return this.props.children;
		} else {
			const element = React.Children.only(this.props.children) as ReactElement;

			const childClone = React.cloneElement(element, {
				// ref: (ref) => this.handleNode = ref,
				className: element.props.className ? `${element.props.className} ${styles.hidden}` : styles.hidden
			});

			return (
				<Observer disabled={this.props.disabled} onChange={this.handleChange}>
					{childClone}
				</Observer>
			);
		}
	}
}
