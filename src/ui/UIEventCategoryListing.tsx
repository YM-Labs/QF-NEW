import * as React from 'react';

import * as styles from './UIEventCategoryListing.module.scss';
import { FormattedMessage } from 'react-intl';

export function UIEventCategoryListing(props: { type: string | { typeName?: string }; filterVerticalCategory?: string | { title?: string }; className?: string }) {
	return (
		<div className={styles.itemInfo + ' ' + props.className}>
			{props.type && <span className={styles.category}>{typeof props.type === 'string' ? <FormattedMessage id={props.type} /> : props.type.typeName}</span>}
			{props.filterVerticalCategory && <FormattedMessage id="in" />}
			{props.filterVerticalCategory && <FormattedMessage id={typeof props.filterVerticalCategory === 'string' ? props.filterVerticalCategory : props.filterVerticalCategory.title} />}
		</div>
	);
}
