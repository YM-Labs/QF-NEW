import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleAccordion.module.scss';
import { ContentfulModuleAccordionFragment, ContentfulModuleAccordionFragment_accordionItem } from '../../gatsby-queries';
import { FormattedMessage } from 'react-intl';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

const initialState = { open: false };
type State = Readonly<typeof initialState>;

class AccordionItem extends Component<{ data: ContentfulModuleAccordionFragment_accordionItem }, State> {
	readonly state: State = initialState;

	private wrapper: HTMLDivElement;
	private animationWrapper: HTMLDivElement;

	private transitioning = false;

	private listItemClickHandler = event => {
		if (event) {
			// event.preventDefault();
		}
		if (!this.state.open) {
			this.transitioning = true;
			this.animationWrapper.addEventListener('transitionend', this.transitionEnd);
			this.animationWrapper.style.height = this.wrapper.clientHeight + 'px';
		} else {
			if (!this.transitioning) {
				this.animationWrapper.style.height = this.wrapper.clientHeight + 'px';
				this.animationWrapper.offsetTop; //Render hack:
			}
			this.transitioning = true;
			this.animationWrapper.removeEventListener('transitionend', this.transitionEnd);
			this.animationWrapper.style.height = '0px';
		}
		this.setState({ open: !this.state.open });
	};

	private transitionEnd = () => {
		if (this.state.open) {
			this.transitioning = false;
			this.animationWrapper.removeEventListener('transitionend', this.transitionEnd);
			this.animationWrapper.style.height = 'auto';
		}
	};

	private faqqatabbingfix = event => {
		if (event.key == 'Enter') {
            event.currentTarget.focus()
			this.listItemClickHandler(event);
		}
	};

	render() {
		return (
			<li onClick={this.listItemClickHandler} className={`${styles.accordionItem} ${this.state.open ? styles.open : ''}`} key={this.props.data.id}>
				<div className={styles.accordionHeadline}>
					<div className={styles.toggleIcon} />
					<span className={styles.headline} tabIndex={0} onKeyDown={this.faqqatabbingfix}>
						{this.props.data.headline}
					</span>
					<span className={styles.label}>{this.props.data.label}</span>
				</div>
				<div ref={ref => (this.animationWrapper = ref)} className={styles.answerWrapper}>
					<div className={styles.answerWrapperInner} ref={ref => (this.wrapper = ref)}>
						<div
							className={`text-style-body-module ${styles.paragraph}` + ' ModuleFaqListanswerspan'}
							dangerouslySetInnerHTML={{ __html: this.props.data.itemParagraph.childMarkdownRemark.html }}
							tabIndex={-1}
						/>
						{this.props.data.itemLink !== null && (
							<a href={this.props.data.itemLink.itemLink} className={styles.link} tabIndex={-1}>
								<span className={styles.linkText}>
									<FormattedMessage id={'page.link'} />
								</span>
							</a>
						)}
					</div>
				</div>
			</li>
		);
	}
}

class ModuleAccordion extends Component<{ data: ContentfulModuleAccordionFragment }> {
	render() {
		return (
			<ViewableMonitor>
				<div className={`module-margin`}>
					<ul className={styles.listWrapper}>
						{this.props.data.accordionItem.map((item, index) => (
							<AccordionItem key={index + item.id} data={item} />
						))}
					</ul>
				</div>
			</ViewableMonitor>
		);
	}
}

export default ModuleAccordion;

export const query = graphql`
	fragment ContentfulModuleAccordionFragment on ContentfulModuleAccordion {
		id
		accordionItem {
			id
			headline
			label
			itemParagraph {
				itemParagraph
				childMarkdownRemark {
					html
				}
			}
			itemLink {
				itemLink
			}
		}
	}
`;
