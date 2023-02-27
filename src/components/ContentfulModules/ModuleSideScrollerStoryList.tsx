import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleSideScrollerStoryList.module.scss';
import { ContentfulModuleSideScrollerStoryListFragment, ContentfulModuleSideScrollerStoryListFragment_storyItems } from '../../gatsby-queries';
import { TweenMax, gsap } from 'gsap/dist/gsap.min';
import { Draggable } from 'gsap/dist/Draggable';
import { EASE_CUSTOM_IN_OUT } from '../../utils/Constants';
import { clamp } from '../../utils/MathUtils';
import ViewableMonitor from '../ui/ViewableMonitor';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';
import { WrappedComponentProps, injectIntl } from 'react-intl';

const initialState = { currentIndex: 0 };
type State = Readonly<typeof initialState>;

class ModuleSideScrollerStoryList extends Component<{ data: ContentfulModuleSideScrollerStoryListFragment; animationDirection: 1 | -1 } & WrappedComponentProps> {
	private items: HTMLDivElement[] = [];
	private titles: HTMLDivElement[] = [];
	private titleSnaps: number[] = [];
	private itemWidths: number[] = [];
	private itemSnaps: number[] = [];
	// private imageDragWidths: number[] = [];
	private draggable: any = null;
	private draggableWrapper: HTMLDivElement;

	readonly state: State = initialState;

	private prevWindowWidth = 0;
	private dragTrigger: HTMLDivElement;

	componentDidMount(): void {
		gsap.registerPlugin(Draggable)
		if (this.props.data.storyItems.length > 1) {
			this.draggable = Draggable.create(this.draggableWrapper, {
				trigger: this.dragTrigger,
				type: 'x',
				lockAxis: true,
				throwProps: true,
				overshootTolerance: 0.5,
				throwResistance: 0.85,
				edgeResistance: 0.85,
				// @ts-ignore
				bounds: { minX: 0, maxX: 0 },
				snap: endValue => {
					endValue *= this.props.animationDirection;
					const closest = this.itemSnaps.reduce((prev, curr) => {
						return Math.abs(curr - endValue) < Math.abs(prev - endValue) ? curr : prev;
					});
					const currIndex = this.itemSnaps.findIndex(value => value === closest);
					if (this.state.currentIndex !== currIndex) {
						this.setState({ currentIndex: currIndex });
					}
					return endValue * this.props.animationDirection;
				},
				onDrag: this.updateDrag,
				onThrowUpdate: this.updateDrag
			})[0];
			setTimeout(this.resizeHandler, 0);
			window.addEventListener('resize', this.resizeHandler);
		}
	}

	private updateDrag = () => {
		for (let i = 0; i < this.titles.length; i++) {
			const x = this.draggable.x * this.props.animationDirection;

			let toX = Math.abs(this.itemSnaps[i]);
			if (x < this.itemSnaps[i] && x > this.itemSnaps[i + 1]) {
				toX = -x + clamp(x - this.titleSnaps[i + 1], -Infinity, 0);
			} else if (x < this.itemSnaps[i]) {
				toX = -x + (x - this.itemSnaps[i + 1]) + clamp(x - this.titleSnaps[i + 1], -Infinity, 0);
			}

			TweenMax.set(this.titles[i], { x: toX * this.props.animationDirection, force3D: true });
		}
	};

	componentWillUnmount(): void {
		if (this.draggable) {
			window.removeEventListener('resize', this.resizeHandler);
			this.draggable.kill();
			this.draggable = null;
		}
	}

	private resizeHandler = event => {
		let newWidth = window.innerWidth;
		if (this.prevWindowWidth === newWidth && event) {
			return;
		}
		this.prevWindowWidth = newWidth;
		let totalWidth = this.draggableWrapper.clientWidth;
		this.itemWidths = this.items.map(image => -Math.round(image.clientWidth));
		this.itemSnaps = [0];
		this.titleSnaps = [0];

		let i = 0;
		totalWidth += this.itemWidths.reduce((sum, value) => {
			this.itemSnaps.push(sum);
			this.titleSnaps.push(sum + this.titles[i].clientWidth);
			i++;
			return sum + value;
		});
		totalWidth = Math.round(totalWidth);
		this.titleSnaps.push(totalWidth);

		this.itemSnaps.push(totalWidth);

		if (this.draggable) {
			TweenMax.set(this.draggableWrapper, { x: this.itemSnaps[this.state.currentIndex] * this.props.animationDirection });
			this.draggable.applyBounds({ minX: totalWidth * this.props.animationDirection, maxX: 0 });
			this.draggable.update(true);
			this.updateDrag();
		}
	};

	private tweenUpdate = () => {
		this.draggable.update(false, false);
		this.updateDrag();
	};

	private prevImage = event => {
		if (event) {
			event.preventDefault();
		}
		if (this.state.currentIndex > 0) {
			this.tweenToIndex(this.state.currentIndex - 1);
		}
		return false;
	};
	private nextImage = event => {
		if (event) {
			event.preventDefault();
		}
		if (this.state.currentIndex < this.items.length) {
			this.tweenToIndex(this.state.currentIndex + 1);
		}
		return false;
	};

	private tweenToIndex(index: number) {
		TweenMax.to(this.draggableWrapper, 0.65, { x: this.itemSnaps[index] * this.props.animationDirection, ease: EASE_CUSTOM_IN_OUT, onUpdate: this.tweenUpdate });
		this.setState({ currentIndex: index });
	}

	render() {
		const groups: ContentfulModuleSideScrollerStoryListFragment_storyItems[][] = [];
		this.props.data.storyItems.forEach(storyItem => {
			if (storyItem.title || groups.length === 0) {
				groups.push([storyItem]);
			} else {
				groups[groups.length - 1].push(storyItem);
			}
		});
		return (
			<div className={`module-margin`}>
				<ViewableMonitor fadeOnly={true}>
					<div className={styles.arrows}>
						<a title={this.props.intl.formatMessage({ id: 'sidescrollerstorylistmodnavprevtitle' })} aria-label={this.props.intl.formatMessage({ id: 'sidescrollerstorylistmodnavprevarialabel' })} className={styles.prevButton + ' ' + (this.state.currentIndex > 0 ? styles.active : '')} onClick={this.prevImage} href="#prev-image" />
						<a title={this.props.intl.formatMessage({ id: 'sidescrollerstorylistmodnavnexttitle' })} aria-label={this.props.intl.formatMessage({ id: 'sidescrollerstorylistmodnavnextarialabel' })} className={(this.state.currentIndex <= groups.length - 1 ? styles.active : '')} onClick={this.nextImage} href="#next-image" />
					</div>
				</ViewableMonitor>
				<ViewableMonitor>
					<div className={styles.dragWrapper} ref={ref => (this.dragTrigger = ref)}>
						<div className={styles.listWrapper} ref={ref => (this.draggableWrapper = ref)}>
							{groups.map((storyItems, index) => {
								return (
									<div ref={ref => (this.items[index] = ref)} key={index} className={styles.storyItem}>
										{storyItems[0].title && (
											<div ref={ref => (this.titles[index] = ref)} className={'text-style-detail-2 ' + styles.storyItemTitle}>
												{storyItems[0].title}
											</div>
										)}
										<div className={styles.storyItemListWrapper}>
											{storyItems.map((storyItem, index) => {
												return (
													<div key={index} className={styles.descriptionAndImages}>
														<div className={styles.description} dangerouslySetInnerHTML={{ __html: storyItem.description.childMarkdownRemark.html }} />
														{storyItem.images &&
															storyItem.images.map((image, index) => {
																(image as any).tracedSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${
																	image.file.details.image.width
																}' height='${image.file.details.image.height}' viewBox='0 0 ${image.file.details.image.width} ${
																	image.file.details.image.height
																}'%3E%3C/svg%3E`;
																return (
																	//@ts-ignore:
																	<GatsbyImageWrapper key={index} className={styles.gatsbyImageWrapperInner} alt={image.title} Tag="span" outerWrapperClassName={styles.image} image={image} />
																);
															})}
													</div>
												);
											})}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</ViewableMonitor>
			</div>
		);
	}
}

export default injectIntl(ModuleSideScrollerStoryList);

export const query = graphql`
	fragment ContentfulModuleSideScrollerStoryListFragment on ContentfulModuleSideScrollerStoryList {
		id
		storyItems {
			title
			description {
				childMarkdownRemark {
					html
				}
			}
			images {
				title
				file {
					details {
						image {
							width
							height
						}
					}
				}
				gatsbyImageData(placeholder: NONE, height: 310, quality: 85)
			}
		}
	}
`;
