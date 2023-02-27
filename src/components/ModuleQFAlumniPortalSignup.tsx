import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleQFAlumniPortalSignup.module.scss';
import ViewableMonitor from './ui/ViewableMonitor';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
// @ts-ignore
import { moduleQFAlumniPortalSignup } from '../gatsby-queries';
import { graphql, StaticQuery } from 'gatsby';
import { GatsbyImageWrapper } from './ui/GatsbyImageWrapper';

var apiConfig = 'https://prod-43.westeurope.logic.azure.com:443/workflows/df006e0be65e4e33870da05375b70f59/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=r_YDrkru-AXMipyo5aKM_pMTZljAXdpFEe6IJU7r56Q'

class ModuleQFAlumniPortalSignup extends Component<{ currLang?: any; images: moduleQFAlumniPortalSignup } & WrappedComponentProps> {
	state = {
		name: null,
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

	_handleSubmit = e => {
		e.preventDefault();
		let validationNameField = document.getElementById('validationnamerror')
		let validationEmailField = document.getElementById('validationemailerror')
		let validationField = document.getElementById('validationrror')
		validationField.style.display = 'none'

		let successField = document.getElementById('success')
		let newsletter = document.getElementById('newsletter');

		if (this.state.name === null || this.state.name === '') {
			validationNameField.textContent = this.props.intl.formatMessage({ id: 'name_validation' })
			validationEmailField.style.display = 'none'
			validationNameField.style.display = 'block'
			return
		}
		if (this.state.email === null || this.state.email === '') {
			validationEmailField.textContent = this.props.intl.formatMessage({ id: 'email_validation' })
			validationNameField.style.display = 'none'
			validationEmailField.style.display = 'block'
			return
		}

		var data = {
            "name": this.state.name,
			"email": this.state.email,
		}

		fetch(apiConfig, { 
			method: 'POST', 
			body: JSON.stringify(data), 
			headers: {'Content-Type': 'application/json'}
		})
		.then(() => {
			newsletter.style.display = 'none'
			validationNameField.style.display = 'none'
			validationEmailField.style.display = 'none'
			successField.style.display = 'block'
		})
		.catch(() => {
			validationNameField.style.display = 'none'
			validationEmailField.style.display = 'none'
			validationField.textContent = this.props.intl.formatMessage({ id: 'sign_up_newsletter_error' })
			validationField.style.display = 'block'
		});
	};

	render() {
		return (
			<div>
				<div className={`module-margin container`}>
					<div className={`${styles.innerWrapper}`}>
						<div className={`${styles.wrapper}`}>
							<ViewableMonitor>
								<div className={`text-style-body ${styles.textWrapper}`}>
									<div className={`text-style-body ${styles.nsWrapper}`}>
										<div>
											<h2 className={`text-style-h2`}>
												<FormattedMessage id={'qf_alumni_portal_launch_signup_heading'} />
											</h2>
										</div>
										<div>
											<h2 className={`text-style-h2 ${styles.description}`}>
												<FormattedMessage id="qf_alumni_portal_launch_signup_text">{txt => <>{this.convertNewLines(txt)} </>}</FormattedMessage>
											</h2>
											<form id="newsletter" className={styles.newsletter} title={'Newslettersignupform'} aria-label={'Newslettersignupform'}>
												{
													<>
														{
															// @ts-ignore
															<label className={styles.newslettervisuallyhidden}>Email </label>
														}
														<span>
															<input
																aria-label={'Newslettersignup'}
																title={'Newslettersignupname'}
																onChange={this._handleChange}
																placeholder={this.props.intl.formatMessage({ id: 'name' })}
																className={styles.st_newsletter_input}
																type="name"
																name="name"
																id="Newslettersignupname"
															/>
															<span className={styles.validationError} id="validationnamerror" tabIndex={0}></span>
														</span>
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
															<span className={styles.validationError} id="validationemailerror" tabIndex={0}></span>
															<span className={styles.validationError} id="validationrror" tabIndex={0}></span>
														</span>
														<a id='submit' onClick={this._handleSubmit} href="#" className={`${styles.ctaLink}`}>
															<FormattedMessage id={'notify_me'} />
														</a>
													</>
												}
											</form>
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
										<GatsbyImageWrapper alt={this.props.image.allContentfulAsset.edges[0].node.title} image={this.props.image.allContentfulAsset.edges[0].node} />
									}
								</div>
							</ViewableMonitor>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default injectIntl(props => (
	<StaticQuery
		query={graphql`
			query moduleQFAlumniPortalSignupQuery {
				allContentfulAsset(filter: { title: { in: ["QFAlumniPortalSignup"] }, node_locale: { eq: "en-US" } }) {
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
		render={data => <ModuleQFAlumniPortalSignup image={data as ModuleQFAlumniPortalSignupQuery} {...props} />}
	/>
));