import * as React from 'react';
//@ts-ignore:
import * as styles from './Footer.module.scss';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { globalsQueryAndLayout_siteGlobals_edges_node, MainMenuFragment } from '../gatsby-queries';
import { TweenMax, gsap } from 'gsap/dist/gsap.min';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { EASE_CUSTOM_OUT } from '../utils/Constants';
import { makeAbsolute, getPagePath } from '../utils/URLHelper';
import GatsbyLinkExternalSupport from '../ui/GatsbyLinkExternalSupport';
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import loadable from '@loadable/component';
const MinimizableWebChat = loadable(() => import('../lib/webchat/MinimizableWebChat'))

interface Props {
	siteGlobals: globalsQueryAndLayout_siteGlobals_edges_node;
	menuData: MainMenuFragment[];
	currLanguage: any;
	pageTitle?: any;
	showStatementNotification?: boolean;
	currPageTitle?: any;
	locationPathName?: any;
    footerBarInfo?: any;
}

const initialState = { userDetails: null, showCookieDialog: false, darkmode: null };
type State = Readonly<typeof initialState>;

class Footer extends React.Component<Props & WrappedComponentProps, State> {
	private cookieBanner;
	readonly state: State = initialState;
    private options = {
        renderMark: {
          [MARKS.BOLD]: text => <h1>{text}</h1>,
        },
        renderText: text => {
            return text.split('\n').reduce((children, textSegment, index) => {
                return [...children, index > 0 && <br key={index} />, textSegment];
            }, []);
        },
        renderNode: {
          // @ts-ignore
          [BLOCKS.PARAGRAPH]: (node, children) => children,
          [BLOCKS.EMBEDDED_ASSET]: node => {
            return (
              <>
                <h2>Embedded Asset</h2>
                <pre>
                  <code>{JSON.stringify(node, null, 2)}</code>
                </pre>
              </>
            )
          },
          [INLINES.HYPERLINK]: (node) => {
            return <a href={node.data.uri}>{node.content[0].value}</a>;
          },
        },
    }

	constructor(props) {
		super(props);
		this.closeCookieDialog = this.closeCookieDialog.bind(this);
	}

	private topArrowClickHandler = event => {
		if (event) {
			event.preventDefault();
			gsap.to(window, { duration: 0.5, scrollTo: { y: 0, autoKill: false }, ease: 'easeInOut' });
		}
	};

	private closeCookieDialog = event => {
		if (event) {
			if (event.target.id == 'closebutton') {
				event.preventDefault();
			}
			localStorage.setItem('qf-cookie-consent', '1');
			this.setState({
				showCookieDialog: false
			});
			TweenMax.to(this.cookieBanner, 0.5, { y: 100, yPercent: 100, ease: EASE_CUSTOM_OUT, force3D: true, delay: 0.5 });
		}
	};

	private showCookieDialog = () => {
		this.setState({
			showCookieDialog: true
		});
		!localStorage.getItem('qf-cookie-consent') && TweenMax.to(this.cookieBanner, 0.5, { y: 0, yPercent: -100, ease: EASE_CUSTOM_OUT, force3D: true, delay: 2 });
	};

	async componentDidMount() {
		this.showCookieDialog();
		gsap.registerPlugin(ScrollToPlugin);
        this.closeCookieDialog = this.closeCookieDialog.bind(this);
        document.getElementById('mode').addEventListener("click", this.handleMode );
	}

    handleMode = () => {
		this.setState({
			darkmode: typeof document !== 'undefined' && !document.body.classList.contains('dark-mode')
		})
	}

	convertNewLines(_text) {
		let lines = _text.toString().split('\n');
		let elements = [];
		for (let i = 0; i < lines.length; i++) {
			elements.push(lines[i]);
			if (i < lines.length - 1) {
				elements.push(<br key={i} />);
			}
		}
		return elements;
	}

	render() {
		let { siteGlobals, menuData, currLanguage } = this.props;
		let showCookieDialog = this.state;
		const activeMenu = menuData.filter(menuFragment => menuFragment.node_locale === currLanguage.langKey)[0];
		const pressEmail = ['mailto:', 'pressoffice@qf.org.qa'];
		const madaLink = currLanguage.langKey === 'ar-QA' ? 'https://mada.org.qa/?lang=ar' : 'https://mada.org.qa'
		return (
			<div
				className={`${(this.props.locationPathName !== '/' && this.props.locationPathName !== '/ar/' && this.props.locationPathName !== '/ar' && this.props.locationPathName !== '/idkt' && this.props.locationPathName !== '/idkt/' && this.props.locationPathName !== '/ar/idkt' && this.props.locationPathName !== '/ar/idkt/') && 'module-margin'} ${styles.wrapper}`}
				data-swiftype-index="false"
				id="footer"
			>
				<div className={styles.top}>
					<div className={styles.innerWrapper}>
						<a
							title={this.props.intl.formatMessage({ id: 'Gototopbuttontitle' })}
							aria-label={this.props.intl.formatMessage({ id: 'Gototopbuttonarialabel' })}
							onClick={this.topArrowClickHandler}
							className={styles.topArrow}
							href="#top"
						/>
						<div className={styles.contactInfo}>
							<h1>{siteGlobals.footerOrganizationName}</h1>
							<div>
								<div className={styles.contactItem}>
									<FormattedMessage id="email:" />
									<a href={'mailto:' + siteGlobals.footerContactEmail}>{siteGlobals.footerContactEmail}</a>
								</div>
								<div className={styles.contactItem}>
									<FormattedMessage id="tel:" />
									<a href={'tel:' + siteGlobals.footerContactPhoneNumber}>{siteGlobals.footerContactPhoneNumber}</a>
								</div>
								<div className={styles.contactItem}>
									<br />
									<p className="media-inquiries-text">
										<FormattedMessage id="general-inquiries-footer-text">
											{txt => (
												<>
													{this.convertNewLines(txt)}{' '}
													<a href={pressEmail[0] + pressEmail[1]}>
														<b>{pressEmail[1]}</b>
													</a>
												</>
											)}
										</FormattedMessage>
									</p>
									<br />
									<p className="media-inquiries-text">
										<FormattedMessage id="balagh-qf-hotline-footer-text">
											{txt => (
												<>
													{this.convertNewLines(txt)}{' '}
													<a href={getPagePath('', 'hotline')}>
														<b>
															<FormattedMessage id="Anti-Fraud and Whistle-Blowing Hotline" children={msg => <>{msg}</>} />
														</b>
													</a>
												</>
											)}
										</FormattedMessage>
									</p>
								</div>
							</div>
						</div>
						<div className={styles.navListWrapper}>
							<div className={styles.navList}>
								<FormattedMessage id="Navigation" />
								<ul>
									{activeMenu.secondaryMenuItems.map((menuItem, index) => {
										return (
											<li key={menuItem.path + index}>
												{menuItem.path.indexOf('#') === 0 ? (
													<a href={menuItem.path}>{menuItem.title}</a>
												) : (
													<GatsbyLinkExternalSupport to={makeAbsolute(menuItem.path)}>{menuItem.title}</GatsbyLinkExternalSupport>
												)}
											</li>
										);
									})}
								</ul>
							</div>
							{activeMenu.menuItems.slice(0, -1).map(menuItem => {
								return (
									<div key={menuItem.id} className={styles.navList}>
										<span>{menuItem.label}</span>
										<ul>
											{menuItem.subpages?.map(link => {
                                                return (
                                                    <>
                                                        {
                                                            // @ts-ignore
                                                            (link.slug && link.slug !== '/ar/undefined') ? (
                                                                <li key={link.id}>
                                                                    {
                                                                        // @ts-ignore
                                                                        <GatsbyLinkExternalSupport to={makeAbsolute(link.slug)}>{link.title}</GatsbyLinkExternalSupport>
                                                                    }
                                                                </li>
                                                            ) : (
                                                                null
                                                            )
                                                        }
                                                        {
                                                            // @ts-ignore
                                                            link?.subpages?.map(sublink => {
                                                                return (
                                                                    <li key={sublink.id}>
                                                                        {
                                                                            // @ts-ignore
                                                                            <GatsbyLinkExternalSupport to={currLanguage.langKey === 'ar-QA' ? '/ar' + makeAbsolute(sublink.slug) : makeAbsolute(sublink.slug)}>{sublink.title}</GatsbyLinkExternalSupport>
                                                                        }
                                                                    </li>
                                                                );
                                                        })}
                                                    </>
                                                );
											})}
										</ul>
									</div>
								);
							})}
						</div>
					</div>
				</div>
                <div className={styles.infoBarWrapper}>
                    {
                        renderRichText(this.props.footerBarInfo, this.options)
                    }
                </div>
				<div className={styles.copyrightWrapper}>
					<div className={styles.innerWrapper}>
						<div className={styles.smallLinks} dangerouslySetInnerHTML={{ __html: siteGlobals.footerSmallLinks.childMarkdownRemark.html }} />
						<span>{siteGlobals.footerCopyrightMessage.footerCopyrightMessage}</span>
						<div className={styles.mada}>
							<span>
								<FormattedMessage id="mada_text" />
							</span>
							<a href={madaLink} target="_blank">
								{
									<img loading='lazy' width="28" height="28" alt={this.props.intl.formatMessage({ id: "mada_logo" })} src='/mada.png' />
								}
							</a>
						</div>
					</div>
				</div>
				{showCookieDialog && (
					<div className={styles.cookieWrapper} ref={div => (this.cookieBanner = div)}>
						<div className={styles.cookieInnerWrapper}>
							<h1>
								<FormattedMessage id="cookie_title" />
							</h1>
							<p>
								<FormattedMessage id="cookie_content" />
								<GatsbyLinkExternalSupport id="cookiebutton" to={getPagePath('', 'terms')} onClick={this.closeCookieDialog.bind(this)}>
									<FormattedMessage id="page.link" />
								</GatsbyLinkExternalSupport>
							</p>
							<a
								title={this.props.intl.formatMessage({ id: 'closecookiedialogueboxclosebtntitle' })}
								aria-label={this.props.intl.formatMessage({ id: 'closecookiedialogueboxclosebtnarialabel' })}
								id="closebutton"
								className={styles.closeButton}
								href="#close-cookie"
								onClick={this.closeCookieDialog.bind(this)}
							/>
						</div>
					</div>
				)}
                {
                    // @ts-ignore
                    <MinimizableWebChat isHomePage={typeof document !== 'undefined' && document.documentElement.classList.contains('page-home')} lang={currLanguage.langKey.split("-")[0]} darkMode={this.state.darkmode === null ? typeof document !== 'undefined' && document.body.classList.contains('dark-mode') : this.state.darkmode} />
                }
			</div>
		);
	}
}

export default injectIntl(Footer);
