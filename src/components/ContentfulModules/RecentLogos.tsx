import { graphql, StaticQuery } from 'gatsby';
import { RecentLogosQuery } from '../../gatsby-queries';
import * as styles from './ModuleRecentMediaGalleriesLogos.module.scss';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import * as React from 'react';

export const RecentLogos = ({langKey}) => <StaticQuery
	query={graphql`
		query RecentLogosQuery {
			allContentfulLogo(limit: 8) {
				edges {
					node {
						id
						node_locale
						contentful_id
						title
						tags {
							title
							id
						}
						file {
							file {
								details {
									size
								}
								url
							}
						}
						preview {
							thumb: gatsbyImageData(
                                placeholder: NONE
                                width: 400
                                height: 240
                                quality: 85
                              )
						}
					}
				}
			}
		}
	  `}
	render={(data: RecentLogosQuery) => {
		return (
			<div className={`module-margin-small ${styles.imagesWrapper}`}>
				{data.allContentfulLogo.edges.filter(media => media.node.node_locale === langKey).map((media, index) => {
					return (
						<div key={media.node.id + index} className={styles.logo}>
                            {
                                // @ts-ignore
							    <GatsbyImageWrapper alt={media.node.title} image={media.node.preview?.thumb} />
                            }
						</div>
					);
				})}
			</div>
		);
	}
	}
/>;
