import * as React from 'react';

import * as styles from './ModuleDynamicList.module.scss';
import ViewableMonitor from './ui/ViewableMonitor';

export class ModuleDynamicList extends React.Component<{ title: JSX.Element | string; count: number; position?: number }> {
	public render() {
		return (
			<ViewableMonitor>
				<div className={`module-margin`} id='dynamic-module'>
					<div>
						<h2 tabIndex={0} className="text-style-category-headline">{this.props.title}</h2>
					</div>
					<div className={'module-margin-small ' + styles.itemsWrapper + ' ' + !this.props.title && styles.noTopBorder}>{this.props.children}</div>
				</div>
			</ViewableMonitor>
		);
	}
}
