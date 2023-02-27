import { validURL } from '../../utils/URLHelper';
const BASE_URL = 'https://qf.org.qa';

export function SEOArticleJson(data: any) {
	const MAX_LENGTH = 200;
	let imageUrl = data.heroImage && data.heroImage.file.url;
	if (!validURL(imageUrl)) {
		imageUrl = 'https:' + imageUrl;
	}
	const description = data.modulesWrapper && data.modulesWrapper[0].modules[1].text ? data.modulesWrapper[0].modules[1].text.childMarkdownRemark.html : null;
	const filteredDescription = description
		? description.replace(/(<([^>]+)>)/gi, '').length > MAX_LENGTH
			? description.replace(/(<([^>]+)>)/gi, '').substring(0, MAX_LENGTH) + '...'
			: description.replace(/(<([^>]+)>)/gi, '')
		: null;
	const logo = BASE_URL + '/src/assets/svgs/qf_logo.svg';
	return JSON.stringify([
		{
			'@context': 'http://schema.org',
			'@type': 'NewsArticle',
			mainEntityOfPage: {
				'@type': 'WebPage',
				'@id': data.filterVerticalCategory?.title
			},
			headline: data.title,
			image: [imageUrl],
			datePublished: data.date,
			author: {
				'@type': 'Organization',
				name: 'Qatar Foundation'
			},
			publisher: {
				'@type': 'Organization',
				name: 'Qatar Foundation',
				logo: {
					'@type': 'ImageObject',
					url: logo
				}
			},
			description: filteredDescription
		}
	]);
}

export function SEOEntityJson(data: any) {
	return JSON.stringify([
		{
			'@context': 'http://schema.org',
			'@type': 'EducationalOrganization',
			'@id': data.entityUrl,
			name: data.title,
			image: [data.image],
			address: {
				'@type': 'PostalAddress',
				streetAddress: data.location ? data.location.placeName : null,
				addressLocality: data.location ? data.location.placeAddress : null,
				addressRegion: 'DOH',
				addressCountry: 'QR'
			},
			telephone: data.phone,
			email: data.email
		}
	]);
}
export function SEOProgramJson(data: any) {
	return JSON.stringify([
		{
			'@context': 'http://schema.org',
			'@type': 'Course',
			name: data.headline.headline,
			description: 'Program Description',
			provider: {
				'@type': 'Organization',
				name: data.filterEntity.title,
				sameAs: data.websiteLink.websiteLink
			}
		}
	]);
}
export function SEOEventJson(data: any) {
	let imageUrl = data.image ? data.image.file.url : null;
	if (!validURL(imageUrl)) {
		imageUrl = 'https:' + imageUrl;
	}
	return JSON.stringify([
		{
			'@context': 'http://schema.org',
			'@type': 'Event',
			name: data.title,
			startDate: data.startDate,
			location: {
				'@type': 'Place',
				name: data.place ? data.place.placeName : null,
				address: {
					'@type': 'PostalAddress',
					streetAddress: data.place ? data.place.placeName : null,
					addressLocality: data.place ? data.place.placeAddress : null,
					addressRegion: 'DOH',
					addressCountry: 'QR'
				}
			},
			image: {
				'@type': 'ImageObject',
				url: imageUrl
			},
			description: data.description.description,
			endDate: data.endDate
		}
	]);
}
