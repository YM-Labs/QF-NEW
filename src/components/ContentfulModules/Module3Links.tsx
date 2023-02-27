import * as React from 'react';
import { Component } from 'react';
import * as styles from './Module3Links.module.scss';
import ViewableMonitor from '../ui/ViewableMonitor';
// @ts-ignore
import { module3LinksQuery } from '../gatsby-queries';
import { graphql, StaticQuery } from 'gatsby';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { FormattedMessage } from 'react-intl';
import { getPagePath } from '../../utils/URLHelper';

class Module3Links extends Component<{ module3Images: module3LinksQuery; }> {
	render() {
		return (
			<div className={'container no-gutters'}>
				<div className={`module-margin ${styles.wrapper}`}>
					<ViewableMonitor>
						<a className={styles.imageWrapper} href={getPagePath('', 'education')}>
								{
									// @ts-ignore
									<GatsbyImageWrapper alt={this.props.module3Images.allContentfulAsset.edges[1]?.node.title} image={this.props.module3Images.allContentfulAsset.edges[1]?.node} />
                                }
							<div className={styles.verticalTitle}>
								<h1 className={'text-style-h3'}><FormattedMessage id={'education_teaser'} /></h1>
							</div>
						
						</a>
					</ViewableMonitor>
					<ViewableMonitor>
						<a className={styles.imageWrapper} href={getPagePath('', 'research')}>
		
							{
								// @ts-ignore
								<GatsbyImageWrapper alt={this.props.module3Images.allContentfulAsset.edges[2]?.node.title} image={this.props.module3Images.allContentfulAsset.edges[2]?.node} />
							}
						
							<div className={styles.verticalTitle}>
								<h1 className={'text-style-h3'}><FormattedMessage id={'research_teaser'} /></h1>
							</div>
						
						</a>
					</ViewableMonitor>
					<ViewableMonitor>
						<a className={styles.imageWrapper} href={getPagePath('', 'community')}>
								{
									// @ts-ignore
									<GatsbyImageWrapper alt={this.props.module3Images.allContentfulAsset.edges[0]?.node.title} image={this.props.module3Images.allContentfulAsset.edges[0]?.node} />
                                }
							
							<div className={styles.verticalTitle}>
								<h1 className={'text-style-h3'}><FormattedMessage id={'community_teaser'} /></h1>
							</div>
						
						</a>
					</ViewableMonitor>
				</div>
			</div>
			
		);
	}
}

export default props => (
    <StaticQuery
            query={graphql`
                query module3LinksQuery {
                    allContentfulAsset( filter: { title: {in: [ "qfeducation_v3", "qfresearch_v3", "qfcommunity" ]}, node_locale: { eq: "en-US" } } ) {
						edges {
                            node {
								title
								gatsbyImageData(placeholder: NONE, layout: FULL_WIDTH)
                            }
                        }
                    }
                }
    `}
	// @ts-ignore
    render={data => <Module3Links module3Images={data as module3LinksQuery} {...props} />}
    />
);
