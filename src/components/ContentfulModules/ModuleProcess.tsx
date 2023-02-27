import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleProcess.module.scss';
import { ContentfulModuleProcessFragment, ContentfulModuleProcessFragment_processSteps } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import ModuleCfForm from './ModuleCfForm';
import { graphql } from 'gatsby';

const initialState = { open: false };
type State = Readonly<typeof initialState>;

class ModuleProcessStep extends Component<{ data: ContentfulModuleProcessFragment_processSteps }, State> {
	render() {
		return (
			<li className={`${styles.processStep} ${this.props.data.isSubstep ? styles.isSubStep : ''}`} key={this.props.data.id}>
				{this.props.data.stepHeadline && (
					<p className={styles.stepHeadline}>{this.props.data.stepHeadline}</p>
				)}
				{this.props.data.stepText && (
					<p className={styles.stepText}>{this.props.data.stepText.stepText}</p>
				)}
			</li>
		);
	}
}

class ModuleProcess extends Component<{ data: ContentfulModuleProcessFragment }> {
	render() {
		// @ts-ignore
		var form = this.props.data.processForm
		return (
			<ViewableMonitor>
				<div className={`module-margin ${form ? styles.withForm : ''} ${styles.wrapper}`}>
					<div className={`${styles.wrapperInner}`}>
						<div className={styles.titleWrapper}>
							<h3 className={styles.title}>{this.props.data.processTitle}</h3>
							{
								form && (
									// @ts-ignore
									<ModuleCfForm languageCode={this.props.languageCode} data={form} />
								)
							}
						</div>
						<ul className={`${styles.processSteps}`}>
							{this.props.data.processSteps?.map(item => (
								<ModuleProcessStep key={item.id} data={item} />
							))}
						</ul>
					</div>
				</div>
			</ViewableMonitor>
		);
	}
}

export default ModuleProcess;

export const query = graphql`
	fragment ContentfulModuleProcessFragment on ContentfulModuleProcess {
		id
		processTitle
		processSteps {
			id
			isSubstep
			stepHeadline
			stepText {
				stepText
			}
		}
		processForm {
			title
            uniqueId
            layout
            submitButtonText
            uniqueSubmission
            formFields {
                ... on ContentfulFormTextField {
                ...ContentfulFormTextFieldFragment
                }
                ... on ContentfulFormSelectField {
                ...ContentfulFormSelectFieldFragment
                }
                ... on ContentfulFormCheckboxField {
                ...ContentfulFormCheckboxFieldFragment
                }
            }
            thankYouMessage {
                raw
            }
            submissionUrl
		}
	}
`;
