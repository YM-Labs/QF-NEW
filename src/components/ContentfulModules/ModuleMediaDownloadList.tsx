import * as React from 'react';
import * as styles from './ModuleMediaDownloadList.module.scss';
import { Component } from 'react';
import { ContentfulModuleMediaDownloadListFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';
import { humanFileSize, humanFiletype } from '../../utils/StringUtils';

class ModuleMediaDownloadList extends Component<{ data: ContentfulModuleMediaDownloadListFragment }> {
	render() {
		return (
			<ViewableMonitor>
				<div className={`module-margin`}>
					<h2 tabIndex={0} className="text-style-category-headline">{this.props.data.title}</h2>
					<ul className={`module-margin-small ${styles.listWrapper}`}>
						{this.props.data.files.map(file => {
							return (
								<li className={styles.listItem} key={file.id}>
									<a className="text-style-body" href={file.file && file.file?.url} download target="_blank" rel="noopener noreferrer">
										<span className={styles.title}>{file.title}</span>
										<span></span>
										<span className={styles.fileSize}>{humanFiletype(file.file && file.file?.url)+" - " +humanFileSize(file.file && file.file?.details?.size, true)}</span>
									</a>
								</li>
							);
						})}
					</ul>
				</div>
			</ViewableMonitor>
		);
	}
}

export default ModuleMediaDownloadList;

export const query = graphql`
	fragment ContentfulModuleMediaDownloadListFragment on ContentfulModuleMediaDownloadList {
		id
		title
		files {
			id
			file {
				details {
					size
				}
				url
			}
			title
		}
	}
`;
