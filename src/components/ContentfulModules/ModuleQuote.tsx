import * as React from 'react';
import * as styles from './ModuleQuote.module.scss';
import { Component } from 'react';
import { ContentfulModuleQuoteFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';

class ModuleQuote extends Component<{ data: ContentfulModuleQuoteFragment, inline?: boolean; inlineFullWidth?: boolean }> {
	render() {
		const imageMode = this.props.data.image && !this.props.inline && !this.props.inlineFullWidth && !this.props.data.useCompactDesign;
		return (
			<div
				className={`module-margin ${styles.wrapper} ${this.props.data.useCompactDesign ? styles.compact : ''} ${this.props.inline ? styles.inline : ''} ${(this.props.inlineFullWidth === true ? styles.inlineFullWidth : '')} ${this.props.data.quoteOnRightSide ? styles.rightToLeft : ''} ${imageMode ? styles.imageMode : ''}`}>
				{imageMode && <>
					<ViewableMonitor delay={true}>
						<div>
							<div className={styles.imageWrapper}>
								{
									// @ts-ignore
									<GatsbyImageWrapper alt={this.props.data.image.title} outerWrapperClassName={styles.desktopImage} image={this.props.data.image.desktop} />
								}
								{
									// @ts-ignore
									<GatsbyImageWrapper alt={this.props.data.image.title} outerWrapperClassName={styles.mobileImage} image={this.props.data.image.mobile} />
								}
							</div>
							<div className={styles.quoteWrapper}>
								<div className="text-style-quote" dangerouslySetInnerHTML={{ __html: this.props.data.quote.childMarkdownRemark.html }} />
								<div className={styles.authorWrapper + ' ' + styles.authorWrapperDesktop}>
									<span className="text-style-quoted-by">{this.props.data.author}</span>
									<span className={styles.title}>{this.props.data.title}</span>
								</div>
							</div>
							<div className={styles.authorWrapper}>
								<span className="text-style-quoted-by">{this.props.data.author}</span>
								<span className={styles.title}>{this.props.data.title}</span>
							</div>
						</div>
					</ViewableMonitor>
				</>}
				{!imageMode && <><ViewableMonitor>
					<div className={styles.quoteWrapper}>
						<div className="text-style-quote" dangerouslySetInnerHTML={{ __html: this.props.data.quote.childMarkdownRemark.html }} />
					</div>
				</ViewableMonitor>
					<ViewableMonitor delay={true}>
						<div className={styles.authorWrapper}>
							<span className="text-style-quoted-by">{this.props.data.author}</span>
							<span className={styles.title}>{this.props.data.title}</span>
						</div>
					</ViewableMonitor>
				</>}
			</div>
		);
	}
}

export default ModuleQuote;

export const query = graphql`
	fragment ContentfulModuleQuoteFragment on ContentfulModuleQuote {
		id
		quote {
			quote
			childMarkdownRemark {
				html
			}
		}
		author
		title
		useCompactDesign
		quoteOnRightSide
		image {
			title
			desktop: gatsbyImageData(
                placeholder: NONE
                height: 1200
                width: 900
                quality: 85
              )
			mobile: gatsbyImageData(
                placeholder: NONE
                width: 640
                quality: 85
              )
		}
	}
`;
