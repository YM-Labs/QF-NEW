import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleRecentMediaGalleriesLogos.module.scss';
import { ContentfulModuleRecentMediaGalleriesLogosFragment, RecentMediaGalleriesQuery } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql, StaticQuery } from 'gatsby';
import { getPagePath } from '../../utils/URLHelper';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { FormattedDate } from 'react-intl';
import { RecentLogos } from './RecentLogos';
import { Globals } from '../../utils/Globals';

const initialState = { activeIndex: -1, open: false };
type State = Readonly<typeof initialState>;

class ModuleRecentMediaGalleriesLogos extends Component<{ data: ContentfulModuleRecentMediaGalleriesLogosFragment }, State> {
	render() {
		const langKey = Globals.CURRENT_LANGUAGE_PREFIX === 'ar/' ? 'ar-QA' : 'en-US';
		return (
			<ViewableMonitor>
				<div className={`module-margin`}>
					{this.props.data.mediaToShow[0] === 'Latest media galleries' && <StaticQuery
						query={graphql`
							query RecentMediaGalleriesQuery {
								allContentfulMediaGallery(filter: { slug: { ne: "workaround-do-not-delete" }}, sort: { order: DESC, fields: [date] }, limit: 8) {
									edges {
										node {
											id
											node_locale
											contentful_id
											mediaGalleryTitle {
												mediaGalleryTitle
											}
											filterTags {
												title
												id
											}
											medias {
												file {
													details {
														size
														image {
															width
															height
														}
													}
													url
												}
												thumb: gatsbyImageData(
                                                    placeholder: NONE
                                                    width: 400
                                                    height: 300
                                                    quality: 85
                                                  )
											}
											date
											slug
										}
									}
								}
							}
						  `}
						render={(data: RecentMediaGalleriesQuery) => {
							return (
								<div className={`module-margin-small ${styles.imagesWrapper}`}>
									{data.allContentfulMediaGallery.edges.filter(media => media.node.node_locale === langKey).map((media, index) => {
										const dateItem = new Date(media.node.date);
										return (
											<a href={getPagePath(media.node.slug, 'mediaGallery')} key={media.node.id + index}>
                                                {
                                                    // @ts-ignore
												    <GatsbyImageWrapper alt={media.node.mediaGalleryTitle.mediaGalleryTitle} image={media.node.medias[0].thumb} />
                                                }
												<div className={styles.infoWrapper}>
													<span className={styles.title}>{media.node.mediaGalleryTitle.mediaGalleryTitle}</span>
													<span>{dateItem.getDate()} <FormattedDate value={dateItem} month="short" /> {dateItem.getFullYear()}</span>
												</div>
											</a>
										);
									})}
								</div>
							);
						}
						}
					/>}
					{this.props.data.mediaToShow[0] === 'Most recent logos' && <RecentLogos langKey={langKey} />}
				</div>
			</ViewableMonitor>
		);
	}
}

export default ModuleRecentMediaGalleriesLogos;

export const query = graphql`
	fragment ContentfulModuleRecentMediaGalleriesLogosFragment on ContentfulModuleRecentMediaGalleriesLogos {
		id
		mediaToShow
	}
`;
