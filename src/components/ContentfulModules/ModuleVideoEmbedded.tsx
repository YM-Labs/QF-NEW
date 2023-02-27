import * as React from 'react';
import * as styles from './ModuleVideoEmbedded.module.scss';
import { Component } from 'react';
import { ContentfulModuleVideoEmbeddedFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

class ModuleVideoEmbedded extends Component<{ data: ContentfulModuleVideoEmbeddedFragment, removeMargin?: boolean }> {
	render() {
		return (
			<ViewableMonitor>
				<div className={`${!this.props.removeMargin && 'module-margin'} ${styles.wrapper}`}>
					<div className={styles.aspectWrapper}>
						{
							// @ts-ignore
							<video autoPlay={true} playsInline={true} loop={true} muted={true} controls={this.props.data?.hideControls ? false : true} >
								<source src={this.props.data?.video && this.props.data.video.file.url} type={this.props.data?.video && this.props.data.video.file.contentType} />
							</video>
						}
					</div>
				</div>
			</ViewableMonitor>
		);
	}
}

export default ModuleVideoEmbedded;

export const query = graphql`
	fragment ContentfulModuleVideoEmbeddedFragment on ContentfulModuleVideoEmbedded {
		id
		video {
			file {
				url
				contentType
			}
		}
		hideControls
	}
`;
