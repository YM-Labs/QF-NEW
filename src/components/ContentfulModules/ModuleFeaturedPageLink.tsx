import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleFeaturedPageLink.module.scss';
import { ContentfulModuleFeaturedPageLinkFragment } from '../../gatsby-queries';
import GatsbyLinkExternalSupport from '../../ui/GatsbyLinkExternalSupport';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { FormattedMessage } from 'react-intl';
import { graphql } from 'gatsby';
import GatsbyLink from 'gatsby-link';

class ModuleFeaturedPageLink extends Component<{ data: ContentfulModuleFeaturedPageLinkFragment; asHighlightedItem?:boolean; articles?:boolean; compactMode?: boolean }> {
	render() {
		if(this.props.articles) {
			return (
				<div className={`module-margin w-100 ${styles.wrapper} ${this.props.asHighlightedItem === true ? styles.highlightedItem : ''} ${this.props.data.openInNewTab ? styles.externalLink : ''}`}>
					<GatsbyLinkExternalSupport to={this.props.data.link} openinnewtab={this.props.data.openInNewTab}>
						<div className={styles.innerWrapper}>
								<div className={`${styles.textWrapper}`}>
									<div className={styles.textWrapperInner}>
										<div>
											<div className={`text-style-body ${styles.typeHeading}`}>
												{
													// @ts-ignore
													('0' + this.props.data.index).slice(-2)
												}
											</div>
										</div>
										{
										// @ts-ignore
										this.props.asHighlightedItem && <GatsbyImageWrapper alt={this.props.data.title} image={this.props.data.teaserImage} />}
										<div>
											<div className={styles.titleDetailWrapper}>
												{
													// @ts-ignore
													<h2 className={`text-style-h3 ${styles.title}`}>{this.props.data.title}</h2>
												}
												{
													// @ts-ignore
													this.props.data.introductionText && (
														// @ts-ignore
														<div className={`text-style-body ${styles.description}`} dangerouslySetInnerHTML={{ __html: this.props.data.introductionText.introductionText }} />
													)
												}
											</div>
										</div>
									</div>
									{
										// @ts-ignore
										<GatsbyLink to={`${this.props.data.node_locale === 'ar-QA' ? '/ar' : ''}/stories/${this.props.data.slug}`} className={`text-style-link-1 ${styles.ctaLink}`} tabIndex={0}>
											<FormattedMessage id={'page.link'} />
										</GatsbyLink>
									}
								</div>
						</div>
					</GatsbyLinkExternalSupport>
				</div>
			);
		} else {
			return (
				<div className={`module-margin w-100 ${styles.wrapper} ${this.props.asHighlightedItem === true ? styles.highlightedItem : ''} ${this.props.data.openInNewTab ? styles.externalLink : ''}`}>
					<GatsbyLinkExternalSupport to={this.props.data.link} openinnewtab={this.props.data.openInNewTab}>
						<div className={styles.innerWrapper}>
								<div className={`${styles.textWrapper}`}>
									<div className={styles.textWrapperInner}>
										<div>
                                            {(!this.props.compactMode && this.props.data.typeHeading) && (
												<div className={`text-style-body ${styles.typeHeading}`} dangerouslySetInnerHTML={{ __html: this.props.data.typeHeading.childMarkdownRemark.html }} />
											)}
										</div>
										{
                                            // @ts-ignore
                                            this.props.asHighlightedItem && <GatsbyImageWrapper alt={this.props.data.titleText?.titleText} image={this.props.data.image?.imageHighlighted} />
                                        }
										<div>
											<div className={styles.titleDetailWrapper}>
                                                <h2 className={`text-style-h3 ${this.props.compactMode ? styles.titleCompact : styles.title}`}>{this.props.data.titleText?.titleText}</h2>
												{this.props.data.description && (
													<div className={`text-style-body ${styles.description}`} dangerouslySetInnerHTML={{ __html: this.props.data.description?.childMarkdownRemark.html }} />
												)}
											</div>
										</div>
									</div>
									{
										this.props.data.linkText && (
											<span className={`text-style-link-1 ${styles.ctaLink}`} tabIndex={0}>
												{this.props.data.linkText}
											</span>
										)
									}
								</div>
                                {!this.props.asHighlightedItem &&
								    <div className={styles.imageWrapper}>
                                        {
                                            // @ts-ignore
                                            <GatsbyImageWrapper alt={this.props.data.titleText.titleText} image={this.props.data.image.image} />
                                        }
                                    </div>
                                }
						</div>
					</GatsbyLinkExternalSupport>
				</div>
			);
		}
	}
}

export default ModuleFeaturedPageLink;

export const query = graphql`
	fragment ContentfulModuleFeaturedPageLinkFragment on ContentfulModuleFeaturedPageLink {
		id
		typeHeading {
			childMarkdownRemark {
				html
			}
		}
		description {
			childMarkdownRemark {
				html
			}
		}
		titleText {
			titleText
		}
		linkText
		link
		image {
			image: gatsbyImageData(
                placeholder: NONE
                width: 680
                height: 874
                quality: 85
            )
			imageHighlighted: gatsbyImageData(
                placeholder: NONE
                width: 900
                height: 560
                quality: 85
            )
		}
		openInNewTab
	}
`;