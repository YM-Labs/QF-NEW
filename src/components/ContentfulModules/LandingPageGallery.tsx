import * as React from 'react';
import { Component } from 'react';
import * as styles from './LandingPageGallery.module.scss';
import { LandingPageGalleryFragment_landingGallery } from '../../gatsby-queries';
import { UICircleProgress } from '../../ui/UICircleProgress';
import { gsap, Sine, Linear, TweenMax, Power2 } from 'gsap/dist/gsap';
import { CSSRulePlugin } from 'gsap/dist/CSSRulePlugin';
import { EASE_CUSTOM_IN_OUT } from '../../utils/Constants';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';
import { navigate } from '@reach/router';

const SLIDE_DURATION = 10;
const initialState = { currentSlideIndex: -1, currentLocation: null, playing: true, muted: true };
type State = Readonly<typeof initialState>;

let visited = typeof window !== 'undefined' && window.localStorage.getItem('currentPromo')

class LandingPageGallery extends Component<
	{ items: LandingPageGalleryFragment_landingGallery[]; promo: any; promotionalVideo: any; animationDirection: 1 | -1 },
	State
> {
	readonly state: State = initialState;

	private slides: HTMLElement[] = [];
	private slideItems: Array<NodeListOf<HTMLElement>> = [];
	private slideMediaWrappers: HTMLElement[] = [];
	private uiCircles: UICircleProgress[] = [];
	private wrapperRef: HTMLDivElement;
	// @ts-ignore
	private VideoWrapperRef: HTMLDivElement;

	public wrapperHeight: number = 0;
	private videos: HTMLVideoElement[] = [];
	private videoContainer: HTMLElement;
	private videoControls: HTMLElement;
	private uiCirclesAnimation: any;
    private xDown = null;
    private yDown = null;

	private reTargetVideo(currentPromo) {
		if(currentPromo) {
			typeof window !== 'undefined' && window.localStorage.setItem("currentPromo", currentPromo);
		} else {
			typeof window !== 'undefined' && window.localStorage.removeItem("currentPromo");
		}
	}

	componentDidMount() {
		gsap.registerPlugin(CSSRulePlugin);
		this.slideItems = [];
		for (let i = 0; i < this.slides.length; i++) {
			const slide = this.slides[i];
			this.slideItems.push(slide.querySelectorAll(`.${styles.slideOverlay} > *`));
			for (let j = 0; j < this.slideItems[i].length; j++) {
				TweenMax.set(this.slideItems[i][j], { y: 150, opacity: 0, force3D: true });
			}
		}

		window.addEventListener('resize', this.resizeHandler);
		this.resizeHandler();
		this.nextSlide(0, 0.5);

		if(this.props.items.length <= 1) {
			var video = document.getElementById("bgvid-0");
			video.onloadeddata = () => {
				this.reTargetVideo(this.props.promo)
			}
		}

        document.addEventListener('touchstart', this.handleTouchStart, false);
        document.addEventListener('touchmove', this.handleTouchMove, false);
	}

    private getTouches = (evt) => {
        return evt.touches ||             // browser API
               evt.originalEvent.touches; // jQuery
      }                                                     
                                                                               
    private handleTouchStart = (evt) => {
        const firstTouch = this.getTouches(evt)[0];                                      
        this.xDown = firstTouch.clientX;                                      
        this.yDown = firstTouch.clientY;                                      
    };                                                
                                                                            
    private handleTouchMove = (evt) => {
        if ( ! this.xDown || ! this.yDown ) {
            return;
        }
    
        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;
    
        var xDiff = this.xDown - xUp;
        var yDiff = this.yDown - yUp;
                                                                            
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
            if ( xDiff > 0 ) {
                return this.props.animationDirection === 1 ? this.prevSlide : this.paginationClickCallback
            } else {
                return this.props.animationDirection === 1 ? this.paginationClickCallback : this.prevSlide
            }                       
        }
        /* reset values */
        this.xDown = null;
        this.yDown = null;                                             
    };

	private resizeHandler = () => {
		const isMobile = window.innerWidth <= 768;
		if (isMobile) {
			this.wrapperHeight = this.wrapperRef.clientHeight * 0.5;
		} else {
			this.wrapperHeight = this.wrapperRef.clientHeight;
		}
	};

	private nextSlide = (overrideIndex: number = null, delayTextIn = 0) => {
		//Change index:
		let prevIndex = this.state.currentSlideIndex;
		let nextIndex = overrideIndex !== null ? overrideIndex : this.state.currentSlideIndex + 1;
		if (nextIndex >= this.slides.length) {
			nextIndex = 0;
		}

		if (this.state.currentSlideIndex !== nextIndex) {
			this.setState({ currentSlideIndex: nextIndex });
			if (this.videos[nextIndex]) {
				this.videos[nextIndex].play();
			}

			TweenMax.set(this.slides[nextIndex], { pointerEvents: 'all' });
			if (prevIndex >= 0) {
				TweenMax.set(this.slides[prevIndex], { pointerEvents: '' });
				for (let i = 0; i < this.slideItems[prevIndex].length; i++) {
					const element = this.slideItems[prevIndex][i];
					TweenMax.to(element, 0.95 + i * 0.1, { y: -75, ease: EASE_CUSTOM_IN_OUT, force3D: true });
					TweenMax.to(element, 0.65 + i * 0.1, { opacity: 0, ease: Sine.easeOut, force3D: true });
				}

				TweenMax.killTweensOf(this.uiCircles[prevIndex]);
				TweenMax.killTweensOf(this.slideItems[nextIndex]);

				TweenMax.to(this.slideMediaWrappers[prevIndex], 0.75, {
					opacity: 0,
					force3D: true,
					onComplete: () => {
						if (this.videos[prevIndex]) {
							this.videos[prevIndex].pause();
						}
						TweenMax.set(this.slideMediaWrappers[prevIndex], { scale: 1.1, force3D: true });
					}
				});
			}

			this.uiCirclesAnimation = TweenMax.fromTo(this.uiCircles[nextIndex], SLIDE_DURATION, { progress: 0 }, { progress: 0.999, ease: Linear.easeNone, onComplete: this.nextSlide });
			TweenMax.to(this.slideMediaWrappers[nextIndex], 0.75, { scale: 1, opacity: 1, force3D: true });

			for (let i = 0; i < this.slideItems[nextIndex].length; i++) {
				const element = this.slideItems[nextIndex][i];
				TweenMax.fromTo(element, 1.5 + i * 0.15, { y: 150 }, { y: 0, ease: EASE_CUSTOM_IN_OUT, force3D: true, delay: 0.5 + delayTextIn });
				TweenMax.fromTo(element, 0.9 + i * 0.15, { opacity: 0 }, { opacity: 1, ease: 'circ.inOut', force3D: true, delay: 0.5 + delayTextIn });
			}
		}
	};

	componentWillUnmount() {
		this.exitVideo();
		window.removeEventListener('resize', this.resizeHandler);
		TweenMax.killTweensOf(this.uiCircles);
		TweenMax.killTweensOf(this.slides);
        document.removeEventListener('touchstart', this.handleTouchStart, false);
        document.removeEventListener('touchmove', this.handleTouchMove, false);
	}

	private prevSlide = () => {
		if (this.state.currentSlideIndex == 0) {
			this.nextSlide(this.slides.length - 1);
		} else {
			this.nextSlide(this.state.currentSlideIndex - 1);
		}
	};

	private paginationClickCallback = (index: number) => {
		var videoWrapperRef = document.getElementById('videoWrapperRef-' + this.state.currentSlideIndex);
		var rule = CSSRulePlugin.getRule('.LandingPageGallery-module--videoWrapper--3gzQc::before');
		TweenMax.fromTo(
			videoWrapperRef,
			1,
			{
				autoAlpha: 0,
				scale: 1.5
			},
			{
				autoAlpha: 1,
				scale: 1,
				transformOrigin: '50% 50%',
				ease: Power2.easeOut
			}
		);
		this.uiCirclesAnimation.paused(false)
		TweenMax.to(rule, 0, { zIndex: 0, ease: Power2.easeOut });
		this.setState({ playing: true });
		this.nextSlide(index);
	};

	private exitVideo = (event = null) => {
		if (event) {
			event.preventDefault();
		}
		if (this.videoContainer) {
			TweenMax.to(this.videoContainer, 0.5, {
				opacity: 0,
				onComplete: () => {
					if (this.videoContainer) {
						document.body.removeChild(this.videoContainer);
						this.videoContainer = null;
					}
				}
			});
		}
	};

	handleOnSubmit = e => {
		navigate(e);
	};

	handlePlayerClick = e => {
		if (e.key === 'Enter' || e.type === 'click') {
			e.preventDefault();
			var video = document.getElementById('bgvid-' + this.state.currentSlideIndex);
			var videoWrapperRef = document.getElementById('videoWrapperRef-' + this.state.currentSlideIndex);
			var rule = CSSRulePlugin.getRule('.LandingPageGallery-module--videoWrapper--3gzQc::before');
			// @ts-ignore
			if (video.paused) {
				// @ts-ignore
				video.play();
				TweenMax.fromTo(
					videoWrapperRef,
					1,
					{
						autoAlpha: 0,
						scale: 1.5
					},
					{
						autoAlpha: 1,
						scale: 1,
						transformOrigin: '50% 50%',
						ease: Power2.easeOut
					}
				);
				this.uiCirclesAnimation.paused(false)
				TweenMax.to(rule, 0, { zIndex: 0, ease: Power2.easeOut });
				TweenMax.fromTo(this.videoControls, 0.25, { opacity: 1, scale: 0.25 }, { opacity: 1, scale: 1 })
					.reverse()
					.timeScale(2);
			} else {
				// @ts-ignore
				video.pause();
				TweenMax.fromTo(
					videoWrapperRef,
					1,
					{
						autoAlpha: 0,
						scale: 1.5
					},
					{
						autoAlpha: 1,
						scale: 1,
						transformOrigin: '50% 50%',
						ease: Power2.easeOut
					}
				);
				this.uiCirclesAnimation.paused(true)
				TweenMax.to(rule, 0, { zIndex: 1, ease: Power2.easeIn });
				TweenMax.fromTo(this.videoControls, 0.25, { opacity: 1, scale: 0.25 }, { opacity: 1, scale: 1 }).timeScale(1);
			}

			if (window.matchMedia('(prefers-reduced-motion)').matches) {
				video.removeAttribute('autoplay');
				// @ts-ignore
				video.pause();
			}

			if (!this.state.playing) {
				this.setState({ playing: true });
			} else {
				this.setState({ playing: false });
			}

            document.getElementById('controls').focus();
		}
	};

	render() {
		let videoTitle;
		let videoSubtitle;
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

		return (
			<div ref={ref => (this.wrapperRef = ref)} className={styles.wrapper}>
				{this.props.items.map((item, index) => {
					const useVideo = item.useVideo;
					videoTitle = item.title.title
					videoSubtitle = item.subtitle.subtitle
					
					if (this.props.promotionalVideo && this.props.items.length <= 1 && visited === this.props.promo) {
						videoTitle = this.props.promotionalVideo.title.title
						videoSubtitle = this.props.promotionalVideo.subtitle.subtitle
					}
					return (
						<>
                            {
                                // @ts-ignore
                                <GatsbyImageWrapper loading='eager' id="placeholder" alt={item.title} outerWrapperClassName={`${styles.placeHolder} ${this.state.currentSlideIndex !== index && 'hidden'}`} image={item.image} />
                            }
                            <div onClick={() => this.handleOnSubmit(item.ctaLink?.ctaLink)} className={styles.slide} ref={ref => (this.slides[index] = ref)} key={item.id}>
                                <div ref={ref => (this.slideMediaWrappers[index] = ref)} className={styles.slideMediaWrapper}>
                                    {
                                    // @ts-ignore
                                    !useVideo && <GatsbyImageWrapper alt={item.title} outerWrapperClassName={styles.imageWrapper} image={item.image} />}
                                    {
                                    // @ts-ignore
                                    !useVideo && <GatsbyImageWrapper alt={item.title} outerWrapperClassName={styles.imageWrapperMobile} image={item.image} />}
                                    {useVideo && (
                                        <div
                                            className={styles.videoWrapper}
                                            ref={div => (this.VideoWrapperRef = div)}
                                            id={`videoWrapperRef-${index}`}
                                        >
                                            <video 
                                                id={`bgvid-${index}`} 
                                                muted 
                                                playsInline 
                                                preload="true" 
                                                autoPlay={true}
                                                loop 
                                                src={isMobile ? item.mobileVideoUrl : item.videoUrl} 
                                            />
                                        </div>
                                    )}
                                </div>
                                {
                                    // this.state.currentLocation !== 'QA' &&
                                    <div className={styles.slideOverlayWrapper}>
                                        <div className={`container-padding ${styles.slideOverlay}`}>
                                            <h1 className={`text-style-h1`}>
                                                {videoTitle}
                                            </h1>
                                            <p className={`text-style-body`}>
                                                {videoSubtitle}
                                            </p>
                                            <a className={`text-style-body ${styles.ctaLink} ${styles.ctaLinkNormal}`} href={item.ctaLink?.ctaLink}>
                                                {item.ctaText}
                                            </a>
                                        </div>
                                    </div>
                                }
                            </div>
						</>
					);
				})}
                <div className={styles.videoControls}>
                    <div ref={ref => (this.videoControls = ref)} id="vidhomepagecontrols">
                    <svg tabIndex={0} id='controls' onClick={(e) => this.handlePlayerClick(e)} onKeyDown={(e) => this.handlePlayerClick(e)} focusable="true" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
                        {this.state.playing ? (
                            <path d="M12 8V24H8V8h4m0-2H8A2 2 0 006 8V24a2 2 0 002 2h4a2 2 0 002-2V8a2 2 0 00-2-2zM24 8V24H20V8h4m0-2H20a2 2 0 00-2 2V24a2 2 0 002 2h4a2 2 0 002-2V8a2 2 0 00-2-2z"></path>
                        ) : (
                            <path d="M7,28a1,1,0,0,1-1-1V5a1,1,0,0,1,1.4819-.8763l20,11a1,1,0,0,1,0,1.7525l-20,11A1.0005,1.0005,0,0,1,7,28ZM8,6.6909V25.3088L24.9248,16Z"></path>
                        )}
                    </svg>
                    </div>
                </div>
				{
					this.props.items.length > 1 && (
						<ul className={styles.pagination}>
							{this.props.items.map((item, index) => (
								<UICircleProgress
									clickCallback={this.paginationClickCallback}
									index={index}
									ref={ref => (this.uiCircles[index] = ref)}
									key={item.id}
									className={styles.paginationItem + (index === this.state.currentSlideIndex ? ' active' : '')}
								/>
							))}
						</ul>
					)
				}
			</div>
		);
	}
}

export default LandingPageGallery;

export const query = graphql`
	fragment LandingPageGalleryFragment on ContentfulPageHome {
		landingGallery {
			id
			title {
				title
			}
			subtitle {
				subtitle
			}
			useVideo
			videoUrl
			mobileVideoUrl
			ctaText
			ctaLink {
				ctaLink
			}
			image {
				gatsbyImageData(
                    placeholder: NONE
                    width: 1680
                    quality: 85
                    layout: FULL_WIDTH
                )
			}
		}
	}
`;
