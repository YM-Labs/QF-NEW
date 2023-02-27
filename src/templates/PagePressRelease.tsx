import * as React from 'react';
import * as styles from './PageShared.module.scss';
import { PagePressReleaseQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import ModulesWrapper from '../components/ModulesWrapper';
import { Helmet } from 'react-helmet';
import { FormattedDate, injectIntl } from 'react-intl';
import UIShareButtons from '../ui/UIShareButtons';
import { GatsbyImageWrapper } from '../components/ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';

interface Props extends IPageProps {
	intl: null;
	data: PagePressReleaseQuery;
}

class PagePressRelease extends React.Component<Props> {
	render() {
		const pageData = this.props.data.contentfulPagePressRelease;
		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'press_release'} title={pageData.title} pageContext={this.props.pageContext}>
				<div className="container pagePaddingTop">
					{
						//@ts-ignore:
						<Helmet>
							<meta className="swiftype" name="preview_image" data-type="enum" content={pageData.heroImage && pageData.heroImage.file.url} />
							{pageData.filterEntity &&
								pageData.filterEntity.map((entity, index) => <meta key={index} className="swiftype" name="filter_entity" data-type="enum" content={entity.contentful_id} />)}
							{pageData.filterTags &&
								pageData.filterTags.map((entity, index) => <meta key={index} className="swiftype" name="filter_press_release_tags" data-type="enum" content={entity.contentful_id} />)}
							<meta className="swiftype" name="filter_date" data-type="date" content={pageData.date && pageData.date} />
							<meta className="swiftype" name="type" data-type="enum" content="press_release" />
						</Helmet>
					}
					<div className={styles.topSectionLeadIn}>
						<FormattedDate value={new Date(pageData.date)} month="long" day="numeric" year="numeric" />
					</div>
					<div className={styles.topSection}>
						<div className={`${styles.topSectionText}`}>
							<h1 className="text-style-h1-large">{pageData.title}</h1>
							<UIShareButtons url={this.props.pageContext.currSlug} title={pageData.title} />
						</div>
					</div>
					{pageData.heroImage && (
                        // @ts-ignore
						<GatsbyImageWrapper alt={this.props.title} outerWrapperClassName={`w-100 ${styles.heroImage}`} image={pageData.heroImage} />
					)}
					{pageData.modulesWrapper && (
						<ModulesWrapper
							languageCode={this.props.pageContext.languageCode}
							upcomingEventsData={this.props.pageContext.upcomingEvents}
							hasHeroImage={true}
							data={pageData.modulesWrapper}
						/>
					)}
				</div>
			</PageWrapper>
		);
	}
}

export default injectIntl(PagePressRelease);

export const pageQuery = graphql`
	query PagePressReleaseQuery($id: String, $languageCode: String) {
		contentfulPagePressRelease(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			slug
			title
			date
			filterTags {
				contentful_id
			}
			filterEntity {
				contentful_id
			}
			heroImage {
				file {
					url
				}
				gatsbyImageData(
                    placeholder: NONE
                    width: 1680
                    height: 700
                    quality: 85
                    layout: FULL_WIDTH
                  )
			}
			modulesWrapper {
				...ContentfulModuleWrapperFragment
			}
		}
	}
`;
