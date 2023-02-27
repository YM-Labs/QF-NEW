import * as React from 'react';
import { Component } from 'react';
import * as styles from './Module2FeaturedPageLinks.module.scss';
import { ContentfulModule2FeaturedPageLinksFragment } from '../../gatsby-queries';
import GatsbyLinkExternalSupport from '../../ui/GatsbyLinkExternalSupport';
import ViewableMonitor from '../ui/ViewableMonitor';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';

class Module2FeaturedPageLinks extends Component<{ data: ContentfulModule2FeaturedPageLinksFragment }> {
	render() {

        let LinkWrapper = ({ children, to }: { children, to }) => (to ? <GatsbyLinkExternalSupport to={to}>{children}</GatsbyLinkExternalSupport> : <>{children}</>)

		return (
			<div className={`module-margin ${styles.wrapper}`}>
				<ViewableMonitor>
					<div className={styles.imageWrapper}>
						<LinkWrapper to={this.props.data.firstLink}>
                            {
                                // @ts-ignore
                                <GatsbyImageWrapper alt={this.props.data.firstTitle} image={this.props.data.firstImage} />
                            }
							<h2 className={`text-style-h2 ${styles.title}`}>{this.props.data.firstTitle}</h2>
							<p className={`${styles.description}`}>{this.props.data.firstDescription.firstDescription}</p>
							{
                                this.props.data.firstLink && (
                                    <span className={styles.ctaLink} tabIndex={0}>
                                        <span>{this.props.data.firstLinkText}</span>
                                    </span>
                                )
                            }
						</LinkWrapper>
					</div>
				</ViewableMonitor>
				<ViewableMonitor delay={true}>
					<div className={styles.imageWrapper}>
						<LinkWrapper to={this.props.data.secondLink}>
                            {
                                // @ts-ignore
							    <GatsbyImageWrapper alt={this.props.data.secondTitle} image={this.props.data.secondImage} />
                            }
							<h2 className={`text-style-h2 ${styles.title}`}>{this.props.data.secondTitle}</h2>
							<p className={`${styles.description}`}>{this.props.data.secondDescription.secondDescription}</p>
							{
                                this.props.data.secondLink && (
                                    <span className={styles.ctaLink} tabIndex={0}>
                                        <span>{this.props.data.secondLinkText}</span>
                                    </span>
                                )
                            }
						</LinkWrapper>
					</div>
				</ViewableMonitor>
			</div>
		);
	}
}

export default Module2FeaturedPageLinks;

export const query = graphql`
	fragment ContentfulModule2FeaturedPageLinksFragment on ContentfulModule2FeaturedPageLinks {
		id
		firstImage {
			gatsbyImageData(
        placeholder: NONE
        height: 328
        width: 500
        quality: 85
      )
		}
		secondImage {
			gatsbyImageData(
        placeholder: NONE
        height: 328
        width: 500
        quality: 85
      )
		}
		firstTitle
		firstDescription {
			firstDescription
		}
		firstLinkText
		firstLink
		secondTitle
		secondDescription {
			secondDescription
		}
		secondLinkText
		secondLink
	}
`;
