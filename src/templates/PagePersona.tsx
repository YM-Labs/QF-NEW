import * as React from 'react';
import * as styles from './PageShared.module.scss';
import { PagePersonaQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import ModulesWrapper from '../components/ModulesWrapper';
import { Helmet } from 'react-helmet';
import ViewableMonitor from '../components/ui/ViewableMonitor';
import { graphql } from 'gatsby';

interface Props extends IPageProps {
	data: PagePersonaQuery;
}

class PagePersona extends React.Component<Props> {
	render() {
		const pageData = this.props.data.contentfulPagePersona;
		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'persona'} title={pageData.name} pageContext={this.props.pageContext}>
				<div className="container pagePaddingTop">
					{
						//@ts-ignore:
						<Helmet>
							{
								//@ts-ignore
								<meta className="swiftype" name="type" data-type="enum" content= {pageData.mediaSpokespeople ? 'spokes_people' : 'people'} />							
							}
							<meta className="swiftype" name="preview_image" data-type="enum" content={pageData.previewImage && pageData.previewImage.file.url} />
							{pageData.filterDepartment &&
								pageData.filterDepartment.map((entity, index) => <meta key={index} className="swiftype" name="filter_department" data-type="enum" content={entity.contentful_id} />)}
							{pageData.filterProgramsOptional &&
								pageData.filterProgramsOptional.map((entity, index) => <meta key={index} className="swiftype" name="filter_program" data-type="enum" content={entity.contentful_id} />)}
							{pageData.filterEntity &&
								pageData.filterEntity.map((entity, index) => <meta key={index} className="swiftype" name="filter_entity" data-type="enum" content={entity.contentful_id} />)}
						</Helmet>
					}
					<div className={styles.topSection}>
						<div className={`col-md-6 col-xl-4 ${styles.topSectionText}`}>
							<h1 className="text-style-h1">{pageData.name}</h1>
						</div>
					</div>
					<ModulesWrapper languageCode={this.props.pageContext.languageCode} upcomingEventsData={this.props.pageContext.upcomingEvents} data={pageData.modulesWrapper}>
						<ViewableMonitor>
							<div className={`text-style-introduction text-style-markdown module-margin`}>
								<p data-swiftype-name="expertise" data-swiftype-type="string">
									{ 
										// @ts-ignore
										pageData.introductionText && pageData.introductionText.introductionText
									}
								</p>
							</div>
						</ViewableMonitor>
					</ModulesWrapper>
				</div>
			</PageWrapper>
		);
	}
}

export default PagePersona;

export const pageQuery = graphql`
	query PagePersonaQuery($id: String, $languageCode: String) {
		contentfulPagePersona(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			slug
			name
			introductionText {
				introductionText
			}
			filterProgramsOptional {
				contentful_id
			}
			filterEntity {
				contentful_id
			}
			filterDepartment {
				contentful_id
				title
			}
			previewImage {
				file {
					url
				}
			}
			modulesWrapper {
				...ContentfulModuleWrapperFragment
			}
			mediaSpokespeople
		}
	}
`;
