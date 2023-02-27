import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleBulletPointList.module.scss';
import { ContentfulModuleBulletPointListFragment, ContentfulModuleBulletPointListFragment_bulletPointItems } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';


class ModuleItemBulletPointItem extends Component<{ data: ContentfulModuleBulletPointListFragment_bulletPointItems }> {

	render() {
		return (
			<li className={`${styles.listItem}`} key={this.props.data.id}>
				{this.props.data.bodyText.bodyText}
			</li>
		);
	}
}

class ModuleBulletPointList extends Component<{ data: ContentfulModuleBulletPointListFragment }> {
	render() {
		return (
			<ViewableMonitor>
				<div className={`module-margin`}>
					<div className={`${styles.wrapperInner} ${this.props.data.useNumbersIndicator ? styles.withNumbers : ''}`}>
						{this.props.data.listTitle && (
							<p className={styles.listTitle}>{this.props.data.listTitle.listTitle}</p>
						)}
						<ul className={`${styles.listWrapper}`}>
							{this.props.data.bulletPointItems?.map(item => (
								<ModuleItemBulletPointItem key={item.id} data={item} />
							))}
						</ul>
					</div>
				</div>
			</ViewableMonitor>
		);
	}
}

export default ModuleBulletPointList;

export const query = graphql`
	fragment ContentfulModuleBulletPointListFragment on ContentfulModuleBulletPointList {
		id
		listTitle {
			listTitle
		}
		useNumbersIndicator
		bulletPointItems {
			id
			bodyText {
				bodyText
			}
		}
	}
`;
