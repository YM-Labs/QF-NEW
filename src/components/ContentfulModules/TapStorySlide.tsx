import { gsap } from 'gsap/dist/gsap.min';
import Hls from 'hls.js';
import { lowerCase } from 'lodash';
import * as React from 'react';
import { Component } from 'react';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import * as styles from './TapStorySlide.module.scss';
import { Globals } from '../../utils/Globals';

interface Props {
	className: string;
	mainSlide: boolean;
	active: boolean;
	title: string;
	text: { childMarkdownRemark: { html } };
	textPosition: string;
	videoMux: { playbackId: string };
	videoFile: any;
	videoAutoplay: boolean;
	videoLoop: boolean;
	videoHasSound: boolean;
	videoPosterImage: any;
	verticalTextPosition: any;
	isFullscreen: any;
	fullscreenOnMobile: boolean;
	isThemeLight: any;
	notFullHeight: boolean;
	image: any;
	format: 'portrait' | 'landscape' | 'textOnly';
	globalMute: boolean;
	onThrowComplete: boolean;
	toggleSound?: any;
	makeTheMediaFullHeight: boolean;
	index: number;
}

class TapStorySlide extends Component<Props> {
	private videoRef: HTMLVideoElement;
	private playButton: HTMLSpanElement;
	private isPlaying: boolean = false;
	// private isWaiting: boolean = false;
	private hasBeenClicked: boolean = false;
	private wrapperRef: HTMLDivElement;
	// private isActive: boolean = false;
	private delaySoundClick: boolean = false;
	readonly state = {
		isMuted: !this.props.videoHasSound ? true : this.props.videoAutoplay
		// isMuted: true
	};

	componentDidMount() {
		let hls;

		if (this.videoRef && this.props.videoMux) {
			const video = this.videoRef;

			if (video.canPlayType('application/vnd.apple.mpegurl')) {
				// Some browers (safari and ie edge) support HLS natively
				video.src = `https://stream.mux.com/${this.props.videoMux.playbackId}.m3u8`;
			} else if (Hls.isSupported()) {
				// This will run in all other modern browsers
				hls = new Hls();
				hls.loadSource(`https://stream.mux.com/${this.props.videoMux.playbackId}.m3u8`);
				hls.attachMedia(video);
			} else {
				console.error('This is a legacy browser that doesn\'t support MSE');
			}
		}

		if (!this.props.videoLoop) {
			this.videoRef && this.videoRef.addEventListener('ended', this.videoEnded);
		}

		const canplaythrough = () => {
			// console.log('canplaythrough_' + this.props.index);

			if (!this.hasBeenClicked) {
				gsap.set(this.playButton, { autoAlpha: 1 });
			}
			this.videoRef.removeEventListener('canplaythrough', canplaythrough);
		};

		const loadedmetadata = () => {
			// console.log('loadedmetadata_' + this.props.index);
			if (!this.hasBeenClicked) {
				gsap.set(this.playButton, { autoAlpha: 1 });
			}
			this.videoRef.removeEventListener('loadedmetadata', loadedmetadata);
		};

		this.videoRef && this.videoRef.addEventListener('canplaythrough', canplaythrough);
		this.videoRef && this.videoRef.addEventListener('loadedmetadata', loadedmetadata);

		this.videoRef && this.videoRef.load();

		if (this.playButton) {
			if (Globals.IS_TOUCH_DEVICE()) {
				this.playButton.addEventListener('touchend', this.playVideo);
			} else {
				this.playButton.addEventListener('mouseup', this.playVideo);
			}

		}

		window.addEventListener('resize', this.resizeHandler);
		this.resizeHandler();
	}

	public componentWillUnmount() {
		window.removeEventListener('resize', this.resizeHandler);
		if (!this.props.videoLoop) {
			this.videoRef && this.videoRef.removeEventListener('ended', this.videoEnded);
		}
	}

	public componentDidUpdate() {}

	public animateIn = () => {
		if (this.props.videoAutoplay && this.videoRef) {
			if (this.playButton) {
				this.playButton.style.opacity = '0';
			}
			this.playVideo();
		}
	};

	public animateOut = () => {
		if(this.videoRef) {
			this.videoEnded();
		}
	};

	private toggleSound = (state, event) => {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		if (this.delaySoundClick) return;
		this.delaySoundClick = true;

		this.setState({ isMuted: state }, () => {
			window.setTimeout(() => {
				this.delaySoundClick = false;
			}, 100);
		});
	};


	getLayoutStyle = () => {
		let layoutStyle = '';
		let alignment = lowerCase(this.props.textPosition);

		if (this.props.image) {
			layoutStyle += ' ';
		} else if (this.props.videoMux || this.props.videoFile) {
			layoutStyle += ' ' + styles.mediaVideo;
		}

		if (alignment === 'right') {
			layoutStyle += ' ' + styles.alignRight;
		} else if (alignment === 'center' && ((this.props.format === 'textOnly') || (this.props.format === 'landscape' && this.props.isFullscreen))) {
			layoutStyle += ' ' + styles.alignCenter;
		} else {
			layoutStyle += ' ' + styles.alignLeft;
		}

		if (this.props.mainSlide) {
			layoutStyle += ' ' + styles.mainSlide;
		}

		if (this.props.fullscreenOnMobile) {
			layoutStyle += ' ' + styles.fullscreenOnMobile;
		}
		if (this.props.isThemeLight) {
			layoutStyle += ' ' + styles.themeLight;
		}
		if (!this.props.makeTheMediaFullHeight) {
			layoutStyle += ' ' + styles.notFullHeight;
		}

		if (this.props.isFullscreen && this.props.format && this.props.format === 'landscape') {
			layoutStyle += ' ' + styles.fullscreen;
		} else if (this.props.format) {
			layoutStyle += ' ' + styles[this.props.format];
		}
		if (this.props.verticalTextPosition) {
			const verticalPosition = lowerCase(this.props.verticalTextPosition);

			if (verticalPosition === 'top') {
				layoutStyle += ' ' + styles.verticalAlignTop;
			} else if (verticalPosition === 'bottom') {
				layoutStyle += ' ' + styles.verticalAlignBottom;
			} else {
				layoutStyle += ' ' + styles.verticalAlignCenter;
			}
		} else {
			layoutStyle += ' ' + styles.verticalAlignCenter;
		}
		return layoutStyle;
	};

	private delayPlayClick: boolean = false;

	enableClick = () => {
		// @ts-ignore
		window.IGNORE_CLICK = false;
	};

	timeOut;

	playVideo = (e?) => {
		if (e) {
			// e.preventDefault();
			// e.stopPropagation();
		}

		// @ts-ignore
		if (window.IS_DRAGGING && !this.props.videoAutoplay) {
			return;
		}

		window.clearTimeout(this.timeOut);

		// @ts-ignore
		window.IGNORE_CLICK = true;

		if (this.delayPlayClick) return;
		this.delayPlayClick = true;

		if (!this.hasBeenClicked) this.hasBeenClicked = true;
		if (!this.isPlaying) {
			// this.isWaiting = true;
			this.videoRef.play().then(() => {
				// this.isWaiting = false;
				this.isPlaying = true;

				if (this.playButton) {
					this.playButton.style.opacity = '0';
				}
			});

		} else if (this.isPlaying) {
			this.videoEnded();
		}

		this.timeOut = window.setTimeout(this.enableClick, 500);

		window.setTimeout(() => {
			this.delayPlayClick = false;
		}, 100);
	};

	videoEnded = () => {
		this.videoRef.pause();
		this.isPlaying = false;
		if (this.playButton && !this.isPlaying) {
			this.playButton.style.opacity = '1';
		}
	};


	private resizeHandler = () => {
		if (this.wrapperRef) {
			this.wrapperRef.style.width = window.innerWidth + 'px';
		}
	};

	render() {
		let isMobile = false;
		if (typeof window !== `undefined`) {
			isMobile = window.innerWidth <= 768;
		}

		let posterImage = null;

		if (this.props.videoPosterImage && this.props.videoPosterImage.file) {
			posterImage = this.props.videoPosterImage.file.url;
		}

		// @ts-ignore
		return (
			<div className={`${styles.wrapper} ${this.props.className} ${this.getLayoutStyle()}`} ref={ref => {
				this.wrapperRef = ref;
			}}>
				{(this.props.text || this.props.title) && (
					<div className={styles.textWrapper}>
						<div>
							{
								this.props.title && (
									this.props.mainSlide ? <h1 className={styles.mainTitle}>{this.props.title}</h1> : <h2 className={styles.title}>{this.props.title}</h2>
								)
							}
							{
								this.props.text && (
									<div className={styles.paragraphText}>
										<div className={styles.slideText} dangerouslySetInnerHTML={{ __html: this.props.text.childMarkdownRemark.html }} />
									</div>
								)
							}
						</div>
					</div>
				)}
				{
					(this.props.image || this.props.videoFile || this.props.videoMux) && (
						<div className={styles.mediaWrapper}>
							{(this.props.videoFile || this.props.videoMux) &&
							<a className={styles.playButton}
							   href='#'
							   ref={ref => {
								   this.playButton = ref;
							   }}
							>
								<span />
							</a>
							}
							{
								this.props.image ?
									(
										<GatsbyImageWrapper
											alt={this.props.image.title}
											outerWrapperClassName={styles.desktopImage}
											image={
												this.props.isFullscreen ? this.props.image.fullscreen :
													this.props.format === 'portrait' ? isMobile ? this.props.image.mobilePortrait : this.props.image.portrait
														: isMobile ? this.props.image.landscapeMobile : this.props.image.landscape
											}
											className={styles.gatsbyImage}
										/>
									) : <div className={styles.aspectWrapper}>

										{
											this.props.videoMux ? (
												<video
													playsInline={true}
													// autoPlay={this.props.videoAutoplay}
													poster={posterImage}
													autoPlay={false}
													loop={this.props.videoLoop}
													muted={this.state.isMuted}
													// muted={true}
													ref={(ref) => {
														this.videoRef = ref;
													}}
												/>
											) : (
												<video
													playsInline={true}
													// autoPlay={this.props.videoAutoplay}
													autoPlay={false}
													loop={this.props.videoLoop}
													poster={posterImage}
													muted={this.state.isMuted}
													// muted={true}
													ref={(ref) => {
														this.videoRef = ref;
													}}
												>
													<source src={this.props.videoFile.file && this.props.videoFile.file.url} type={this.props.videoFile.file && this.props.videoFile.file.contentType} />
												</video>
											)

										}
									</div>
							}
							{
								this.props.videoHasSound && (
									<a
										// title={this.props.intl.formatMessage({ id: 'closemenutitle' })}
										title={'mute button'}
										className={`${styles.muteButton} ${this.state.isMuted ? styles.isToggled : ''}`}
										href='#toggle-sound'
										// id='toggle-sound'
										// aria-label={this.props.intl.formatMessage({ id: 'closemenuarialabel' })}
										aria-label={'mute button'}
										onTouchEnd={(e) => {
											Globals.IS_TOUCH_DEVICE() && this.toggleSound(!this.state.isMuted, e);
										}}
										onMouseUp={(e) => {
											!Globals.IS_TOUCH_DEVICE() && this.toggleSound(!this.state.isMuted, e);
										}}
									/>
								)
							}
						</div>
					)
				}
			</div>
		);
	}
}


export default TapStorySlide;