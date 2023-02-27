import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleHomeNewsletter.module.scss';
import ViewableMonitor from '../ui/ViewableMonitor';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
// @ts-ignore
import { moduleHomeNewsletterQuery } from '../gatsby-queries';
import { graphql, StaticQuery } from 'gatsby';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import MainMenuSocialCopyright from '../MobileMenu/MobileMenuSocialCopyright';
import { globalHistory as history } from '@reach/router'
import addToMailchimp from 'gatsby-plugin-mailchimp';

class ModuleHomeNewsletter extends Component<{ currLang?: any; images: moduleHomeNewsletterQuery } & WrappedComponentProps> {
	state = {
		email: null
	};

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

	_handleChange = e => {
		this.setState({
			[`${e.target.name}`]: e.target.value
		});
	};

	_handleSubmit = async e => {
		e.preventDefault();
		let validationField = document.getElementById('validationError')
		let successField = document.getElementById('success')
		let newsletter = document.getElementById('newsletter');
		if(this.state.email === null || this.state.email === '') {
			validationField.textContent = this.props.intl.formatMessage({ id: 'email_validation' })
			validationField.style.display = 'block'
			return
		}
		await addToMailchimp(this.state.email)
		.then(() => {
			newsletter.style.display = 'none'
			validationField.style.display = 'none'
			successField.style.display = 'block'
		})
		.catch(() => {
			validationField.textContent = this.props.intl.formatMessage({ id: 'sign_up_newsletter_error' })
			validationField.style.display = 'block'
		});
		setTimeout(function() {
			document.getElementById('validationError').focus();
		}, 500);
	};

	render() {
		const { location } = history
		return (
			(location.pathname === '/idkt/' || location.pathname === '/ar/idkt/' || location.pathname === '/idkt' || location.pathname === '/ar/idkt') ? (
				<div className={`${styles.bgGrey}`} id="moduleHomeNewsletter">
					<div className={`module-margin ${styles.bgGrey}`}>
						<div className={`${styles.innerWrapper}`}>
							<div className={`${styles.wrapper}`}>
								<ViewableMonitor>
									<div className={`text-style-body ${styles.textWrapper}`}>
										<div className={`${styles.nsWrapper}`}>
											<div>
												<h2 className={`text-style-h2`}>
													<FormattedMessage id={'subscribe_newsletter_heading'} />
												</h2>
											</div>
											<div>
												<h2 className={`text-style-h2 ${styles.description}`}>
													<FormattedMessage id="subscribe_newsletter_text" />
												</h2>
												<a target='_blank' href={`${(location.pathname === '/ar/idkt/' || location.pathname === '/ar/idkt') ? '/ar' : '' }/idkt/newsletter`} data-swiftype-index="false" className={`text-style-body idktCTA ${styles.ctaLink}`}><FormattedMessage id={'subscribe'} /></a>
											</div>
										</div>
									</div>
								</ViewableMonitor>
								<ViewableMonitor>
									<div className={`${styles.detailsWrapper}`}>
										{
											// @ts-ignore
											<img alt='IDKT Newsletter' src='https://images.ctfassets.net/2h1qowfuxkq7/4lDY7HDcLQV5He53ruQFtZ/97918d626c0effbd31081b508728b4af/Newsletter-sign-up.jpg' />
										}
									</div>
								</ViewableMonitor>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className={`${styles.bgGrey}`} id="moduleHomeNewsletter">
					<div className={`module-margin ${styles.bgGrey}`}>
						<div className={`${styles.innerWrapper}`}>
							<div className={`${styles.wrapper}`}>
								<ViewableMonitor>
									<div className={`text-style-body ${styles.textWrapper}`}>
										<div className={`text-style-body ${styles.nsWrapper}`}>
											<div>
												<h2 className={`text-style-h2`}>
													<FormattedMessage id={'stay_in_touch'} />
												</h2>
											</div>
											<div className={`text-style-h2 ${styles.description}`}>
												<FormattedMessage id={'follow_us_text'} />
												<MainMenuSocialCopyright connectModule={true} />
											</div>
											<div>
												<h2 className={`text-style-h2 ${styles.description}`}>
													<FormattedMessage id="sign_up_newsletter">{txt => <>{this.convertNewLines(txt)} </>}</FormattedMessage>
												</h2>
												<form id="newsletter" onSubmit={this._handleSubmit} className={styles.newsletter} title={'Newslettersignupform'} aria-label={'Newslettersignupform'}>
													{
														<>
															{
																// @ts-ignore
																<label className={styles.newslettervisuallyhidden}>Email </label>
															}
															<span>
																<input
																	aria-label={'Newslettersignup'}
																	title={'Newslettersignupemail'}
																	onChange={this._handleChange}
																	placeholder={this.props.intl.formatMessage({ id: 'email' })}
																	className={styles.st_newsletter_input}
																	type="email"
																	name="email"
																	id="Newslettersignupemail"
																/>
															</span>
															<input
																type="submit"
																aria-label={'Newslettersignup'}
																title={'Newslettersignup'}
																className={styles.newsletter_button}
																name={'Newslettersignupsubmit'}
															/>
														</>
													}
												</form>
												<span className={styles.validationError} id="validationError" tabIndex={0}>
												</span>
												<span className={styles.success} id="success" tabIndex={0}>
													<FormattedMessage id={'sign_up_newsletter_success'} />
												</span>
											</div>
										</div>
									</div>
								</ViewableMonitor>
								<ViewableMonitor>
									<div className={`${styles.detailsWrapper}`}>
										{
											// @ts-ignore
											<GatsbyImageWrapper alt={this.props.image.allContentfulAsset.edges[0]?.node.title} image={this.props.image.allContentfulAsset.edges[0]?.node} />
										}
									</div>
								</ViewableMonitor>
							</div>
						</div>
					</div>
				</div>
			)
		);
	}
}

export default injectIntl(props => (
	<StaticQuery
		query={graphql`
			query moduleHomeNewsletterQuery {
				allContentfulAsset(filter: { title: { in: ["qfhome-connect-with-us-v2"] }, node_locale: { eq: "en-US" } }) {
					edges {
						node {
							title
							gatsbyImageData(placeholder: NONE, width: 960, quality: 85)
						}
					}
				}
			}
		`}
		// @ts-ignore
		render={data => <ModuleHomeNewsletter image={data as ModuleHomeNewsletterQuery} {...props} />}
	/>
));
