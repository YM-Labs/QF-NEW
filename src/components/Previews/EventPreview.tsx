import * as React from 'react';
import { Component } from 'react';
import * as styles from './EventPreview.module.scss';
import { ContentfulEventPreviewFragment } from '../../gatsby-queries';
import { UIEventDate } from '../../ui/UIEventDate';
import { UIEventCategoryListing } from '../../ui/UIEventCategoryListing';
import GatsbyLink from 'gatsby-link';
import { getPagePath } from '../../utils/URLHelper';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';
import { sanitizeUrl } from '../../utils/URLHelper';

export class EventPreview extends Component<{ className: string; data: ContentfulEventPreviewFragment; newLayout?:boolean; rangeDate?: boolean; languageCode?: string, compact?: boolean; }> {

    truncate(input) {
        var limit = this.props.compact ? 150 : 200
        if (input.length > limit) {
           return input.substring(0, limit) + '...';
        }
        return input;
    };

	render() {
        var dateObj = new Date();
        var month = dateObj.toLocaleDateString(this.props.languageCode, { month: 'short' });
        var date = ('0' + dateObj.getDate()).slice(-2);
        var year = dateObj.getFullYear();
		return (
            this.props.newLayout ? (
                <GatsbyLink to={getPagePath(sanitizeUrl(this.props.data.slug), 'event')} className={`module-margin-small ${styles.newLayout} ${this.props.className}`}>
                    <div className={styles.eventImage}>
                        {
                            // @ts-ignore
                            this.props.data.image && <GatsbyImageWrapper outerWrapperClassName={styles.imageWrapper} alt={this.props.data.title} image={this.props.data.image} />
                        }
                        {
                            this.props.rangeDate ? (
                                //@ts-ignore:
                                <UIEventDate startDate={this.props.data.startDate} endDate={this.props.data.endDate} type={this.props.data.__typename} className={styles.date} newFormat={true} />
                            ) : (
                                <div className={styles.eventDateWrapper}>
                                    <div className={styles.eventMonth}>
                                        { month }
                                    </div>
                                    <div className={styles.eventDate}>
                                        { date }
                                    </div>
                                    <div className={styles.eventYear}>
                                        { year }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <h3 className={`text-style-h3 ${styles.title}`}>{this.props.data.title}</h3>
                    <UIEventCategoryListing type={this.props.data.type} filterVerticalCategory={this.props.data.filterVerticalCategory} className={styles.itemInfo} />
                    <div className={styles.eventDescription}>
                        {
                            // @ts-ignore
                            this.props.data.description?.childMarkdownRemark && (
                                // @ts-ignore
                                <div className={`text-style-body`} dangerouslySetInnerHTML={{ __html: this.truncate(this.props.data.description.childMarkdownRemark.html) }} />
                            )
                        }
                    </div>
                </GatsbyLink>
            ) : (
                <GatsbyLink to={getPagePath(sanitizeUrl(this.props.data.slug), 'event')} className={`module-margin-small ${styles.wrapper} ${this.props.className}`}>
                    <div className={`text-style-h2`}>
                        <UIEventCategoryListing type={this.props.data.type} filterVerticalCategory={this.props.data.filterVerticalCategory} className={styles.itemInfo} />
                        { 
                            //@ts-ignore:
                            <UIEventDate startDate={this.props.data.startDate} endDate={this.props.data.endDate} type={this.props.data.__typename} className={styles.date} />
                        }
                        <h3 className={`text-style-h3 ${styles.title}`}>{this.props.data.title}</h3>
                        {
                            // @ts-ignore
                            this.props.data.image && <GatsbyImageWrapper outerWrapperClassName={styles.imageWrapper} alt={this.props.data.title} image={this.props.data.image} />
                        }
                    </div>
                </GatsbyLink>
            )
		);
	}
}

export const query = graphql`
	fragment ContentfulEventPreviewFragment on ContentfulEvent {
		contentful_id
		title
		startDate
		endDate
		slug
        description {
            childMarkdownRemark {
				html
			}
        }
		filterVerticalCategory {
			title
		}
		type {
			typeName
		}
		image {
			gatsbyImageData(placeholder: NONE, width: 400, quality: 85)
		}
	}
`;
