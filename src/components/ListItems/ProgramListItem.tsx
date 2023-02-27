import * as React from 'react';
import { Component } from 'react';
import * as styles from './ProgramListItem.module.scss';
import GatsbyLink from 'gatsby-link';
import { sanitizeUrl } from '../../utils/URLHelper';

export class ProgramListItem extends Component<{
	degree: string;
	url: string;
	title: string;
	school: string;
	visible: boolean;
}> {
	render() {
		return (
			<li className={styles.listItem + (!this.props.visible ? ' ' + styles.hidden : '')}>
				<GatsbyLink className="text-style-body" to={sanitizeUrl(this.props.url)}>
					<div className={styles.firstColumn}>
						{this.props.title && <span>{this.props.title}</span>}
						{this.props.school && <span className={styles.school}>{this.props.school}</span>}
					</div>
					<span className={styles.titleWrapper}>
						<span className={styles.degree}>{this.props.degree}</span>
					</span>
				</GatsbyLink>
			</li>
		);
	}
}
