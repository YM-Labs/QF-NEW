import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleTextImageHighlight.module.scss';
import { ContentfulModuleTextImageHighlightFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';

class ModuleTextImageHighlight extends Component<{ data: ContentfulModuleTextImageHighlightFragment; index: number }> {
	render() {
		return (
			<div className={`module-margin ${styles.wrapper} ${this.props.index % 2 === 0 && styles.odd}`}>
				<ViewableMonitor>
					<div className={`${styles.textWrapper}`}>
						<div className={styles.titleDetailWrapper}>
							<span className="text-style-detail-1">
								{this.props.index <= 9 && 0}
								{this.props.index}
							</span>
							<h3 className={`text-style-h3 ${styles.title}`}>{this.props.data.titleText.titleText}</h3>
						</div>
						<div className={`text-style-body ${styles.body}`} dangerouslySetInnerHTML={{ __html: this.props.data.bodyText && this.props.data.bodyText.childMarkdownRemark.html }} />
						{this.props.data.ctaLinkOptional && this.props.data.ctaTextOptional && (
							<a className={`text-style-link-1 module-margin-small ${styles.ctaLink}`} href={this.props.data.ctaLinkOptional} target={this.props.data.openInNewTab && '_blank'}>
								{this.props.data.ctaTextOptional}
							</a>
						)}
					</div>
				</ViewableMonitor>
				<ViewableMonitor delay={true}>
					<div className={styles.imageWrapper}>
						{
							// @ts-ignore
							<GatsbyImageWrapper alt={this.props.data.image?.title} outerWrapperClassName={styles.desktopImage} image={this.props.data.image.desktop} />
						}
						{
							// @ts-ignore
							<GatsbyImageWrapper alt={this.props.data.image?.title} outerWrapperClassName={styles.mobileImage} image={this.props.data.image.mobile} />
						}
					</div>
				</ViewableMonitor>
			</div>
		);
	}
}

export default ModuleTextImageHighlight;

export const query = graphql`
	fragment ContentfulModuleTextImageHighlightFragment on ContentfulModuleTextImageHighlight {
		id
		titleText {
			titleText
		}
		bodyText {
			childMarkdownRemark {
				html
			}
		}
		ctaTextOptional
		ctaLinkOptional
		openInNewTab
		image {
			title
			desktop: gatsbyImageData(
                placeholder: NONE
                width: 560
                height: 718
                quality: 85
              )
			mobile: gatsbyImageData(
                placeholder: NONE
                width: 339
                height: 379
                quality: 85
              )
		}
	}
`;
