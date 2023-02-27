import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleMediaList.module.scss';
import { ContentfulModuleMediaListFragment, ContentfulModuleMediaListFragment_items } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

const initialState = { open: false };
type State = Readonly<typeof initialState>;

var isAbsoluteUrl = new RegExp('^(?:[a-z]+:)?//', 'i');

function humanFileSize(bytes, si) {
	var thresh = si ? 1000 : 1024;
	if (Math.abs(bytes) < thresh) {
		return bytes + ' B';
	}
	var units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	var u = -1;
	do {
		bytes /= thresh;
		++u;
	} while (Math.abs(bytes) >= thresh && u < units.length - 1);
	return bytes.toFixed(1) + ' ' + units[u];
}

function humanFiletype(url) {
	var theresult = url && url.split(/\#|\?/)[0].split('.').pop().trim();
	return theresult && theresult.toUpperCase();
}

class MediaListItem extends Component<{ data: ContentfulModuleMediaListFragment_items }, State> {
	readonly state: State = initialState;

	render() {

		var gotoUrl = null
		if(this.props.data.fileUrl) {
			gotoUrl = this.props.data.fileUrl.file.url
		} else {
			gotoUrl = this.props.data.link
		}

		return (
			<li className={styles.listItem} key={this.props.data.id}>
				{
					// @ts-ignore
					<div className={`text-style-body ${styles.list}`}>
						<span className={styles.title}>
							{this.props.data.title}
							<div className={styles.description}>
								<div dangerouslySetInnerHTML={{ __html: this.props.data.description && this.props.data.description.description }} />
							</div>
						</span>
						<span className={styles.sizeInfo}>{ this.props.data.fileUrl && (humanFiletype(this.props.data.fileUrl && this.props.data.fileUrl.file.url)+" - " +humanFileSize(this.props.data.fileUrl && this.props.data.fileUrl.file.details.size, true)) }</span>
						{
                            gotoUrl && 
                            (
                                <a href={gotoUrl} aria-label={this.props.data.title} target={this.props.data.link && isAbsoluteUrl.test(this.props.data.link) ? '_blank' : '_self'} rel="noopener noreferrer">
                                    <span className={this.props.data.fileUrl ? styles.icon : styles[this.props.data.iconStyle]}></span>
                                </a>
                            )
                        }
					</div>
				}
			</li>
		);
	}
}

class ModuleMediaList extends Component<{ data: ContentfulModuleMediaListFragment }> {
	render() {
		return (
			<ViewableMonitor>
				<div className={`module-margin ${styles.wrapper}`}>
                    <h2 tabIndex={0} className="text-style-category-headline">{this.props.data.title}</h2>
					<ul className={`${styles.listWrapper} module-margin-small`}>
						{this.props.data.items.map(question => (
							<MediaListItem key={question.id} data={question} />
						))}
					</ul>
				</div>
			</ViewableMonitor>
		);
	}
}

export default ModuleMediaList;

export const query = graphql`
	fragment ContentfulModuleMediaListFragment on ContentfulModuleMediaList {
		id
        title
		items {
			id
			title
			description {
				description
				childMarkdownRemark {
					html
				}
			}
			link
			fileUrl {
				file {
				  details {
					size
				  }
				  url
				}
			}
			iconStyle
		}
	}
`;
