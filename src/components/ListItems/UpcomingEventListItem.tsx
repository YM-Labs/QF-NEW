import * as React from 'react';
import { Component } from 'react';
import * as styles from './UpcomingEventListItem.module.scss';
import GatsbyLink from 'gatsby-link';
import { UIEventDate } from '../../ui/UIEventDate';
import { UIEventCategoryListing } from '../../ui/UIEventCategoryListing';
import { Page } from '../../utils/SwiftypeAPI';
import { PageSearchQuery_allContentfulEventType } from '../../gatsby-queries';
import { sanitizeUrl } from '../../utils/URLHelper';

interface UpcomingEventListItemData {
	endDate: string;
	filterVerticalCategory?: string;
	slug: string;
	startDate: string;
	title: string;
	typeName: string;
}

export class UpcomingEventListItem extends Component<{ data: UpcomingEventListItemData | Page; typeList?: PageSearchQuery_allContentfulEventType }> {
	render() {
		let link = '';
		let startDate = '';
		let endDate = '';
		let type = '';
		let category = '';
		if ('url' in this.props.data) {
			// Render as search result:
			link = this.props.data.url.replace(window.location.origin, '');
			startDate = this.props.data.filter_start_date;
			endDate = this.props.data.filter_end_date;
			let foundType = this.props.typeList.edges.find(edge => edge.node.contentful_id === (this.props.data as Page).filter_event_type);
			type = foundType ? foundType.node.title : '';
			category = this.props.data.tags_vertical;
		} else {
			link = this.props.data.slug;
			startDate = this.props.data.startDate;
			endDate = this.props.data.endDate;
			type = this.props.data.typeName;
			category = this.props.data.filterVerticalCategory;
		}
		return (
			<li className={styles.listItem}>
				<GatsbyLink className="text-style-body" to={sanitizeUrl(link)}>
					<UIEventDate startDate={startDate} endDate={endDate} className={styles.date} />
					<span className={styles.titleWrapper}>
						<UIEventCategoryListing type={type} filterVerticalCategory={category} />
						<span className={styles.title}>{this.props.data.title}</span>
					</span>
				</GatsbyLink>
			</li>
		);
	}
}
