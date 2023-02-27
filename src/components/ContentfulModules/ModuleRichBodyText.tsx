import * as React from 'react';
import * as styles from './ModuleRichBodyText.module.scss';
import { Component } from 'react';
import { ContentfulModuleRichBodyTextFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { renderRichText } from "gatsby-source-contentful/rich-text";
import ModuleQuote from './ModuleQuote';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import ModuleStatistics from './ModuleStatistics';
const options = {
	renderNode: {
		[BLOCKS.EMBEDDED_ENTRY]: (node) => {
			if (node.data.target.__typename === 'ContentfulModuleQuote') {
				return <ModuleQuote key={node.data.target.contentful_id} inline={true} inlineFullWidth={true} data={node.data.target} />;
			} else if (node.data.target.__typename === 'ContentfulModuleStatisticS') {
				return <ModuleStatistics key={node.data.target.contentful_id} inline={false} inlineFullWidth={true} data={node.data.target} />;
			} else if (node.data.target.__typename === 'ContentfulMediaImageGalleryItem') {
				return (<div className={styles.imageWrapper + ' ' + styles.imageWrapperInline + ' ' + styles.fullWidth}>
					{
						// @ts-ignore
						<GatsbyImageWrapper alt={node.data.target.image.title} outerWrapperClassName={styles.desktopImage} image={node.data.target.image.desktop} />
					}
					{
						// @ts-ignore
						<GatsbyImageWrapper alt={node.data.target.image.title} outerWrapperClassName={styles.mobileImage} image={node.data.target.image.mobile} />
					}
					{node.data.target.caption && <div className={`text-style-caption`} dangerouslySetInnerHTML={{__html: node.data.target.caption.childMarkdownRemark.html}} />}
				</div>);
			}
			return <div />
		},
		[INLINES.EMBEDDED_ENTRY]: (node) => {
			if (node.data.target.__typename === 'ContentfulModuleQuote') {
				return <ModuleQuote key={node.data.target.contentful_id} inline={true} data={node.data.target} />;
			}
			else if (node.data.target.__typename === 'ContentfulModuleStatisticS') {
				return <ModuleStatistics key={node.data.target.contentful_id} inline={true} data={node.data.target} />;
			}
			else if (node.data.target.__typename === 'ContentfulMediaImageGalleryItem') {
				return (<div className={styles.imageWrapper + ' ' + styles.imageWrapperInline}>
					{
						// @ts-ignore
						<GatsbyImageWrapper alt={node.data.target.image.title} outerWrapperClassName={styles.desktopImage} image={node.data.target.image.desktop} />
					}
					{
						// @ts-ignore
						<GatsbyImageWrapper alt={node.data.target.image.title} outerWrapperClassName={styles.mobileImage} image={node.data.target.image.mobile} />
					}
					{node.data.target.caption && <div className={`text-style-caption`} dangerouslySetInnerHTML={{__html: node.data.target.caption.childMarkdownRemark.html}} />}
				</div>);
			}
			return <div />
		},
		[BLOCKS.EMBEDDED_ASSET]: (node) => {
			return (<div className={styles.imageWrapper}>
				{
					// @ts-ignore
					<GatsbyImageWrapper alt={node.data.target.title} outerWrapperClassName={styles.desktopImage} image={node.data.target.desktop} />
				}
				{
					// @ts-ignore
					<GatsbyImageWrapper alt={node.data.target.title} outerWrapperClassName={styles.mobileImage} image={node.data.target.mobile} />
				}
				{node.data.target.title && <div className={`text-style-caption`}>{node.data.target.title}</div>}
			</div>);
		},
        [BLOCKS.PARAGRAPH]: (node, children) => {
            if (
              node.content.length === 1 &&
              node.content[0].marks.find((x) => x.type === "code")
            ) {
              return <p><div dangerouslySetInnerHTML={{ __html: node.content[0].value }} /></p>;
            }
            return <p>{children}</p>;
        }
	}
};
class ModuleRichBodyText extends Component<{ data: ContentfulModuleRichBodyTextFragment }> {



	render() {
		if (this.props.data.bodyText) {
			return (
				<ViewableMonitor>
					{this.props.data.bodyText.raw && (
						<div className={`${this.props.data.compactMode ? 'module-margin-xs' : 'module-margin'} text-style-body-module ${styles.wrapper} ${this.props.data.fullWidth && styles.fullWidth}`}>
							{
                                // @ts-ignore
                                renderRichText(this.props.data.bodyText, options)
                            }
						</div>
					)}
				</ViewableMonitor>
			);
		} else {
			return <span />;
		}
	}
}

export default ModuleRichBodyText;

export const query = graphql`
	fragment ContentfulModuleRichBodyTextFragment on ContentfulModuleRichBodyText {
		id
        fullWidth
		compactMode
		bodyText {
			raw
			references {
				... on ContentfulModuleQuote {
					# contentful_id is required to resolve the references
					contentful_id
					__typename
					...ContentfulModuleQuoteFragment
				}
				... on ContentfulMediaImageGalleryItem {
					# contentful_id is required to resolve the references
					contentful_id
					__typename
					image {
						title
						desktop: gatsbyImageData(
                            placeholder: NONE
                            height: 544
                            width: 840
                            quality: 85
                          )
						mobile: gatsbyImageData(
                            placeholder: NONE
                            height: 450
                            width: 640
                            quality: 85
                          )
					}
					caption {
						childMarkdownRemark {
							html
						}
					}
				}
				... on ContentfulModuleStatisticS {
					contentful_id
					__typename
					subtitle {
						childMarkdownRemark {
							html
						}
					}
					expandedStatsTitle {
						expandedStatsTitle
					}
					statisticCharts {
						displayStyle
						displayAtHalfColumnWidth
						values {
							value
							valueLabel
							identifier
							highlighted
						}
					}
				}
				... on ContentfulAsset {
					# contentful_id is required to resolve the references
					contentful_id
					__typename
					title
					desktop: gatsbyImageData(
                        placeholder: NONE
                        height: 544
                        width: 840
                        quality: 85
                      )
					mobile: gatsbyImageData(
                        placeholder: NONE
                        height: 450
                        width: 640
                        quality: 85
                      )
				}
 		    }
		}
	}
`;
