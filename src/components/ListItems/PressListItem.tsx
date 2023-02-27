import * as React from 'react';
import { Component } from 'react';
import * as styles from './PressListItem.module.scss';
import GatsbyLink from 'gatsby-link';
import { UIEventDate } from '../../ui/UIEventDate';
import { sanitizeUrl } from '../../utils/URLHelper';

export class PressListItem extends Component<{
	date: string;
	url: string;
	title: string;
	media?: string;
	isArabic?: boolean;
}> {
	render() {
		return (
			<li className={styles.listItem}>
				{!this.props.media ? (
					<GatsbyLink className={`${!this.props.isArabic ? 'text-style-body' : null}`} to={`${sanitizeUrl(this.props.url)}`}>
						<div className={styles.dateWrapper}>
							<UIEventDate startDate={this.props.date} endDate={this.props.date} className={styles.date} />
							{this.props.media && <span>{this.props.media}</span>}
						</div>
						<span className={`${this.props.isArabic ? 'rtl' : 'ltr'} ${styles.titleWrapper}`}>
							<span className={`${styles.title}`}>{this.props.title}</span>
						</span>
					</GatsbyLink>
				) : (
					<a className={`${!this.props.isArabic ? 'text-style-body' : null}`} href={`${this.props.url}`} target="_blank">
						<div className={styles.dateWrapper}>
							<UIEventDate startDate={this.props.date} endDate={this.props.date} className={styles.date} />
							{this.props.media && <span>{this.props.media}</span>}
						</div>
						<span className={`${this.props.isArabic ? 'rtl' : 'ltr'} ${styles.titleWrapper}`}>
							<span className={`${styles.title}`}>{this.props.title}</span>
						</span>
					</a>
				)}
			</li>
		);
	}
}
