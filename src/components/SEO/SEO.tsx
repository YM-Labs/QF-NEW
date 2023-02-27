import * as React from 'react';
import { getPagePath } from '../../utils/URLHelper';
import { Helmet } from 'react-helmet';
import { graphql, StaticQuery } from 'gatsby';
import { SEOArticleJson, SEOEntityJson, SEOEventJson, SEOProgramJson } from './SEOJsonFormatters';
// @ts-ignore
import { seoQuery } from '../../gatsby-queries';

type propTypes = {
	data: any;
	metaData: seoQuery;
	page?: any;
	lang?: any;
};

class SEO extends React.Component<propTypes> {
	private contentfulImage(base: string) {
		return base + '?w=1200&h=630&q=85&fit=fill';
	}

	render() {
		const { title, description, image, heroImage, place, startDate, endDate, twitter, organiser, metaTitle, metaDescription } = this.props.data;
		const seo = {
			title: metaTitle ? metaTitle : title ? title : null,
			description: metaDescription ? metaDescription.metaDescription : description ? description.description : null,
			image: heroImage ? (heroImage ? this.contentfulImage(heroImage.file?.url) : null) : image ? this.contentfulImage(image.file?.url) : null,
			url: null,
			place: place ? place : null,
			startDate: startDate ? startDate : null,
			endDate: endDate ? endDate : null,
			twitter: twitter ? twitter : null
		};

		let json = undefined;
		const langkey = this.props.lang === 'en-US' ? 0 : 1;

		if (this.props.page == 'event') {
			if (organiser && organiser.length > 0) {
				seo.url = `${getPagePath(organiser[0].slug, this.props.page)}`;
			}
			json = SEOEventJson(this.props.data);
			// @ts-ignore
			seo.description = !seo.description ? this.props.metaData.allContentfulSitewideGlobalElements.edges[langkey].node.eventGenericMetaDescription.eventGenericMetaDescription : seo.description
		}
		if (this.props.page == 'persona') {
			// @ts-ignore
			seo.description = !seo.description ? this.props.metaData.allContentfulSitewideGlobalElements.edges[langkey].node.personaGenericMetaDescription.personaGenericMetaDescription : seo.description
		}
		if (this.props.page == 'entity') {
			this.props.data.url = `${getPagePath(this.props.data.entityUrl, this.props.page)}`;
			json = SEOEntityJson(this.props.data);
		}
		if (this.props.page == 'article') {
			seo.description = this.props.data.introductionText ? this.props.data.introductionText.introductionText : undefined;
			json = SEOArticleJson(this.props.data);
		}
		if (this.props.page == 'program') {
			json = SEOProgramJson(this.props.data);
		}
		if (this.props.page == 'press_release') {
			seo.description = !seo.description ? this.props.metaData.allContentfulSitewideGlobalElements.edges[langkey].node.pressReleaseGenericMetaDescription.pressReleaseGenericMetaDescription : seo.description
		}
		if (this.props.page == 'expert_profile') {
			seo.title = this.props.data.name
			seo.description = this.props.data.introductionText ? this.props.data.introductionText.introductionText : undefined;
			seo.image = this.contentfulImage(this.props.data.previewImage?.file?.url)
		}
		return (
			//@ts-ignore:
			<Helmet>
				{seo.description && <meta name="description" content={seo.description} />}
				{json && <script type="application/ld+json">{json}</script>}
				{seo.url && <meta property="og:url" content={seo.url} />}
				{json && this.props.page && <meta property="og:type" content={this.props.page} />}
				{seo.title && <meta property="og:title" content={seo.title} />}
				{seo.description && <meta property="og:description" content={seo.description} />}
				{seo.image && <meta property="og:image" content={seo.image} />}

				<meta name="twitter:card" content="summary_large_image" />
				{seo.twitter && <meta name="twitter:creator" content={seo.twitter} />}
				{seo.title && <meta name="twitter:title" content={seo.title} />}
				{seo.description && <meta name="twitter:description" content={seo.description} />}
				{seo.image && <meta name="twitter:image" content={'https:' + seo.image} />}
			</Helmet>
		);
	}
}

export default (props => (
	<StaticQuery
		query={graphql`
			query seoQuery {
				allContentfulSitewideGlobalElements(filter: { contentful_id: { eq: "5YUWjk2bAcOkMOWsGAoQk8" } }) {
					edges {
						node {
							eventGenericMetaDescription {
								eventGenericMetaDescription
							}
							personaGenericMetaDescription {
								personaGenericMetaDescription
							}
							pressReleaseGenericMetaDescription {
								pressReleaseGenericMetaDescription
							}
						}
					}
				}
			}
		`}
		// @ts-ignore
		render={data => <SEO metaData={data as seoQuery} {...props} />}
	/>
));