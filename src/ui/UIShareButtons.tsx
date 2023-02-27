import * as React from 'react';

import * as styles from './UIShareButtons.module.scss';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { BASE_URL } from '../utils/Constants';

class UIShareButtons extends React.Component<{ url: string; title: string, color?: string, className?: string } & WrappedComponentProps> {
	public render() {
		const urlEncoded = encodeURIComponent(BASE_URL + this.props.url);
		const title = encodeURIComponent(this.props.title);
		return (
			<div className={`${this.props.color === 'white' && 'shareDarkBg'} ${this.props.className} ${styles.wrapper}`}>
				<span className={styles.icon} />
				<span className={styles.label}>{this.props.intl.formatMessage({ id: 'Share' })}</span>
				<div className={styles.links}>
					<a
						target="_blank"
						title={title}
						href={`https://twitter.com/intent/tweet?text=${urlEncoded}%20-%20${title}`}
						dangerouslySetInnerHTML={{
							__html: `<svg width="16" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M16 1.66c-.45.72-1 1.33-1.64 1.83v.46a10.76 10.76 0 0 1-3.43 7.86 8.2 8.2 0 0 1-2.62 1.6 8.97 8.97 0 0 1-8.31-1 6.13 6.13 0 0 0 4.86-1.47 3.05 3.05 0 0 1-1.9-.7A3.46 3.46 0 0 1 1.8 8.5a3.16 3.16 0 0 0 1.48-.07A3.2 3.2 0 0 1 1.4 7.21C.9 6.57.65 5.81.65 4.97v-.05c.46.28.95.43 1.48.45A3.65 3.65 0 0 1 .67 2.43c0-.64.15-1.24.45-1.78a9.47 9.47 0 0 0 2.99 2.6 8.63 8.63 0 0 0 3.77 1.1 4.22 4.22 0 0 1-.08-.82c0-.97.32-1.8.96-2.5A3.05 3.05 0 0 1 11.08 0c.94 0 1.74.37 2.4 1.12a6.16 6.16 0 0 0 2.07-.86 3.4 3.4 0 0 1-1.44 1.95A6.17 6.17 0 0 0 16 1.66z" fill-rule="evenodd"/></svg>`
						}}
					/>
					<a
						target="_blank"
						title={title}
						href={`https://www.facebook.com/sharer/sharer.php?u=${urlEncoded}`}
						dangerouslySetInnerHTML={{
							__html: `<svg width="8" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M8 .12v2.53H6.55c-.53 0-.9.12-1.08.35-.18.23-.28.58-.28 1.04v1.82h2.72L7.55 8.7H5.19V16H2.36V8.7H0V5.86h2.36v-2.1c0-1.2.32-2.12.96-2.77C3.97.33 4.82 0 5.9 0 6.79 0 7.5.04 8 .12z" fill-rule="evenodd"/></svg>`
						}}
					/>
					<a
						target="_blank"
						title={title}
						href={`https://www.linkedin.com/shareArticle?mini=true&url=${urlEncoded}&title=${title}`}
						dangerouslySetInnerHTML={{
							__html: `<svg width="15" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M3.4 4.87V15H.2V4.87H3.4zm.21-3.12c.01.5-.15.91-.49 1.24-.34.34-.78.5-1.32.5h-.02C1.24 3.5.8 3.33.48 3A1.71 1.71 0 0 1 0 1.75C0 1.25.17.83.5.5.84.17 1.28 0 1.82 0s.97.17 1.3.5c.32.33.49.74.5 1.25zM15 9.2V15h-3.21V9.58c0-.71-.13-1.27-.4-1.68-.26-.4-.67-.6-1.23-.6-.41 0-.76.11-1.03.35-.28.23-.49.52-.62.87-.08.2-.11.48-.11.83V15H5.19a1439.73 1439.73 0 0 0 0-9.64v-.49h3.2v1.48h-.01a4.44 4.44 0 0 1 .95-1.1c.23-.2.52-.35.85-.45.34-.1.7-.16 1.12-.16 1.11 0 2 .39 2.68 1.16.68.77 1.02 1.9 1.02 3.4z" fill-rule="evenodd"/></svg>`
						}}
					/>
				</div>
			</div>
		);
	}
}

export default injectIntl(UIShareButtons);
