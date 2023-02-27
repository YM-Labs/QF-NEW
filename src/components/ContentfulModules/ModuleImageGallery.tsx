import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleImageGallery.module.scss';
import { ContentfulModuleImageGalleryFragment } from '../../gatsby-queries';
import { TweenMax, gsap } from 'gsap/dist/gsap.min';
import { Draggable } from 'gsap/dist/Draggable';
import { InertiaPlugin } from '../../lib/gsap-bonus/InertiaPlugin.min';
import { clamp } from '../../utils/MathUtils';
import { EASE_CUSTOM_IN_OUT } from '../../utils/Constants';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import ViewableMonitor from '../ui/ViewableMonitor';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';

const initialState = { currentIndex: 0 };
type State = Readonly<typeof initialState>;

class ModuleImageGallery extends Component<{ data: ContentfulModuleImageGalleryFragment; animationDirection: 1 | -1 } & WrappedComponentProps, State> {
	private images: HTMLDivElement[] = [];
	private imageWidths: number[] = [];
	private imageDragWidths: number[] = [];
	private imageSnaps: number[] = [];
	private draggable: any = null;
	private draggableWrapper: HTMLDivElement;

	readonly state: State = initialState;
	private prevWindowWidth = 0;
	private imageCaptions: HTMLDivElement[] = [];
	private imageCaptionHeights: number[] = [];
	private imagesWrapper: HTMLDivElement;

	componentDidMount(): void {
		gsap.registerPlugin(Draggable, InertiaPlugin);
		if (this.props.data.images.length > 1) {
			this.draggable = Draggable.create(this.draggableWrapper, {
				type: 'x',
				lockAxis: true,
				throwProps: true,
				overshootTolerance: 0.5,
				throwResistance: 0.25,
				edgeResistance: 0.85,
                inertia: true,
				//@ts-ignore:
				bounds: { minX: 0, maxX: 0 },
				snap: endValue => {
					endValue *= this.props.animationDirection;
					const closest = this.imageSnaps.reduce((prev, curr) => {
						return Math.abs(curr - endValue) < Math.abs(prev - endValue) ? curr : prev;
					});
					const currIndex = this.imageSnaps.findIndex(value => value === closest);
					if (this.state.currentIndex !== currIndex) {
						this.setState({ currentIndex: currIndex });
						this.setCurrentCaptionHeight();
					}
					return closest * this.props.animationDirection;
				},
				onDrag: this.updateDrag,
				onThrowUpdate: this.updateDrag
			})[0];
			setTimeout(this.resizeHandler, 0);
			window.addEventListener('resize', this.resizeHandler);
		}
	}

	private findIndex(endValue: number) {
		endValue *= this.props.animationDirection;
		const closest = this.imageSnaps.reduce((prev, curr) => {
			return Math.abs(curr - endValue) < Math.abs(prev - endValue) ? curr : prev;
		});
		const currIndex = this.imageSnaps.findIndex(value => value === closest);
		if (this.state.currentIndex !== currIndex) {
			this.setState({ currentIndex: currIndex });
			this.setCurrentCaptionHeight();
		}
	}

	private updateDrag = () => {
		for (let i = 0; i < this.imageSnaps.length - 1; i++) {
			const snapPoint = this.imageSnaps[i];
			let distance = clamp(((this.draggable.x * this.props.animationDirection - snapPoint) / this.imageDragWidths[i]) * -1, -1, 1);
			distance = distance < 0 ? distance * -1 : distance;
			TweenMax.set(this.images[i], { opacity: 0.15 + 0.85 * (1 - distance) });
			this.findIndex(this.draggable.x);
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
		this.imageWidths = this.images.map(image => -Math.round(image.clientWidth));
		this.imageSnaps = [0];

		this.imageDragWidths = [this.imageWidths[0], ...this.imageWidths];

		totalWidth += this.imageWidths.reduce((sum, value) => {
			this.imageSnaps.push(sum);
			return sum + value;
		});
		totalWidth = Math.round(totalWidth);

		this.imageSnaps.push(totalWidth);

		if (this.draggable) {
			TweenMax.set(this.draggableWrapper, { x: this.imageSnaps[this.state.currentIndex] * this.props.animationDirection });
			this.draggable.applyBounds({ minX: totalWidth * this.props.animationDirection, maxX: 0 });
			this.draggable.update(true);
			this.updateDrag();
		}

		this.imageCaptions.forEach((caption, index) => {
			this.imageCaptionHeights[index] = caption.clientHeight;
		});
		this.setCurrentCaptionHeight();
	};

	private setCurrentCaptionHeight() {
		if (this.imageCaptionHeights[this.state.currentIndex]) {
			this.imagesWrapper.style.paddingBottom = this.imageCaptionHeights[this.state.currentIndex] + 'px';
		}
	}

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
		if (this.state.currentIndex < this.images.length - 1) {
			this.tweenToIndex(this.state.currentIndex + 1);
		}
		return false;
	};

	private tweenToIndex(index: number) {
		TweenMax.to(this.draggableWrapper, 0.65, { x: this.imageSnaps[index] * this.props.animationDirection, ease: EASE_CUSTOM_IN_OUT, onUpdate: this.tweenUpdate });
		this.setState({ currentIndex: index });
	}

	render() {
		const singleMode = this.props.data.images && this.props.data.images.length < 2;
		return (
			<div className={`module-margin ${styles.wrapper}${singleMode ? ' w-100 ' + styles.singleMode : ' '}`}>
				{!singleMode && (
					<ViewableMonitor fadeOnly={true}>
						<div className={styles.controls}>
							<span className={styles.pagination}>
								<FormattedMessage
									id={'image.pagination'}
									values={{
										index: this.state.currentIndex + 1,
										total: this.props.data.images && this.props.data.images.length
									}}
								/>
							</span>
							<div className={styles.arrows}>
								<a
									title={this.props.intl.formatMessage({ id: 'imggallerymodnavprevtitle' })}
									aria-label={this.props.intl.formatMessage({ id: 'imggallerymodnavprevarialabel' })}
									className={styles.prevButton + ' ' + (this.state.currentIndex > 0 ? styles.active : '')}
									onClick={this.prevImage}
									href="#prev-image"
								/>
								<a
									title={this.props.intl.formatMessage({ id: 'imggallerymodnavnexttitle' })}
									aria-label={this.props.intl.formatMessage({ id: 'imggallerymodnavnextarialabel' })}
									className={(this.state.currentIndex !== this.images.length - 1 ? styles.active : '')}
									onClick={this.nextImage}
									href="#next-image"
								/>
							</div>
						</div>
					</ViewableMonitor>
				)}
				{!singleMode && (
					<ViewableMonitor>
						<div className={styles.imagesWrapper} ref={ref => (this.imagesWrapper = ref)}>
							<div ref={ref => (this.draggableWrapper = ref)} className={styles.imagesWrapperInner}>
								{this.props.data.images &&
									this.props.data.images.map((image, index) => {
										if (image.image) {
                                            // @ts-ignore
											image.image.aspectRatio = image.image.file.details.image.height / image.image.file.details.image.width;
											// @ts-ignore
											//let imageAlt = image.caption ? image.caption : image.title
											//if(imageAlt === null || imageAlt === "") {
											//imageAlt = "gallery_image_item"
											//}
											(image.image as any).tracedSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${image.image.file.details.image.width}' height='${image.image.file.details.image.height}' viewBox='0 0 ${image.image.file.details.image.width} ${image.image.file.details.image.height}'%3E%3C/svg%3E`;
											return (
												<div ref={ref => (this.images[index] = ref)} key={image.image.id} className={styles.imageWrapper}>
													{
                                                        // @ts-ignore
														<GatsbyImageWrapper className={styles.gatsbyImageWrapperInner} as="span" outerWrapperClassName={styles.image} image={image.image} alt={image.image?.title} />
													}
													{image.caption && (
														<div
															ref={ref => (this.imageCaptions[index] = ref)}
															className={styles.caption}
															dangerouslySetInnerHTML={{ __html: image.caption.childMarkdownRemark.html }}
														/>
													)}
												</div>
											);
										}
									})}
							</div>
						</div>
					</ViewableMonitor>
				)}
				{singleMode && (
					<ViewableMonitor>
						<div>
							{
								// @ts-ignore
								<GatsbyImageWrapper alt={this.props.data.images && this.props.data.images[0].image?.title} image={this.props.data.images && this.props.data.images[0] && this.props.data.images[0].image} />
							}
							{this.props.data.images && this.props.data.images[0].caption && (
								<div
									className={`${styles.caption} container `}
									dangerouslySetInnerHTML={{ __html: this.props.data.images && this.props.data.images[0].caption.childMarkdownRemark.html }}
								/>
							)}
						</div>
					</ViewableMonitor>
				)}
			</div>
		);
	}
}

export default injectIntl(ModuleImageGallery);

export const query = graphql`
	fragment ContentfulModuleImageGalleryFragment on ContentfulModuleImageGallery {
		id
		images {
			caption {
				childMarkdownRemark {
					html
				}
			}
			image {
				id
				title
				file {
					details {
						image {
							width
							height
						}
					}
				}
				gatsbyImageData(
                    placeholder: NONE
                    height: 600
                    quality: 85
                  )
			}
		}
	}
`;
