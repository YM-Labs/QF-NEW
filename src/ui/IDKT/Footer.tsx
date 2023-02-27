import * as React from 'react';
//@ts-ignore:
import * as styles from './Footer.module.scss';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { TweenMax, gsap } from 'gsap/dist/gsap.min';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { EASE_CUSTOM_OUT } from '../../utils/Constants';
import { getPagePath } from '../../utils/URLHelper';
import GatsbyLinkExternalSupport from '../GatsbyLinkExternalSupport';

interface Props {
	currLanguage: any;
	pageTitle?: any;
	showStatementNotification?: boolean;
	currPageTitle?: any;
	locationPathName?: any;
}

const initialState = { userDetails: null, showCookieDialog: false };
type State = Readonly<typeof initialState>;

class IDKTFooter extends React.Component<Props & WrappedComponentProps, State> {
	private cookieBanner;
	readonly state: State = initialState;

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
	}

	convertNewLines(_text) {
		let lines = _text.split('\n');
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
		// @ts-ignore
		let { siteGlobals, currLanguage } = this.props;
		let showCookieDialog = this.state;
		const madaLink = currLanguage.langKey === 'ar-QA' ? 'https://mada.org.qa/?lang=ar' : 'https://mada.org.qa'
        const idktnewsletterLink = currLanguage.langKey === 'ar-QA' ? '/ar/idkt/newsletter' : '/idkt/newsletter'
		return (
			<div
				className={`${this.props.locationPathName !== '/' && this.props.locationPathName !== '/ar/' && this.props.locationPathName !== '/ar' && 'module-margin'} ${styles.wrapper}`}
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
							<h2><FormattedMessage id="idkt_long" /></h2>
							<div>
								<div className={styles.contactItem}>
									<FormattedMessage id="email:" />&nbsp;
									<a href={'mailto:IDKT@qf.org.qa'}>IDKT@qf.org.qa</a>
								</div>
								<div className={styles.contactItem}>
									<FormattedMessage id="tel:" />&nbsp;
									<a href={'tel:+974 4454 0818'}>+974 4454 0818</a>
								</div>
                                <div className={styles.contactItem}>
									<a href={idktnewsletterLink}>
									    <FormattedMessage id="idkt_newsletter" />
                                    </a>
								</div>
							</div>
						</div>
						<div className={styles.navListWrapper}>
							<div className={styles.navList}>
								<span><FormattedMessage id="navigation" /></span>
								<ul>
									<li key='0'>
										<a  href={getPagePath('', 'technologies')}><FormattedMessage id="technologies" /></a>
									</li>
									<li key='1'>
										<a href={getPagePath('', 'idktAbout')}><FormattedMessage id="about" /></a>
									</li>
									<li key='2'>
										<a href={getPagePath('', 'infoBank')}><FormattedMessage id="infobank" /></a>
									</li>
									<li key='3'>
										<a href={getPagePath('', 'technologyTransfer')}><FormattedMessage id="road_to_technology_transfer" /></a>
									</li>
								</ul>
							</div>
							<div className={styles.navList}>
								<span><FormattedMessage id="for_industry" /></span>
								<ul>
									<li key='4'>
										<a href={getPagePath('', 'forIndustry')}><FormattedMessage id="overview" /></a>
									</li>
									<li key='5'>
										<a href={`${getPagePath('', 'forIndustry')}#section-1`}><FormattedMessage id="what_we_offer" /></a>
									</li>
									<li key='6'>
										<a href={`${getPagePath('', 'forIndustry')}#section-2`}><FormattedMessage id="how_licensing_works" /></a>
									</li>
									<li key='7'>
										<a href={`${getPagePath('', 'forIndustry')}#section-3`}><FormattedMessage id="resources_for_industry" /></a>
									</li>
								</ul>
							</div>
							<div className={styles.navList}>
								<span><FormattedMessage id="for_researchers" /></span>
								<ul>
									<li key='8'>
										<a href={`${getPagePath('', 'forResearchers')}`}><FormattedMessage id="overview" /></a>
									</li>
									<li key='9'>
										<a href={`${getPagePath('', 'forResearchers')}#section-1`}><FormattedMessage id="what_we_offer" /></a>
									</li>
									<li key='10'>
										<a href={`${getPagePath('', 'forResearchers')}#section-2`}><FormattedMessage id="how_commercialization_works" /></a>
									</li>
									<li key='11'>
										<a href={`${getPagePath('', 'forResearchers')}#section-3`}><FormattedMessage id="resources_for_researchers" /></a>
									</li>
								</ul>
							</div>
							<div className={styles.navList}>
								<span><FormattedMessage id="for_entrepreneurs" /></span>
								<ul>
									<li key='12'>
										<a href={`${getPagePath('', 'forEntrepreneurs')}`}><FormattedMessage id="overview" /></a>
									</li>
									<li key='13'>
										<a href={`${getPagePath('', 'forEntrepreneurs')}#section-1`}><FormattedMessage id="what_we_offer" /></a>
									</li>
									<li key='14'>
										<a href={`${getPagePath('', 'forEntrepreneurs')}#section-2`}><FormattedMessage id="how_to_launch_a_startup" /></a>
									</li>
									<li key='15'>
										<a href={`${getPagePath('', 'forEntrepreneurs')}#section-3`}><FormattedMessage id="resources_for_entrepreneurs" /></a>
									</li>
								</ul>
							</div>
							<div className={styles.navList}>
								<span><FormattedMessage id="Navigation" /></span>
								<ul>
									<li key='16'>
										<a href={`${getPagePath('', 'about')}`}><FormattedMessage id="about" /></a>
									</li>
									<li key='17'>
										<a href={`${getPagePath('', 'education')}`}><FormattedMessage id="Education" /></a>
									</li>
									<li key='18'>
										<a href={`${getPagePath('', 'research')}`}><FormattedMessage id="Research" /></a>
									</li>
									<li key='19'>
										<a href={`${getPagePath('', 'community')}`}><FormattedMessage id="Community" /></a>
									</li>
								</ul>
							</div>
						</div>
					</div>
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
									<img alt={this.props.intl.formatMessage({ id: "mada_logo" })} src='/mada.png' />
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
								<GatsbyLinkExternalSupport to={getPagePath('', 'terms')} onClick={this.closeCookieDialog.bind(this)}>
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
			</div>
		);
	}
}

export default injectIntl(IDKTFooter);
