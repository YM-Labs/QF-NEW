import * as React from 'react';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import SelectLanguage from './SelectLanguage';
import * as styles from './ModulePopOver.module.scss';

const initialState = { open: false, selectedIndex: -1 };
type State = Readonly<typeof initialState>;

class ModulePopOver extends Component<{ langs?: any; alternateURL?: string }, State> {
	private topOffset = 0;

	readonly state: State = initialState;

	constructor(props) {
		super(props);
	}

	private closeHandler = () => {
		this.setState({ selectedIndex: -1 });
		document.body.style.position = '';
		document.body.style.top = '';

		localStorage.setItem('qf-qatarreads-popup', '1');
		this.setState({
			open: false
		});
	};

	/*
	private removeOverlay() {
		document.getElementById('siteWrapper').style.opacity = '1';
		document.getElementById('footer').style.opacity = '1';
	}
	*/

	componentDidMount() {
		// document.getElementById('siteWrapper').style.opacity = '0.2';
		// document.getElementById('footer').style.opacity = '0.2';
		document.body.style.position = 'fixed';
		document.body.style.top = `-${window.scrollY}px`;
		this.setState({ selectedIndex: 1 });
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
		let lengthClass = styles.length;
		return (
			<div className={`module-margin ${styles.wrapper} ${lengthClass} ${styles.hasSelection}`}>
				<div style={{ top: this.topOffset }} className={styles.popOver + (this.state.selectedIndex >= 0 ? '' : ' ' + styles.popOverOpen)}>
					<span className={styles.logo}>
						<img alt="Qatar Reads Logo" src="https://qatarreads.qa/wp-content/uploads/2019/05/cropped-logo_v1.png" />
					</span>
					<div className={styles.popOverDescription}>
						{/*
						<h3 className={`text-style-h2 ${styles.title}`}>
							<FormattedHTMLMessage id="qr_campaign_title">{txt => <>{this.convertNewLines(txt)} </>}</FormattedHTMLMessage>
						</h3>
						*/}
						<div className={`text-style-body ${styles.popOverBody}`}>
							<FormattedMessage id="qr_campaign_text">{txt => <>{this.convertNewLines(txt)} </>}</FormattedMessage>
						</div>
						<br />
						<div className={styles.ctaBottom + ' module-margin-small'}>
							<a onClick={this.closeHandler} className={`text-style-body ${styles.ctaLink}`} href={this.props.alternateURL !== "https://www.qf.org.qa/ar" ? 'https://qatarreads.qa/ar/home-ar/' : 'https://qatarreads.qa'}>
								<FormattedMessage id={'qr_campaign_link'} />
							</a>
							<br />
							<a onClick={this.closeHandler} className={`text-style-body ${styles.ctaLink}`} href={'#'}>
								<FormattedMessage id={'qr_goto_qf_site_link'} />
							</a>
						</div>
					</div>
					<div className={styles.languageToggleWrapper}>
						<SelectLanguage inMenu={false} alternateURL={this.props.alternateURL} langs={this.props.langs} />
					</div>
					<div onClick={this.closeHandler} className={styles.closeIcon}>
						<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
							<g fill="none" fillRule="evenodd">
								<g fill="#000">
									<path d="M6.72 6.01l6-6.01.72.7-6.02 6.02 6.02 6-.71.72-6.01-6.02L.7 13.44 0 12.73l6.01-6.01L0 .7.7 0l6.02 6.01z" />
								</g>
							</g>
						</svg>
					</div>
				</div>
			</div>
		);
	}
}

export default ModulePopOver;
