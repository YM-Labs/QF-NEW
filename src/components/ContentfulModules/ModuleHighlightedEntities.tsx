import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleHighlightedEntities.module.scss';
import { ContentfulModuleHighlightedEntitiesFragment } from '../../gatsby-queries';
import { EntryPreview } from '../Previews/EntryPreview';
import ScrollList from '../ScrollList';
import { getPagePath } from '../../utils/URLHelper';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

export default class ModuleHighlightedEntities extends Component<{ data: ContentfulModuleHighlightedEntitiesFragment; animationDirection: 1 | -1 }> {
	render() {
		return (
			<div className={`module-margin ${styles.wrapper}`}>
				<ScrollList showPaginator={true} animationDirection={this.props.animationDirection} listClassName={'module-margin-small'} className={''}>
					{this.props.data.highlightedEntities.map((item, index) => {
						// @ts-ignore
						const type = item.__typename === 'ContentfulEntities' ? (item.type && item.type.length > 0 ? item.type[0] : undefined) : 'place';
						// @ts-ignore
						const description = item.__typename === 'ContentfulEntities'
								// @ts-ignore
								? item.entityDescription ? item.entityDescription.entityDescription : undefined
								// @ts-ignore
								: item.subtitle ? item.subtitle.subtitle : undefined;
						return (
							<ViewableMonitor disabled={index > 2} key={index} delay={index + 1}>
								<EntryPreview
									url={getPagePath(item.slug, 'entity', item.filterVerticalCategory ? item.filterVerticalCategory.slug : undefined)}
									title={item.title}
									description={description}
									category={type}
									vertical={item.filterVerticalCategory ? item.filterVerticalCategory.title : undefined}
									imageBasePath={item.teaserImage ? item.teaserImage.file.url : item.heroImage ? item.heroImage.file.url : undefined}
								/>
							</ViewableMonitor>
						);
					})}
				</ScrollList>
			</div>
		);
	}
}

export const query = graphql`
	fragment ContentfulModuleHighlightedEntitiesFragment on ContentfulModuleHighlightedEntities {
		id
		highlightedEntities {
			__typename
			... on ContentfulEntities {
				title
				slug
				type
				filterVerticalCategory {
					title
					slug
				}
				entityDescription {
					entityDescription
				}
				heroImage {
					file {
						url
					}
				}
				teaserImage {
					file {
						url
					}
				}
			}
			... on ContentfulPagePlace {
				title
				slug
				filterVerticalCategory {
					title
					slug
				}
				subtitle {
					subtitle
				}
				heroImage {
					file {
						url
					}
				}
				teaserImage {
					file {
						url
					}
				}
			}
		}
	}
`;
