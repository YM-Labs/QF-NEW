import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './ModuleShortBoxedText.module.scss';
import { Component } from 'react';
import { ContentfulModuleShortBoxedTextFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

const initialState = { open: false };
type State = Readonly<typeof initialState>;


class ModuleShortBoxedText extends Component<{ data: ContentfulModuleShortBoxedTextFragment, marginSm?: boolean }> {
	readonly state: State = initialState;
	private animationWrapper: HTMLDivElement;
	private wrapper: HTMLDivElement;

	private transitioning = false;

	private boxClickHandler = event => {
		if (event) {
			event.preventDefault();
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

	render() {
		return (
			<div className={`${!this.props.marginSm ? 'module-margin' : 'module-margin-small'} ${styles.wrapper} ${this.state.open ? styles.open : ''} ${this.props.data.darkBackground ? styles.darkBackground : ''}`}>
				<ViewableMonitor>
					<div className={`${styles.shortBoxedWrapper} ${this.props.marginSm && styles.fullWidth}`} onClick={this.boxClickHandler}>
						<div>
							<p className={styles.title}>{this.props.data.shortBoxedTitle.shortBoxedTitle}</p>
							<div className={styles.introParagraphText} dangerouslySetInnerHTML={{ __html: this.props.data.introParagraph.childMarkdownRemark.html }} />
						</div>
						<div ref={ref => (this.animationWrapper = ref)} className={styles.expandedParagraph}>
							<div ref={ref => (this.wrapper = ref)} className={styles.expandedParagraphInner}>
								<div className={styles.expandedParagraphText} dangerouslySetInnerHTML={{ __html: this.props.data.expandedParagraph.childMarkdownRemark.html }} />
							</div>
						</div>
						<div className={styles.readMoreBar}>
							<div className={styles.toggleIcon} />
							<span className={styles.readMoreLabel}>
								{ this.state.open ? <FormattedMessage id={'read_less'} /> : <FormattedMessage id={'read_more'} />}
							</span>
						</div>
					</div>
				</ViewableMonitor>
			</div>
		);
	}
}

export default ModuleShortBoxedText;

export const query = graphql`
	fragment ContentfulModuleShortBoxedTextFragment on ContentfulModuleShortBoxedText {
		id
		shortBoxedTitle {
			shortBoxedTitle
		}
		introParagraph {
			introParagraph
			childMarkdownRemark {
				html
			}
		}
		expandedParagraph {
			expandedParagraph
			childMarkdownRemark {
				html
			}
		}
		darkBackground
	}
`;
