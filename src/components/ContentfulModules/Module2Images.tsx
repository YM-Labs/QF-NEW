import * as React from 'react';
import { Component } from 'react';
import * as styles from './Module2Images.module.scss';
import { ContentfulModule2ImagesFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';
class Module2Images extends Component<{ data: ContentfulModule2ImagesFragment }> {
	render() {
		return (
			<div className={`module-margin ${styles.wrapper}`}>
				<ViewableMonitor>
					<div className={styles.imageWrapper}>
						{ 
							// @ts-ignore
							<GatsbyImageWrapper alt={this.props.data.firstImage && this.props.data.firstImage.title} image={this.props.data.firstImage && this.props.data.firstImage} />
						}
						{this.props.data.firstImageCaptionMarkdown && (
							<div className={`text-style-caption ${styles.caption}`} dangerouslySetInnerHTML={{ __html: this.props.data.firstImageCaptionMarkdown.childMarkdownRemark.html }} />
						)}
					</div>
				</ViewableMonitor>
				<ViewableMonitor delay={true}>
					<div className={styles.imageWrapper}>
						{ 
							// @ts-ignore
							<GatsbyImageWrapper alt={this.props.data.secondImage && this.props.data.secondImage.title} image={this.props.data.secondImage && this.props.data.secondImage} />
						}
						{this.props.data.secondImageCaptionMarkdown && (
							<div className={`text-style-caption ${styles.caption}`} dangerouslySetInnerHTML={{ __html: this.props.data.secondImageCaptionMarkdown.childMarkdownRemark.html }} />
						)}
					</div>
				</ViewableMonitor>
			</div>
		);
	}
}

export default Module2Images;

export const query = graphql`
	fragment ContentfulModule2ImagesFragment on ContentfulModule2Images {
		id
		firstImage {
			gatsbyImageData(
        placeholder: NONE
        height: 735
        width: 536
        quality: 85
      )
			title
		}
		secondImage {
			gatsbyImageData(
        placeholder: NONE
        height: 735
        width: 536
        quality: 85
      )
			title
		}
		firstImageCaptionMarkdown {
			childMarkdownRemark {
				html
			}
		}
		secondImageCaptionMarkdown {
			childMarkdownRemark {
				html
			}
		}
	}
`;
