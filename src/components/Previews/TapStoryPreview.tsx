import GatsbyLink from 'gatsby-link';
import * as React from 'react';
import { Component } from 'react';
import { graphql } from 'gatsby';
import { getPagePath } from '../../utils/URLHelper';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import * as styles from './TapStoryPreview.module.scss';


export class TapStoryPreview extends Component<{data: any, className: string, overview?: boolean, mode?: "related" | "overview" | "preview"}> {

	getPreviewImage(data) {
		if(!data) return
		let isMobile = false;
		if (typeof window !== `undefined`) {
			isMobile = window.innerWidth <= 768;
		}
		if(this.props.mode === "preview") {
			return data.preview
		} else if(this.props.mode === "overview") {
			return data.overview
		} else if(this.props.mode === "related") {
			if(isMobile) {
				return data.asRelatedMobile
			} else {
				return data.asRelatedDesktop
			}
		} else {
			return data.preview
		}
	}

	render() {

		const previewImage = this.getPreviewImage(this.props.data.teaserImage);
		const articleImage = previewImage && <GatsbyImageWrapper alt={previewImage.title} outerWrapperClassName={''} image={previewImage} />;

		return (
			<div className={` ${styles.wrapper} ${this.props.className}  ${this.props.mode === "related" ? styles.small : ''}`}>
				<GatsbyLink to={getPagePath(this.props.data.slug, 'tapStory')} className={`${styles.titleWrapper}`}>
					{articleImage}
					<h3 className={`text-style-h3 ${styles.title}`}>{this.props.data.title}</h3>
					{ (this.props.mode === "related") && <span className={styles.linkText}>Learn more</span> }

				</GatsbyLink>
				{(this.props.mode !== "related") && (
					<div className={styles.itemInfo}>
						{this.props.data.tags?.map((tag, index) => {
							return <span className={styles.tagLink} key={index}>{tag.title}</span>;
						})}
					</div>
				)}
			</div>
		)
	}
}


export const query = graphql`
	fragment ContentfulPageTapStoryPreviewFragment on ContentfulPageTapStory {
		contentful_id
		title
		date
		slug
		node_locale
		tags {
			title
			slug
		}
		teaserImage {
			preview: gatsbyImageData(placeholder: NONE, width: 350, height: 500, quality: 85)
			overview: gatsbyImageData(placeholder: NONE, width: 900, quality: 85)
			asRelatedDesktop: gatsbyImageData(placeholder: NONE, width: 360, height: 450, quality: 85)
			asRelatedMobile: gatsbyImageData(placeholder: NONE, width: 246, height: 192, quality: 85)
		}
	}
`;