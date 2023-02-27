import * as React from 'react';
import * as styles from './PageShared.module.scss';
import { PageMediaGalleryQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import { Helmet } from 'react-helmet';
import { FormattedDate, injectIntl } from 'react-intl';
import { graphql } from 'gatsby';
import MediaGallery from '../components/ContentfulModules/MediaGallery';

interface Props extends IPageProps {
	intl: null;
	data: PageMediaGalleryQuery;
}

class PageMediaGallery extends React.Component<Props> {
	render() {
		const pageData = this.props.data.contentfulMediaGallery;
		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'media_gallery'} title={pageData.mediaGalleryTitle.mediaGalleryTitle} pageContext={this.props.pageContext}>
				<div className="container pagePaddingTop">
					{
						//@ts-ignore:
						<Helmet>
							{pageData.filterTags &&
							pageData.filterTags.map((entity, index) => <meta key={index} className="swiftype" name="filter_media_gallery" data-type="enum" content={entity.contentful_id} />)}
							<meta className="swiftype" name="filter_date" data-type="date" content={pageData.date && pageData.date} />
							<meta className="swiftype" name="type" data-type="enum" content="page" />
						</Helmet>
					}
					<div className={styles.topSectionLeadIn}>
						<FormattedDate value={new Date(pageData.date)} month="long" day="numeric" year="numeric" />
					</div>
					<div className={styles.topSection}>
						<div className={`${styles.topSectionText}`}>
							<h1 className="text-style-h1-large">{pageData.mediaGalleryTitle.mediaGalleryTitle}</h1>
						</div>
					</div>
					<MediaGallery data={this.props.data.contentfulMediaGallery} inPage={true} />
{/*					{pageData.modulesWrapper && (
						<ModulesWrapper
							languageCode={this.props.pageContext.languageCode}
							upcomingEventsData={this.props.pageContext.upcomingEvents}
							hasHeroImage={true}
							data={pageData.modulesWrapper}
						/>
					)}*/}
				</div>
			</PageWrapper>
		);
	}
}

export default injectIntl(PageMediaGallery);

export const pageQuery = graphql`
	query PageMediaGalleryQuery($id: String, $languageCode: String) {
		contentfulMediaGallery(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			slug
			filterTags {
				contentful_id
			}
			...ContentfulMediaGalleryFragment
		}
	}
`;
