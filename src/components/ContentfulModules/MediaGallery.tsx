import * as React from 'react';
import { Component } from 'react';
import * as styles from './MediaGallery.module.scss';
import { ContentfulMediaGalleryFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';
import { humanFileSize, humanFiletype } from '../../utils/StringUtils';
import { FormattedDate, FormattedMessage } from 'react-intl';

const initialState = { activeIndex: -1, open: false };
type State = Readonly<typeof initialState>;

class MediaGallery extends Component<{ data: ContentfulMediaGalleryFragment, inPage?: boolean }, State> {
	readonly state: State = initialState;
	private videoRef: HTMLVideoElement;

	private listItemClickHandler = event => {
		if (event.key === 'Enter' || event.type === 'click' && event.target.nodeName !== 'A') {
			event.preventDefault();
			const newIndex = parseInt(event.currentTarget.dataset.index);
			if (!this.state.open) {
				document.documentElement.addEventListener('keyup', this.keyboardHandler);
			}
			if (this.state.activeIndex !== newIndex) {
				this.setState({ activeIndex: newIndex, open: true });
			} else if (this.state.open === false) {
				this.setState({ open: true });
			}
			document.body.classList.add('media-gallery-open');
			document.documentElement.className = 'hidescroll';
		}
	};

	private keyboardHandler = event => {
		if (event.key === 'Escape') {
			this.close();
		} else if (event.key === 'ArrowRight') {
			let newIndex = this.state.activeIndex + 1 > this.props.data.medias.length - 1 ? 0 : this.state.activeIndex + 1;
			this.setState({ activeIndex: newIndex });
		} else if (event.key === 'ArrowLeft') {
			let newIndex = this.state.activeIndex - 1 < 0 ? this.props.data.medias.length - 1 : this.state.activeIndex - 1;
			this.setState({ activeIndex: newIndex });
		}
	};

	private close = () => {
		if (this.videoRef) {
			this.videoRef.pause();
		}
		this.setState({ open: false });
		document.body.classList.remove('media-gallery-open');
		document.documentElement.className = '';
		document.documentElement.removeEventListener('keyup', this.keyboardHandler);
	};

	private closeClickHandler = event => {
		if (event.type === 'click' && event.target.nodeName !== 'A') {
			event.preventDefault();
			this.close();
		}
	};

	componentWillUnmount() {
		document.body.classList.remove('media-gallery-open');
		document.documentElement.className = '';
		document.documentElement.removeEventListener('keyup', this.keyboardHandler);
	}

	render() {
		if (this.state.activeIndex > -1 && this.props.data.medias[this.state.activeIndex].file.contentType.indexOf('video') < 0) {
			this.props.data.medias[this.state.activeIndex].preview.aspectRatio = this.props.data.medias[this.state.activeIndex].file.details.image.height / this.props.data.medias[this.state.activeIndex].file.details.image.width;
		}
		const date = new Date(this.props.data.date);
		return (
			<ViewableMonitor>
				<div className={`${styles.wrapper} ${!this.props.data.mediaCenter && this.props.data.hideTopHeader && ' module-margin'}`}>
					{
						// @ts-ignore
						!this.props.data.hideTopHeader && (
							<div className={styles.top}>
								{!this.props.inPage && <h1 className={'text-style-h1'}>{this.props.data.mediaGalleryTitle.mediaGalleryTitle}</h1>}
								{/*<span className={styles.date}>{date.getDate()} <FormattedDate value={date} month="short" /> {date.getFullYear()}</span>*/}
								{!this.props.inPage && <FormattedDate value={new Date(date)} month='long' day='numeric' year='numeric' />}
								{this.props.data.downloadableBundle &&
								<a className='text-style-body' download href={this.props.data.downloadableBundle.file.url} target='_blank' rel='noopener noreferrer'>
									<FormattedMessage id={'download_full_gallery'} />
								</a>}
							</div>
						)
					}
					<div className={`${styles.imagesWrapper} ${this.props.data.layout === '3 Column' && styles.threeColumn}`}>
						{this.props.data.mediaList && this.props.data.mediaList.map((mediaItem, index) => {
							let media = null;
							let preview = null;

                            // @ts-ignore
							if (mediaItem.__typename === 'ContentfulMediaGalleryImageItem') {
                                // @ts-ignore
								media = mediaItem.image;
                                // @ts-ignore
								preview = mediaItem.image;
							} else if (mediaItem.__typename === 'ContentfulMediaGalleryVideoItem') {
								media = mediaItem.video;
								preview = mediaItem.posterImage;
							}

							return (
								<div onKeyDown={this.listItemClickHandler} className={styles.imageWrapper} key={media.id + index} onClick={this.listItemClickHandler} tabIndex={0} data-index={index}>
									{
										media.file.contentType.indexOf('video') >= 0 ? <GatsbyImageWrapper alt={media.title} image={preview.desktop} className={styles.videoPreview} /> :
											<GatsbyImageWrapper alt={media.title} image={media.desktop} />}

									<div className={styles.infoWrapper}>
										<div className={styles.titleWrapper}>
											<span className={styles.title}>{media.title}</span>
											<span className={styles.fileSize}>{humanFiletype(media.file && media.file.url) + ' - ' + humanFileSize(media.file && media.file.details.size, true)}</span>
										</div>
										<a className='text-style-body' href={media.file && media.file.url} download target='_blank' rel='noopener noreferrer'></a>
									</div>
								</div>
							);
						})}
					</div>
					{this.state.activeIndex > -1 &&
					<div
						className={styles.mediaPreview + (' ' + (this.state.open ? styles.mediaPreviewOpen : ''))}>
						<div className={styles.mediaPreviewLayer} onClick={this.closeClickHandler} />
						<div className={styles.mediaPreviewInner}>
							<span className={styles.closePreview} onClick={this.closeClickHandler}/>
							{this.props.data.medias[this.state.activeIndex].file.contentType.indexOf('video') >= 0 ?
								<video ref={ref => this.videoRef = ref} controls src={this.props.data.medias[this.state.activeIndex].file.url} /> :
								// @ts-ignore
								<GatsbyImageWrapper
									alt={this.props.data.medias[this.state.activeIndex].title}
									image={this.props.data.medias[this.state.activeIndex].preview}
									// style={{paddingBottom: this.props.data.medias[this.state.activeIndex].file.details.image.height / this.props.data.medias[this.state.activeIndex].file.details.image.width * 100 + "%"}}
								/>}
							<div className={styles.infoWrapper}>
								<div className={styles.titleWrapper}>
									<span className={styles.title}>{this.props.data.medias[this.state.activeIndex].title}</span>
									<span
										className={styles.fileSize}>{humanFiletype(this.props.data.medias[this.state.activeIndex].file && this.props.data.medias[this.state.activeIndex].file.url) + ' - ' + humanFileSize(this.props.data.medias[this.state.activeIndex].file && this.props.data.medias[this.state.activeIndex].file.details.size, true)}</span>
								</div>
								<a className='text-style-body' href={this.props.data.medias[this.state.activeIndex].file && this.props.data.medias[this.state.activeIndex].file.url} download
								   target='_blank' rel='noopener noreferrer'></a>
							</div>
						</div>
					</div>
					}
				</div>
			</ViewableMonitor>
		);
	}
}

export default MediaGallery;

export const query = graphql`
	fragment ContentfulMediaGalleryFragment on ContentfulMediaGallery {
		id
		mediaGalleryTitle {
			mediaGalleryTitle
		}
		date
		downloadableBundle {
			file {
				url
			}
		}
		hideTopHeader
        mediaCenter
		layout
		medias {
			id
			title
			file {
				contentType
				details {
					size
					image {
						width
						height
					}
				}
				url
			}
			desktop: gatsbyImageData(placeholder: NONE, width: 476, quality: 85)
			preview: gatsbyImageData(
				placeholder: NONE
				width: 2240
				height: 2240
				quality: 85
			)
		}
		mediaList {
			__typename
			... on ContentfulMediaGalleryImageItem {
				image {
					id
					title
					file {
						contentType
						details {
							size
							image {
								width
								height
							}
						}
						url
					}
					desktop: gatsbyImageData(placeholder: NONE, width: 476, quality: 85)
					preview: gatsbyImageData(
						placeholder: NONE
						width: 2240
						height: 2240
						quality: 85
					)
				}
			}
			... on ContentfulMediaGalleryVideoItem {
				video {
					id
					title
					file {
						contentType
						details {
							size
							image {
								width
								height
							}
						}
						url
					}
				}
				posterImage {
					desktop: gatsbyImageData(placeholder: NONE, width: 476, quality: 85)
				}
			}
		}
	}
`;