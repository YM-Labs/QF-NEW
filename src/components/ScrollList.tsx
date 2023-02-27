import * as React from 'react';

import * as styles from './ScrollList.module.scss';
import { EASE_CUSTOM_IN_OUT } from '../utils/Constants';
import { clamp } from '../utils/MathUtils';
import ViewableMonitor from './ui/ViewableMonitor';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { TweenMax, gsap } from 'gsap/dist/gsap.min';
import { Draggable } from 'gsap/dist/Draggable';
import { InertiaPlugin } from '../lib/gsap-bonus/InertiaPlugin.min';

const initialState = { currentIndex: 0, rowItems: 3 };
type State = Readonly<typeof initialState>;

class ScrollList extends React.Component<{ listClassName: string; className: string; animationDirection: 1 | -1; showPaginator?: boolean, tabbed?:boolean } & WrappedComponentProps, State> {
	private draggable: any = null;
	private draggableWrapper: HTMLDivElement;
	private listWrapper: HTMLDivElement;

	private currItemWidth = 0;

	readonly state: State = initialState;
	private currIndex: number = 0;

    componentDidUpdate(): void {
        if(this.props.tabbed) {
            setTimeout(this.resizeHandler, 100);
        }
	}

	componentDidMount(): void {
		gsap.registerPlugin(Draggable, InertiaPlugin);
		if (React.Children.count(this.props.children) > 1) {
			this.draggable = Draggable.create(this.draggableWrapper, {
				trigger: this.listWrapper,
				type: 'x',
				throwProps: true,
				overshootTolerance: 0.5,
				throwResistance: 0.65,
				edgeResistance: 0.85,
				bounds: { minX: 0, maxX: 0 },
				dragClickables: true,
				inertia: true,
				isThrowing: true,
				snap: endValue => {
					const clamped = this.props.animationDirection === 1 ? clamp(endValue, this.draggable.vars.bounds.minX, 0) : clamp(endValue, 0, this.draggable.vars.bounds.minX);

					this.currIndex = clamp(Math.abs(Math.round(clamped / this.currItemWidth)), 0, React.Children.count(this.props.children) - 1);
					if (this.state.currentIndex !== this.currIndex) {
						this.setState({ currentIndex: this.currIndex });
					}
					return this.currIndex * -this.currItemWidth * this.props.animationDirection;
				}
			})[0];
			setTimeout(this.resizeHandler, 0);
			window.addEventListener('resize', this.resizeHandler);
		}
	}

	componentWillUnmount(): void {
		if (this.draggable) {
			window.removeEventListener('resize', this.resizeHandler);
			this.draggable.kill();
			this.draggable = null;
		}
	}

	private resizeHandler = () => {
		this.currItemWidth = this.draggableWrapper && this.draggableWrapper.children[0].clientWidth;
		if(!this.currItemWidth) {
			this.currItemWidth = 452
		}
		let totalWidth = this.draggableWrapper && this.draggableWrapper.clientWidth - this.currItemWidth * React.Children.count(this.props.children);

		if (window.innerWidth < 768) {
			if (this.state.rowItems !== 1) {
				this.setState({ rowItems: 1 });
			}
			totalWidth -= 45;
		} else {
			if (this.state.rowItems !== 3) {
				this.setState({ rowItems: 3 });
			}
			if (window.innerWidth >= 992) {
				totalWidth += 50;
			} else {
				totalWidth += 30;
			}
		}
		totalWidth = Math.round(totalWidth);

		if (this.draggable) {
			TweenMax.set(this.draggableWrapper, { x: -this.currItemWidth * this.state.currentIndex * this.props.animationDirection, immediateRender: true });

			this.draggable.applyBounds({ minX: totalWidth * this.props.animationDirection, maxX: 0 });

			this.draggable.update(true);
		}
	};

	private tweenUpdate = () => {
		this.draggable.update(false, false);
	};

	private prevItem = event => {
		if (event) {
			event.preventDefault();
		}
		if (this.state.currentIndex > 0) {
			this.tweenToIndex(this.state.currentIndex - 1);
		}
		return false;
	};

	private nextItem = event => {
		if (event) {
			event.preventDefault();
		}
        if (this.state.currentIndex < React.Children.count(this.props.children) - (this.state.rowItems - 1)) {
            this.tweenToIndex(this.state.currentIndex + 1);
        }
		return false;
	};

	private tweenToIndex(index: number) {
		let toX = -this.currItemWidth * index * this.props.animationDirection;

		TweenMax.to(this.draggableWrapper, 0.65, {
			x: this.props.animationDirection === 1 ? Math.max(toX, this.draggable.vars.bounds.minX) : Math.min(toX, this.draggable.vars.bounds.minX),
			ease: EASE_CUSTOM_IN_OUT,
			onUpdate: this.tweenUpdate
		});
		this.setState({ currentIndex: index });
	}

	public render() {
		const children = React.Children.count(this.props.children);
		const showPagination = this.props.showPaginator && children > 2;
		return (
			<div className={this.props.className + (children < 3 ? ' ' + styles.controlsInactiveDesktop : '')}>
				{children > 1 && (
					<ViewableMonitor>
						<div className={styles.controls + (showPagination ? ' ' + styles.hasPagination : '')}>
							{showPagination && (
								<span className={styles.pagination}>
									<FormattedMessage
										id={'scrolllist.pagination'}
										values={{
											index: Math.min(this.state.currentIndex + 1, children),
											total: children
										}}
									/>
								</span>
							)}
							<div className={styles.arrows}>
								<a
									title={this.props.intl.formatMessage({ id: 'scrolllistmodnavprevtitle' })}
									aria-label={this.props.intl.formatMessage({ id: 'scrolllistmodnavprevarialabel' })}
									className={styles.prevButton + ' ' + (this.state.currentIndex > 0 ? styles.active : '')}
									onClick={this.prevItem}
									href="#prev-item"
								/>
								<a
									title={this.props.intl.formatMessage({ id: 'scrolllistmodnavnexttitle' })}
									aria-label={this.props.intl.formatMessage({ id: 'scrolllistmodnavnextarialabel' })}
									className={(this.state.currentIndex !== children - (this.state.rowItems - 1) ? styles.active : '')}
									onClick={this.nextItem}
									href="#next-item"
								/>
							</div>
						</div>
					</ViewableMonitor>
				)}
				<div ref={ref => (this.listWrapper = ref)} className={styles.listWrapper + ' ' + this.props.listClassName}>
					<div ref={ref => (this.draggableWrapper = ref)} className={styles.draggableWrapper}>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}

export default injectIntl(ScrollList);
