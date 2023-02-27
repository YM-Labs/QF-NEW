import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleImageBody.module.scss';
import { ContentfulModuleImageBodyFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import ModuleVideoEmbedded from './ModuleVideoEmbedded';
import { graphql } from 'gatsby';

class ModuleImageBody extends Component<{ data: ContentfulModuleImageBodyFragment }> {
	render() {
		return (
			<ViewableMonitor>
				<div className={`module-margin ${styles.wrapper}`}>
					<div className={`text-style-body ${styles.textWrapper}`} dangerouslySetInnerHTML={{ __html: this.props.data.text.childMarkdownRemark.html }} />
					<div className={styles.imageWrapper}>
                        {
                            this.props.data.video ? (
                                <ModuleVideoEmbedded data={this.props.data.video} removeMargin={true} />
                            ) : this.props.data.image && (
                                <>
                                    <GatsbyImageWrapper alt={this.props.data.image.title} outerWrapperClassName={styles.desktopImage} image={this.props.data.image.desktop} />
                                    <GatsbyImageWrapper alt={this.props.data.image.title} outerWrapperClassName={styles.mobileImage} image={this.props.data.image.mobile} />
                                    {
                                        this.props.data.imageCaptionOptional && <div className={`text-style-caption ${styles.caption}`}>{this.props.data.imageCaptionOptional}</div>
                                    }
                                </>
                            )
                        }

					</div>
				</div>
			</ViewableMonitor>
		);
	}
}

export default ModuleImageBody;

export const query = graphql`
	fragment ContentfulModuleImageBodyFragment on ContentfulModuleImageBody {
		id
		imageCaptionOptional
		text {
			childMarkdownRemark {
				html
			}
		}
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
        video {
			... on ContentfulModuleVideoEmbedded {
				__typename
				...ContentfulModuleVideoEmbeddedFragment
			}
		}
	}
`;