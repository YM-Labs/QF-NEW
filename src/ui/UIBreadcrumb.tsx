import * as React from 'react';

import * as styles from './UIBreadcrumb.module.scss';
import { Link } from 'gatsby';
import { FormattedMessage } from 'react-intl';
import ViewableMonitor from '../components/ui/ViewableMonitor';

const URLPathMapping = {
	events: 'Events',
	'education-city-speaker-series': 'Education City Speaker Series',
	stories: 'Stories',
	education: 'Education',
	research: 'Research',
	community: 'Community',
	'media-center': 'Media Center',
	search: 'Search',
	about: 'About'
};
const URLPathMappingAR = {
	events: 'الفعاليات',
	'education-city-speaker-series': 'سلسلة محاضرات المدينة التعليمية',
	stories: 'قصص',
	education: 'التعليم',
	research: 'البحوث',
	community: 'المجتمع',
	'media-center': 'المركز الإعلامي',
	search: 'بحث',
	about: 'عن المؤسسة'
};
export class UIBreadcrumb extends React.Component<{ currPageTitle: string; currLanguage: any; location: any, isExpertPage?: boolean }> {
	private currRenderPath: { title: string; link?: string }[] = [];

	public render() {
		let path = this.props.location.pathname;
		let prependLanguage = this.props.currLanguage.link.length > 1;
		const isFrontPage = path === '/' || path === '/ar';
		if (!isFrontPage) {
			if (prependLanguage) {
				path = path.substr(this.props.currLanguage.link.length);
			}

			const pathParts = path.split('/');

			this.currRenderPath = [];

			if (pathParts.length >= 2) {
				let pathPart = this.props.currLanguage.link === '/' ? URLPathMapping[pathParts[1]] : URLPathMappingAR[pathParts[1]];
				if (pathPart) {
					this.currRenderPath.push({ title: pathPart, link: prependLanguage ? this.props.currLanguage.link + '/' + pathParts[1] : '/' + pathParts[1] });
				}
			}

			if (this.currRenderPath[this.currRenderPath.length - 1] === undefined || this.currRenderPath[this.currRenderPath.length - 1].title !== this.props.currPageTitle) {
				this.currRenderPath.push({ title: this.props.currPageTitle });
			}

			if(pathParts.length > 3 && path.indexOf('/idkt') != -1) {
				this.currRenderPath[0].link = `${this.props.currLanguage.link === '/' ? '/idkt/about' : '/ar/idkt/about'}`
			}

			if(pathParts.length >= 4 && path.indexOf('/experts/') != -1) {
				//@ts-ignore:
				this.currRenderPath.splice(1, 0, { title : null, link: null });
			}
		}

		return (
            <ViewableMonitor delay={400}>
                <div id='breadcrumb' className={`${styles.wrapper} ${isFrontPage ? 'hidden' : ''}`}>
                    <Link to={this.props.currLanguage.link}>
                        <FormattedMessage id={'Home'} />{' '}
                    </Link>{' '}
                    {
                        path.indexOf('/idkt') != -1 && (
                            <Link key={'idkt'} to={`${this.props.currLanguage.link === '/' ? '/idkt' : '/ar/idkt'}`}>
                                <FormattedMessage id={'idkt'} />
                            </Link>
                        )
                    }
                    {this.currRenderPath.map((part, index) =>
                        part.link ? (
                            <Link key={index} to={part.link}>
                                {part.title}
                            </Link>
                        ) : (
                            this.props.isExpertPage ? part.title && (
                            <span key={index}>
                                <Link key={'experts'} to={`${this.props.currLanguage.link === '/' ? '/media-center/experts' : '/ar/media-center/experts'}`}>
                                    <FormattedMessage id={'our_experts'} />
                                </Link>
                            </span>) :
                            part.title && (<span key={index}>{part.title}</span>)
                        )
                    )}
                </div>
            </ViewableMonitor>
		);
	}
}
