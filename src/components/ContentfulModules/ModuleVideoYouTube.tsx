import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleVideoYouTube.module.scss';
import { ContentfulModuleVideoYouTubeFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';

export function getYoutubeId(url) {
	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = url.match(regExp);

	if (match && match[2].length == 11) {
		return match[2];
	} else {
		return 'error';
	}
}

const initialState = { inited: false };
type State = Readonly<typeof initialState>;

class ModuleVideoYouTube extends Component<{ data: ContentfulModuleVideoYouTubeFragment, compact?: boolean }, State> {
	readonly state: State = initialState;

	private url = '//www.youtube.com/embed/' + getYoutubeId(this.props.data.youTubeUrl) + '?modestbranding=1&rel=0&showinfo=0&color=white&autoplay=1&mute=1';

	private initVideo = event => {
		event.preventDefault();
		if (!this.state.inited) {
			this.setState({ inited: true });
		}
		return false;
	};

	render() {
		return (
			<ViewableMonitor disabled={this.state.inited}>
				<div className={`${!this.props.compact ? 'module-margin' : ''} ${styles.wrapper} ${this.state.inited ? styles.inited : ''}`}>
					<div className={styles.aspectWrapper}>
						<iframe title='iFrame' id="ytplayer" width="100%" height="100%" src={this.state.inited ? this.url : ''} frameBorder="0" allowFullScreen />
						<div className={styles.overlay} onClick={this.initVideo}>
                            {
                                // @ts-ignore
							    <GatsbyImageWrapper alt={this.props.data.posterImage.title} image={this.props.data.posterImage} />
                            }
							<div className={styles.playButton} />
							<div className={`${styles.captionInfo}`}>
								<span>{this.props.data.title}</span>
								<span>{this.props.data.duration}</span>
							</div>
						</div>
					</div>
				</div>
			</ViewableMonitor>
		);
	}
}

export default ModuleVideoYouTube;

export const query = graphql`
	fragment ContentfulModuleVideoYouTubeFragment on ContentfulModuleVideoYouTube {
		id
		youTubeUrl
		title
		duration
		posterImage {
            title
			gatsbyImageData(
                placeholder: NONE
                width: 960
                height: 540
                quality: 85
                resizingBehavior: FILL
                layout: FULL_WIDTH
              )
		}
	}
`;
