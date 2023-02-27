import * as React from 'react';
import { Component } from 'react';
import * as styles from './ECSSPreview.module.scss';
// @ts-ignore
import { ContentfulEcssPreviewFragment, PageEducationCitySpeakerSeriesQuery } from '../../gatsby-queries';
import { getPagePath } from '../../utils/URLHelper';
import GatsbyLink from 'gatsby-link';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';
import { FormattedMessage } from 'react-intl';
import { UIEventDate } from '../../ui/UIEventDate';

export class ECSSPreview extends Component<{ portraitMode?: boolean; listMode?: boolean; className?: string; itemsClass?: string; placeHolderImage?: any; data: ContentfulEcssPreviewFragment, filterData?: PageEducationCitySpeakerSeriesQuery; imageBasePath?: string; }> {

	render() {
        // @ts-ignore
		const ecssImage = this.props.data.image && <GatsbyImageWrapper alt={this.props.data.image && this.props.data.image.title} outerWrapperClassName={styles.imageWrapper} image={this.props.data.image} />;
		let defaultClass = 'module-margin-small';
		if (this.props.portraitMode) {
			defaultClass = 'portraitMode';
		}
		if(this.props.listMode) {
            // @ts-ignore
            let expertSubjects = Array.isArray(this.props.data.filter_ecss_tags) ? this.props.data.filter_ecss_tags : [this.props.data.filter_ecss_tags];
            // @ts-ignore
            expertSubjects = [...new Set(expertSubjects)];
            // @ts-ignore
            const subjectsString = expertSubjects && (expertSubjects as string[]).map(value => this.props.filterData?.allContentfulFilterEcssTag?.edges.find((edge => {
                if (edge.node.contentful_id === value) {
                    return true;
                }
            }))).map(edge => edge?.node.title);

            return (
                <div className={`${styles.listMode}`}>
                    <div className={`${styles.dateWrapper}`}>
                        { 
                            //@ts-ignore:
                            <UIEventDate startDate={this.props.data.filter_start_date} endDate={this.props.data.filter_end_date} type={'ecss'} className={styles.date} />
                        }
                    </div>
                    <div className={`${styles.infoWrapper}`}>
                        <div className={styles.info}>
                            {
                                //@ts-ignore:
                                <a href={this.props.data.url} className={`${styles.titleWrapper}`}>
                                    <h3 className={`text-style-h3 ${styles.title}`}>{this.props.data.title}</h3>
                                </a>
                            }
                            {
                                // @ts-ignore
                                <div className={`text-style-description ${styles.description}`} dangerouslySetInnerHTML={{ __html: this.props.data.body[0] }} />
                            }
                            <div className={styles.tags}>
                                {!subjectsString.includes(undefined) && subjectsString.join('   |   ')}
                            </div>
                        </div>
                        <div className={styles.image}>
                            <GatsbyImageWrapper
                                image={{
                                layout: 'fullWidth',
                                images: {
                                    sources: [
                                    {
                                        sizes: "100vw",
                                        // @ts-ignore
                                        srcSet: `${this.props.imageBasePath}`,
                                        type: "image/jpg",
                                    },
                                    ],
                                },
                                width: 300,
                                height: 316,
                                }}
                                // @ts-ignore
                                alt={this.props.data.ecssImage?.title}
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={`${defaultClass} ${styles.wrapper} ${this.props.itemsClass} ${this.props.data.contentful_id}`}>
                    <GatsbyLink to={getPagePath(this.props.data.slug, 'ecss')} className={`${styles.titleWrapper}`}>
                        {ecssImage}
                        <h3 className={`text-style-h3 ${styles.title}`}>{this.props.data.title}</h3>
                    </GatsbyLink>
                    <div className={styles.itemInfo}>
                        <span className={styles.category}>{<FormattedMessage id={'Video'} />}</span><FormattedMessage id={'in'} />
                        {this.props.data.ecssTag?.map((tag, index) => {
                            return <a className={styles.tagLink} href={getPagePath(tag.slug, 'ecss')} key={index}>{tag.title}</a>;
                        })}
                    </div>
                </div>
            );
        }
	}
}

export const query = graphql`
	fragment ContentfulEcssPreviewFragment on ContentfulEcss {
		contentful_id
		title
		startDate
		endDate
		slug
		ecssTag {
			title
			slug
		}
		ecssImage {
            title
			gatsbyImageData(placeholder: NONE, width: 960, quality: 85)
            file {
                url
            }
		}
	}
`;
