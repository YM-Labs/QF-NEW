import { graphql } from 'gatsby';
import GatsbyLink from 'gatsby-link';
// import { gsap } from 'gsap/dist/gsap.min';
import { Draggable } from 'gsap/dist/Draggable';
import { gsap, TweenMax } from 'gsap/dist/gsap.min';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl, useIntl } from 'react-intl';
import TapStorySlide from '../components/ContentfulModules/TapStorySlide';
import { TapStoryPreview } from '../components/Previews/TapStoryPreview';
import { GatsbyImageWrapper } from '../components/ui/GatsbyImageWrapper';
import { PageTapStoryQuery } from '../gatsby-queries';
import { InertiaPlugin } from '../lib/gsap-bonus/InertiaPlugin.min';
import UIShareButtons from '../ui/UIShareButtons';
import { Globals } from '../utils/Globals';
import { clamp } from '../utils/MathUtils';
import { getPagePath } from '../utils/URLHelper';
import * as styles from './PageTapStory.module.scss';
import PageWrapper, { IPageProps } from './PageWrapper';
import { lowerCase } from 'lodash';
import useDarkMode from 'use-dark-mode';

interface Props extends IPageProps {
	data: PageTapStoryQuery;
	bilingual?: boolean;
	intl?: ReturnType<typeof useIntl>;
}

const initialState = { enableArrowOnMobile: false, currentIndex: 0, direction: Globals.CURRENT_LANGUAGE_PREFIX === 'ar/' ? -1 : 1, UITheme: 'dark', isMuted: false, slideHasSound: false, isMobile: false, onThrowComplete: true };
type State = Readonly<typeof initialState>;


const hidePageProgress = () => {
	var indicator = typeof document !== 'undefined' && document.getElementById('gatsby-plugin-page-progress');
	if (indicator) indicator.style.opacity = '0';
};

const WrapperPageTapStory = ({ children }) => {
	const darkMode = useDarkMode(false);
	return children(darkMode);
};

class PageTapStory extends React.Component<Props> {
	private draggable: any = null;
	private draggableWrapper: React.RefObject<HTMLDivElement> = React.createRef();
	private listWrapper: React.RefObject<HTMLDivElement> = React.createRef();
	private totalSlides: number = 0;

	readonly state: State = initialState;
	// @ts-ignore
	private currIndex: number = 0;

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const length = this.props.data.contentfulPageTapStory.slides.length;
		this.totalSlides = length + 1;
		const isMobile = window.innerWidth <= 768;

		const slide = this.props.data.contentfulPageTapStory.slides[0];
		if (slide && 'isThemeLight' in slide && slide.isThemeLight) {
			if (this.getSlideFormat(slide) === 'portrait' && isMobile) {
				this.setState({ UITheme: 'light' });
			} else if ('isFullscreen' in slide && slide.isFullscreen) {
				this.setState({ UITheme: 'light' });
			}
		}

		if (slide && 'videoHasSound' in slide && (slide.videoHasSound) && (slide.videoMux || slide.videoFile)) {
			this.setState({ slideHasSound: true });
		} else {
			this.setState({ slideHasSound: false });
		}

		let direction = 0;
		let oldPosition = 0;

		hidePageProgress();
		gsap.registerPlugin(Draggable, InertiaPlugin);
		window.setTimeout(() => {
			this.draggable = Draggable.create(this.draggableWrapper.current, {
				trigger: this.listWrapper.current,
				type: 'x',
				throwProps: true,
				overshootTolerance: 0,
				throwResistance: 1000,
				edgeResistance: 1,
				dragClickables: true,
				// allowEventDefault: true,
				inertia: true,
				isThrowing: true,
				maxDuration: 0.1,
				minDuration: 0.1,
				// minimumMovement: 6,
				onDrag: (e) => {
					if (e.targetTouches && e.targetTouches[0]) {
						direction = e.targetTouches[0].clientX < oldPosition ? 1 : -1;
						oldPosition = e.targetTouches[0].clientX;
					} else {
						direction = e.x < oldPosition ? 1 : -1;
						oldPosition = e.x;
					}


				},
				onThrowComplete: () => {
					// @ts-ignore
					window.IS_DRAGGING = false;
				},
				onDragStart: () => {
					// @ts-ignore
					window.IS_DRAGGING = true;
				},
				snap: endValue => {
					// console.log("snap");
					const value = direction === 1 ? Math.floor(endValue / window.innerWidth) : Math.ceil(endValue / window.innerWidth);
					this.currIndex = clamp(Math.abs(value), 0, this.totalSlides - 1);
					if (this.state.currentIndex !== this.currIndex) {
						this.slideRefs[this.currIndex] && this.slideRefs[this.currIndex].animateIn()
						this.slideRefs[this.state.currentIndex] && this.slideRefs[this.state.currentIndex].animateOut()
						this.setState({ currentIndex: this.currIndex });
					}
					// return endValue
					return -this.currIndex * window.innerWidth * this.state.direction;
				}
			})[0];

			this.resizeHandler();
		}, 1)

		this.bindEvents();
	}

	bindEvents() {
		window.addEventListener('resize', this.resizeHandler);
		window.addEventListener('keydown', this.keyboardNavigation);
	}

	keyboardNavigation = (e) => {
		if (e.key === 'ArrowLeft' || e.keyCode === 37) {
			if (this.state.direction === 1) {
				this.prevItem();
			} else {
				this.nextItem();
			}

		} else if (e.key === 'ArrowRight' || e.keyCode === 39) {
			if (this.state.direction === 1) {
				this.nextItem();
			} else {
				this.prevItem();
			}
		}
	};

	// @ts-ignore
	public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
		const animationDirection = Globals.CURRENT_LANGUAGE_PREFIX === 'ar/' ? -1 : 1;
		const isMobile = window.innerWidth <= 768;

		if (prevState.direction !== animationDirection) {
			this.setState({ direction: animationDirection }, () => {
				this.resizeHandler();
			});
		}

		if (prevState.currentIndex != this.state.currentIndex) {
			const slide = this.props.data.contentfulPageTapStory.slides[this.state.currentIndex];
			if (slide && 'isThemeLight' in slide && slide.isThemeLight) {
				if (this.getSlideFormat(slide) === 'portrait' && isMobile) {
					this.setState({ UITheme: 'light' });
				} else if ('isFullscreen' in slide && slide.isFullscreen) {
					this.setState({ UITheme: 'light' });
				} else {
					this.setState({ UITheme: 'dark' });
				}
			} else if (this.state.UITheme === 'light') {
				this.setState({ UITheme: 'dark' });
			}

			// On mobile, the right arrow conflict with the mute audio on landscape video.
			// So the right arrow on mobile is disable except for this cases:
			if(slide && ('videoMux' in slide && slide.videoMux || 'videoFile' in slide && slide.videoFile) && (this.getSlideFormat(slide) === 'portrait' || (this.getSlideFormat(slide) === 'landscape' && 'isFullscreen' in slide && slide.isFullscreen)) ) {
				this.setState({enableArrowOnMobile: true})
			} else {
				this.setState({enableArrowOnMobile: false})
			}

			if (slide && 'videoHasSound' in slide && (slide.videoHasSound) && (slide.videoMux || slide.videoFile)) {
				this.setState({ slideHasSound: true });
			} else {
				this.setState({ slideHasSound: false });
			}
		}
	}

	public componentWillUnmount() {
		window.removeEventListener('resize', this.resizeHandler);
		window.removeEventListener('keydown', this.keyboardNavigation);
	}

	private prevItem = (event?) => {
		if (event) {
			event.preventDefault();
		}
		if (this.state.currentIndex > 0) {
			this.goItem(this.state.currentIndex - 1);
		}
		return false;
	};

	private nextItem = (event?) => {
		if (event) {
			event.preventDefault();
		}
		if (this.state.currentIndex < this.totalSlides - 1) {
			this.goItem(this.state.currentIndex + 1);
		}
		return false;
	};

	private delayGoItem = false;
	private slideRefs = []

	private goItem = index => {
		// console.log("GO ITEM");
		if (this.delayGoItem) return;
		this.delayGoItem = true;
		if (this.draggable) {
			this.draggable.update(false, false);
		}

		this.slideRefs[index] && this.slideRefs[index].animateIn()
		this.slideRefs[this.state.currentIndex] && this.slideRefs[this.state.currentIndex].animateOut()

		TweenMax.set(this.draggableWrapper.current, { x: -window.innerWidth * index * this.state.direction });
		this.setState({ currentIndex: index }, () => {
			window.setTimeout(() => {
				this.delayGoItem = false;
			}, 100);
		});
	};

	private resizeHandler = () => {
		if (typeof window !== `undefined`) {
			if (window.innerWidth <= 992 && !this.state.isMobile) {
				this.setState({ isMobile: true });
			} else if (window.innerWidth > 992 && this.state.isMobile) {
				this.setState({ isMobile: false });
			}
		}

		if (this.draggable) {
			this.draggableWrapper.current.style.width = (this.totalSlides - 1) * window.innerWidth + 'px';

			TweenMax.set(this.draggableWrapper.current, { x: -window.innerWidth * this.state.currentIndex * this.state.direction, immediateRender: true });
			this.draggable.applyBounds({ minX: -(this.totalSlides - 1) * window.innerWidth * this.state.direction, maxX: 0 });
			this.draggable.update(true);
		}
	};

	getSlideFormat = (slide) => {
		if(!slide) return;

		switch (slide.__typename) {
			case 'ContentfulTapStorySlideLandscapeVideo' :
			case 'ContentfulTapStorySlideLandscapeImage' :
				return 'landscape';
			case 'ContentfulTapStorySlidePortraitVideo' :
			case 'ContentfulTapStorySlidePortraitImage' :
				return 'portrait';
			case 'ContentfulTapStorySlideText':
				return 'textOnly';
			default:
				return null;
		}
	};

	onWrapperClick = () => {
		// @ts-ignore
		if(window.IS_DRAGGING) return

		// @ts-ignore
		if(!window.IGNORE_CLICK) {
			this.nextItem();
		}
	};


	private getTheme = (slide, mode) => {
		if (!slide && mode.value) {
			return 'light';
		} else if (!slide) {
			return '';
		}

		if (this.state.isMobile && ((slide.isFullscreen && !slide.isThemeLight) || (this.getSlideFormat(slide) === 'portrait' && !slide.isThemeLight && lowerCase(slide.textPosition) === 'right'))) {
			return 'dark';
		} else if (this.state.UITheme === 'light') {
			return 'light';
		} else {
			return '';
		}
	};

	getHTMLClass = (slide, mode) => {
		const theme = this.getTheme(slide, mode);
		if (theme === 'light') {
			return 'tap-story-lightUI';
		} else if (theme === 'dark') {
			return 'tap-story-darkUI';
		} else {
			return '';
		}
	};

	setSlideRef = (ref) => {
		this.slideRefs = [...this.slideRefs, ref]
	}

	render() {
		const pageData = this.props.data.contentfulPageTapStory;
		const hasRelated = pageData.relatedTapStories && pageData.relatedTapStories.length > 0;
		let defaultClass = styles.summaryAndRelated;

		if (!hasRelated) {
			defaultClass = styles.onlySummary;
		}
		return (
			//@ts-ignore:
			<PageWrapper
				location={this.props.location}
				pageData={pageData}
				type={'tap-story'}
				title={pageData.title}
				metaTitle={pageData.metaTitle}
				pageContext={this.props.pageContext}
			>
				<WrapperPageTapStory>
					{
						(darkMode) => {
							return <div
								className={`${styles.pageTapStory} ${this.getTheme(pageData.slides[this.state.currentIndex], darkMode) === 'dark' ? '' : (this.getTheme(pageData.slides[this.state.currentIndex], darkMode) === 'light' || darkMode.value) ? styles.lightMode : ''}`}>
								{
									<Helmet>
										<html
											className={`tap-story ${this.state.currentIndex > 0 ? 'hide-darkMode-cta hide-language-cta' : ''} ${this.getHTMLClass(pageData.slides[this.state.currentIndex], darkMode)}`} />
										<meta
											className='swiftype'
											name='preview_image_aspect_ratio'
											data-type='enum'
											content={pageData.teaserImage && pageData.teaserImage.file && pageData.teaserImage.file.details.image.width / pageData.teaserImage.file.details.image.height + ''}
										/>
										<meta className='swiftype' name='preview_image' data-type='enum' content={pageData.teaserImage && pageData.teaserImage.file && pageData.teaserImage.file.url} />
										{pageData.tags &&
										pageData.tags.map((entity, index) => <meta key={index} className='swiftype' name='filter_tapStory_tags' data-type='enum' content={entity.contentful_id} />)}
										<meta className='swiftype' name='filter_date' data-type='date' content={pageData.date && pageData.date} />
										<meta className='swiftype' name='type' data-type='enum' content='tap-story' />
										{darkMode.value === true ? (
												<meta name='twitter:widgets:theme' content='dark' />
											) :
											<meta name='twitter:widgets:theme' content='light' />
										}
									</Helmet>
								}

								<div ref={this.listWrapper} className={styles.wrapper}>
									<a
										className={`${styles.arrow} ${styles.leftArrow} ${this.state.currentIndex === 0 ? styles.arrowIsDisabled : ''} ${(this.state.isMobile && this.state.currentIndex >= (this.totalSlides - 1)) ? styles.visibleOnMobile : ''}`}
										onTouchEnd={() => {
											if(Globals.IS_TOUCH_DEVICE()) {
												this.prevItem()
											}
										}}
										onMouseUp={() => {
											if(!Globals.IS_TOUCH_DEVICE()) {
												this.prevItem()
											}
										}}
										href='#prev-item'
										title={this.props.intl.formatMessage({ id: 'scrolllistmodnavprevtitle' })}
										aria-label={this.props.intl.formatMessage({ id: 'scrolllistmodnavprevarialabel' })}
									>
										<span />
									</a>
									<a className={`${this.state.enableArrowOnMobile ? styles.enableArrowOnMobile : ''} ${styles.arrow} ${styles.rightArrow} ${this.state.currentIndex >= (this.totalSlides - 1) ? styles.arrowIsDisabled : ''} ${this.state.isMobile && this.state.currentIndex === 0 ? styles.visibleOnMobile : ''}`}
									   onTouchEnd={() => {
										   if(Globals.IS_TOUCH_DEVICE()) {
											   this.nextItem()
										   }
									   }}
									   onMouseUp={() => {
										   if(!Globals.IS_TOUCH_DEVICE()) {
											   this.nextItem()
										   }
									   }}
									   href='#next-item'
									   title={this.props.intl.formatMessage({ id: 'scrolllistmodnavnexttitle' })}
									   aria-label={this.props.intl.formatMessage({ id: 'scrolllistmodnavnextarialabel' })}
									>
										<span />
									</a>
									<GatsbyLink to={getPagePath('', 'tapStory')} className={`${styles.closeButton}`}>
										{this.props.intl.formatMessage({ id: 'tap_story_close' })}
									</GatsbyLink>
									{
										this.totalSlides > 1 && (
											<div className={`${styles.tabControls}`}>
												{
													//@ts-ignore
													pageData.slides.map((slide, index) => {
														return (
															<a
																key={'tap_tory_tab_' + (index + 1)}
																title={this.props.intl.formatMessage({ id: 'tap_story_tab' })}
																aria-label={this.props.intl.formatMessage({ id: 'tap_story_tab_arial_label' })}
																className={`${styles.tab} ${this.state.currentIndex === (index) ? styles.tabIsActive : ''}`}
																onTouchEnd={() => {
																	Globals.IS_TOUCH_DEVICE() && this.goItem(index);
																}}
																onMouseUp={() => {
																	!Globals.IS_TOUCH_DEVICE() && this.goItem(index);
																}}
																href='#go-to-slide'
															><span /></a>
														);
													})
												}
												{
													<a
														title={this.props.intl.formatMessage({ id: 'tap_story_tab' })}
														aria-label={this.props.intl.formatMessage({ id: 'tap_story_tab_arial_label' })}
														className={`${styles.tab} ${this.state.currentIndex === (this.totalSlides - 1) ? styles.tabIsActive : ''}`}
														onTouchEnd={() => {
															this.goItem(this.totalSlides - 1);
														}}
														onMouseUp={() => {
															this.goItem(this.totalSlides - 1);
														}}
														href='#go-to-slide'
													><span /></a>
												}
											</div>
										)
									}

									<div ref={this.draggableWrapper}
										 className={styles.slider}
									>
										<div className={styles.clickableArea}
											 onTouchEnd={() => {
												 if(Globals.IS_TOUCH_DEVICE()) {
													 this.onWrapperClick()
												 }
											 }}
											 onMouseUp={() => {
												 if(!Globals.IS_TOUCH_DEVICE()) {
													 this.onWrapperClick()
												 }
											 }}
										/>
										{
											pageData.slides.map((slide: any, index) => {
												return (
													<TapStorySlide
														key={'tap_story_slide_' + index}
														className={styles.slide}
														mainSlide={index === 0}
														active={index === this.state.currentIndex}
														format={this.getSlideFormat(slide)}
														index={index}
														ref={this.setSlideRef}
														{...slide}
													/>
												);
											})
										}

										<div className={`${styles.slide} ${styles.lastSlide} ${defaultClass}`}>
											{
												<div className={styles.tapStorySummary}>
													<h3 className={styles.summaryTitle}>{pageData.title}</h3>
													<GatsbyImageWrapper
														alt={pageData.teaserImage.title}
														outerWrapperClassName={styles.desktopImage}
														image={pageData.teaserImage.summaryDesktop}
													/>
													<GatsbyImageWrapper
														alt={pageData.teaserImage.title}
														outerWrapperClassName={styles.mobileImage}
														className={styles.summaryMobile}
														image={pageData.teaserImage.summaryMobile}
													/>
													<UIShareButtons url={this.props.pageContext.currSlug} title={pageData.title} />
												</div>
											}
											{
												hasRelated && (
													<div className={styles.tapStoryRelatedWrapper}>
														<p className={styles.relatedHeadline}>See more tap stories</p>
														<div className={styles.previewWrapper}>
															{
																pageData.relatedTapStories.map((related, index) => (
																	<TapStoryPreview key={`tap_story_related_${index}`} data={related} className={`${styles.tapStoryRelated}`}
																					 mode={'related'} />
																))
															}
														</div>
													</div>
												)
											}
										</div>
									</div>
								</div>
							</div>;
						}
					}
				</WrapperPageTapStory>
			</PageWrapper>

		);
	}
}

export default injectIntl(PageTapStory);

export const pageQuery = graphql`
	query PageTapStoryQuery($id: String, $languageCode: String) {
		contentfulPageTapStory(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			slug
			title
			date
			tags {
				title
				contentful_id
				slug
			}
			teaserImage {
				title
				file {
					url
					details {
						image {
							width
							height
						}
					}
				}
				desktop: gatsbyImageData(placeholder: NONE, width: 360, height: 380, quality: 85)
				mobile: gatsbyImageData(placeholder: NONE, width: 1000, height: 1500, quality: 85)
				summaryDesktop: gatsbyImageData(placeholder: NONE, width: 360, height: 380, quality: 85)
				summaryMobile: gatsbyImageData(placeholder: NONE, width: 270, height: 155, quality: 85)
			}
			slides {
				__typename
				... on ContentfulTapStorySlideText {
					text {
						text
						childMarkdownRemark {
							html
						}
					}
					textPosition
					verticalTextPosition
				}
				... on ContentfulTapStorySlidePortraitImage {
					title
					text {
						text
						childMarkdownRemark {
							html
						}
					}
					textPosition
					image {
						title
						mobilePortrait: gatsbyImageData(placeholder: NONE, width: 750, height: 564, quality: 85)
						portrait: gatsbyImageData(placeholder: NONE, width: 1000, height: 1500, quality: 85)
					}
					fullscreenOnMobile
					isThemeLight
					makeTheMediaFullHeight
				}
				... on ContentfulTapStorySlidePortraitVideo {
					title
					text {
						text
						childMarkdownRemark {
							html
						}
					}
					textPosition
					videoMux {
						playbackId
					}
					videoFile {
						title
						file {
							url
							contentType
						}
					}
					videoAutoplay
					videoLoop
					videoHasSound
					videoPosterImage {
						title
						file {
							url
							contentType
						}
					}
					isThemeLight
					makeTheMediaFullHeight
				}
				... on ContentfulTapStorySlideLandscapeImage {
					title
					text {
						text
						childMarkdownRemark {
							html
						}
					}
					textPosition
					image {
						title
						landscape: gatsbyImageData(placeholder: NONE, width: 660, quality: 85)
						landscapeMobile: gatsbyImageData(placeholder: NONE, width: 341, height: 251, quality: 85)
						fullscreen: gatsbyImageData(placeholder: NONE, width: 1680, height: 900, quality: 85, layout: FULL_WIDTH)
					}
					verticalTextPosition
					isFullscreen
					isThemeLight
				}
				... on ContentfulTapStorySlideLandscapeVideo {
					title
					text {
						text
						childMarkdownRemark {
							html
						}
					}
					textPosition
					videoMux {
						playbackId
					}
					videoFile {
						title
						file {
							url
							contentType
						}
					}
					videoAutoplay
					videoLoop
					videoHasSound
					videoPosterImage {
						title
						file {
							url
							contentType
						}
					}
					verticalTextPosition
					isFullscreen
					isThemeLight
				}
			}
			relatedTapStories {
				...ContentfulPageTapStoryPreviewFragment
			}
			metaTitle
			metaDescription {
				metaDescription
			}
		}
	}
`;