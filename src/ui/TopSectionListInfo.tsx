import * as React from 'react';
import * as styles from './TopSectionListInfo.module.scss';

export class TopSectionListInfo extends React.Component<{ className?: string }> {
	render() {
		return <ul className={styles.list + ' ' + this.props.className}>{this.props.children}</ul>;
	}
}

export function TopSectionListItem(props: { label: JSX.Element | string; value: JSX.Element | string, isMainMenu?: boolean }) {
	return (
		<li tabIndex={0} className={'text-style-body ' + styles.listItem}>
			{typeof props.label === 'string' && <span data-swiftype-index="false" className={styles.label} dangerouslySetInnerHTML={{ __html: props.label }} />}
			{typeof props.label !== 'string' && (
				<span data-swiftype-index="false" className={`${styles.label} ${props.isMainMenu && styles.labelMenu}`}>
					{props.label}
				</span>
			)}
			{typeof props.value === 'string' && <span className={styles.value} dangerouslySetInnerHTML={{ __html: props.value }} />}
			{typeof props.value !== 'string' && props.value}
		</li>
	);
}
