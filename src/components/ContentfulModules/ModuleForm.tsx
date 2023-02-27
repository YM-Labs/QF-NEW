import * as React from 'react';
import * as styles from './ModuleForm.module.scss';
import { Component, useEffect } from 'react';
import { ContentfulModuleFormFragment } from '../../gatsby-queries';
import { graphql } from 'gatsby';
import loadable from '@loadable/component'
const iframeResize = loadable(() => import('iframe-resizer'));
import useDarkMode from 'use-dark-mode';
import ViewableMonitor from '../ui/ViewableMonitor';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { Globals } from '../../utils/Globals';

const IframeItem = (props) => {
	const darkMode = useDarkMode(false);
	const iFrame = React.useRef<HTMLIFrameElement>(null);
	let resizer = null;
	const setTheme = () => {
		try {
			if (!iFrame.current.contentWindow.document.body) return;
			if (darkMode.value) {
				addIframeClass('dark-mode');
			} else {
				removeIframeClass('dark-mode');
			}
		} catch (e) {
			console.log('set theme ran error', e);
		}
	};

	const loaded = () => {
		setTheme();
		resizer = iframeResize({ log: false }, iFrame.current)[0];
		if (props.data.isFormOnTheSide) {
			addIframeClass('form-on-side');
		}

		if (window.location.hash === '#formdone') {
			//remove hash.
			history.pushState('', document.title, window.location.pathname + window.location.search);
			try {
				console.log(iFrame.current.contentWindow.location.href);
			} catch (e) {
				console.log('caught error', 'form submitted correctly');
				props.callbackSuccess();
			}
		} else {
			try {
				console.log(iFrame.current.contentWindow.location.href);
			} catch (e) {
				props.callbackError();
				console.log('caught error', 'form error probably shown now');
			}
		}
	};

	const addIframeClass = (classname) => {
		iFrame.current.contentWindow.document.body.classList.add(classname);
	};

	const removeIframeClass = (classname) => {
		iFrame.current.contentWindow.document.body.classList.remove(classname);
	};

	const unmount = () => {
		if (resizer) {
			resizer.iFrameResizer.removeListeners();
		}
	};

	useEffect(() => {
		setTheme();
		return unmount;
	});
	return (
		<div>
			<iframe src={`/forms/form-${props.data.id}.html${Globals.CURRENT_LANGUAGE_PREFIX == 'ar/' ? '?language=ar' : '?language=en' }`} ref={iFrame} onLoad={loaded} />
		</div>
	);
};

const initialState = { success: false };
type State = Readonly<typeof initialState>;
class ModuleForm extends Component<{ data: ContentfulModuleFormFragment, compact?: boolean }, State> {
	readonly state: State = initialState;

	formError = () => {

	}
	formSuccess = () => {
		console.log('form success');
		this.setState({success: true});
	}
	public render() {
		return (
			<div className={`${styles.wrapper} ${!this.props.compact ? 'module-margin' : styles.compact} ${this.state.success ? styles.successMode : ''}`}>
				<div className={styles.wrapperInner}>
					<IframeItem data={this.props.data} callbackSuccess={this.formSuccess} callbackError={this.formError} />
					{this.state.success && <div className={`${styles.successWrapper}`}>
						<ViewableMonitor>
							<div className={`${styles.textWrapper}`}>
								<div>
									<h3 className={`text-style-h3 ${styles.title}`}>{this.props.data.submissionSuccessModule.titleText.titleText}</h3>
								</div>
								<div className={`text-style-body ${styles.body}`} dangerouslySetInnerHTML={{ __html: this.props.data.submissionSuccessModule.bodyText && this.props.data.submissionSuccessModule.bodyText.childMarkdownRemark.html }} />
								{this.props.data.submissionSuccessModule.ctaLinkOptional && this.props.data.submissionSuccessModule.ctaTextOptional && (
									<a className={`text-style-link-1 module-margin-small ${styles.ctaLink}`} href={this.props.data.submissionSuccessModule.ctaLinkOptional} target={this.props.data.submissionSuccessModule.openInNewTab && '_blank'}>
										{this.props.data.submissionSuccessModule.ctaTextOptional}
									</a>
								)}
							</div>
						</ViewableMonitor>
						<ViewableMonitor delay={true}>
							<div className={styles.imageWrapper}>
								{
									// @ts-ignore
									<GatsbyImageWrapper alt={this.props.data.submissionSuccessModule.image.title} outerWrapperClassName={styles.desktopImage} image={this.props.data.submissionSuccessModule.image.desktop} />
								}
								{
									// @ts-ignore
									<GatsbyImageWrapper alt={this.props.data.submissionSuccessModule.image.title} outerWrapperClassName={styles.mobileImage} image={this.props.data.submissionSuccessModule.image.mobile} />
								}
							</div>
						</ViewableMonitor>
					</div>}
				</div>
			</div>
		);
	}
}

export default ModuleForm;

export const query = graphql`
	fragment ContentfulModuleFormFragment on ContentfulModuleForm {
		id
		isFormOnTheSide
		submissionSuccessModule {
			titleText {
				titleText
			}
			bodyText {
				childMarkdownRemark {
					html
				}
			}
			ctaTextOptional
			ctaLinkOptional
			openInNewTab
			image {
				title
				desktop: gatsbyImageData(
                    placeholder: NONE
                    height: 1200
                    width: 900
                    quality: 85
                  )
				mobile: gatsbyImageData(
                    placeholder: NONE
                    height: 450
                    width: 640
                    quality: 85
                  )
			}
		}
	}
`;
