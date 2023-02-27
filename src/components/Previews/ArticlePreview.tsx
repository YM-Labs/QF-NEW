import * as React from 'react';
import { Component } from 'react';
import * as styles from './ArticlePreview.module.scss';
import { ContentfulPageArticlePreviewFragment } from '../../gatsby-queries';
// import { UIEventCategoryListing } from '../../ui/UIEventCategoryListing';
import { getPagePath } from '../../utils/URLHelper';
import GatsbyLink from 'gatsby-link';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';
import { FormattedMessage } from 'react-intl';

export class ArticlePreview extends Component<{ portraitMode?: boolean; className?: string; placeHolderImage?: any; data: ContentfulPageArticlePreviewFragment }> {

	render() {
		const previewImage = this.props.data.teaserImage ? this.props.data.teaserImage : this.props.data.heroImage;
        // @ts-ignore
		const articleImage = previewImage && <GatsbyImageWrapper alt={this.props.data.title} outerWrapperClassName={styles.imageWrapper} image={previewImage} />;
		// const articleCategory = <UIEventCategoryListing key={`category-${this.props.key}`} type={'Article'} filterVerticalCategory={this.props.data.filterVerticalCategory} className={styles.itemInfo} />
		let defaultClass = 'module-margin-small';
		if (this.props.portraitMode) {
			defaultClass = 'portraitMode';
		}
		return (
			<div className={`${defaultClass} ${styles.wrapper} ${this.props.data.contentful_id}`}>
				<GatsbyLink aria-label={this.props.data.title} to={getPagePath(this.props.data.slug, 'article')} className={`${styles.titleWrapper}`}>
					{articleImage}
					<h2 className={`text-style-h3 ${styles.title}`}>{this.props.data.title}</h2>
					{this.props.data.opEdCreditOptional &&
					(<div className={styles.creditsProfile}>{this.props.data.opEdCreditOptional.profilePhoto &&
                        // @ts-ignore
					    <GatsbyImageWrapper alt={this.props.data.opEdCreditOptional.profilePhoto.title} outerWrapperClassName={styles.creditImage} image={this.props.data.opEdCreditOptional.profilePhoto.thumb} />}
						<span>{this.props.data.opEdCreditOptional.name.name}</span>
					</div>)}
					{this.props.data.contentTypePreviewInfo &&
					<span className={styles.extraInfo + (this.props.data.contentType?.slug === 'video' ? ' ' + styles.video : '')}>{this.props.data.contentTypePreviewInfo}</span>}
				</GatsbyLink>
				{
					this.props.data.filterArticleTags && (
						<div className={styles.itemInfo}>
							<span className={styles.category}>{(this.props.data.contentType ? <a href={getPagePath(this.props.data.contentType?.slug, 'article')}>{this.props.data.contentType.title}</a> : <FormattedMessage id={'Article'} />)}</span><FormattedMessage id={'in'} />
							{this.props.data.filterArticleTags?.map((tag, index) => {
								return <a className={styles.tagLink} href={getPagePath(tag.slug, 'article')} key={index}>{tag.title}</a>;
							})}
						</div>
					)
				}
			</div>
		);
	}
}

export const query = graphql`
	fragment ContentfulPageArticlePreviewFragment on ContentfulPageArticle {
		contentful_id
		title
		date
		slug
		node_locale
		introductionText {
			introductionText
		}
		filterVerticalCategory {
			title
			slug
		}
		opEdCreditOptional {
			name {
				name
			}
			title {
				title
			}
			profilePhoto {
				title
				thumb: gatsbyImageData(
                    placeholder: NONE
                    width: 100
                    height: 100
                    quality: 85
                  )
			}
		}
		contentTypePreviewInfo
		contentType {
			title
			slug
		}
		filterArticleTags {
			title
			slug
		}
		heroImage {
			gatsbyImageData(placeholder: NONE, width: 960, quality: 85)
		}
		teaserImage {
			gatsbyImageData(placeholder: NONE, width: 475, quality: 85)
		}
	}
`;
