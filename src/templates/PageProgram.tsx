import * as React from 'react';
import * as styles from './PageShared.module.scss';
import { PageProgramQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import ModulesWrapper from '../components/ModulesWrapper';
import { TopSectionListInfo, TopSectionListItem } from '../ui/TopSectionListInfo';
import { Helmet } from 'react-helmet';
import GatsbyLink from 'gatsby-link';
import { getPagePath } from '../utils/URLHelper';
import { FormattedMessage } from 'react-intl';
import { GatsbyImageWrapper } from '../components/ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';

interface Props extends IPageProps {
	data: PageProgramQuery;
}

class PageProgram extends React.Component<Props> {
	render() {
		const pageData = this.props.data.contentfulPageProgram;
		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'program'} title={pageData.title} pageContext={this.props.pageContext}>
				<div className="container pagePaddingTop">
					{
						//@ts-ignore:
						<Helmet>
							<meta className="swiftype" name="type" data-type="enum" content="program" />
							<meta className="swiftype" name="preview_image" data-type="enum" content={pageData.heroImage.file.url} />
							<meta className="swiftype" name="filter_entity" data-type="enum" content={pageData.filterEntity.contentful_id} />
							<meta className="swiftype" name="filter_program_type" data-type="enum" content={pageData.filterProgramType.contentful_id} />
						</Helmet>
					}
					<div className={styles.topSection}>
						<div className={`col-md-6 col-xl-4 ${styles.topSectionText}`}>
							<h1 className="text-style-h1">{pageData.headline.headline}</h1>
							{pageData.websiteLink && (
								<a data-swiftype-index="false" className={`text-style-body ${styles.ctaLink}`} href={pageData.websiteLink.websiteLink}>
									<FormattedMessage id={'Go to website'} />
								</a>
							)}
						</div>
						<TopSectionListInfo>
							<TopSectionListItem
								label={<FormattedMessage id={'Offered at'} />}
								value={
									<GatsbyLink
										to={getPagePath(
											pageData.filterEntity.slug,
											'entity',
											pageData.filterEntity.filterVerticalCategory ? pageData.filterEntity.filterVerticalCategory.slug : undefined
										)}
									>
										{pageData.filterEntity.title}
									</GatsbyLink>
								}
							/>
							<TopSectionListItem label="Type" value={pageData.filterProgramType.title} />
						</TopSectionListInfo>
					</div>
                    {
                        // @ts-ignore
					    <GatsbyImageWrapper alt={this.props.title} outerWrapperClassName={`w-100 ${styles.heroImage}`} image={pageData.heroImage} />
                    }
					<ModulesWrapper languageCode={this.props.pageContext.languageCode} upcomingEventsData={this.props.pageContext.upcomingEvents} hasHeroImage={true} data={pageData.modulesWrapper} />
				</div>
			</PageWrapper>
		);
	}
}

export default PageProgram;

export const pageQuery = graphql`
	query PageProgramQuery($id: String, $languageCode: String) {
		contentfulPageProgram(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			slug
			title
			headline {
				headline
			}
			filterEntity {
				slug
				contentful_id
				title
				filterVerticalCategory {
					slug
				}
			}
			filterProgramType {
				contentful_id
				title
			}
			websiteLink {
				websiteLink
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
