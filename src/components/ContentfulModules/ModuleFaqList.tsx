import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleFaqList.module.scss';
import { ContentfulModuleFaqListFragment } from '../../gatsby-queries';
import { FormattedMessage } from 'react-intl';
import ViewableMonitor from '../ui/ViewableMonitor';
import { FormattedDate } from 'react-intl';
import { graphql } from 'gatsby';

const initialState = { open: false };
type State = Readonly<typeof initialState>;

class FaqListItem extends Component<{ data: ContentfulModuleFaqListFragment, isNonFaq?: boolean, defaultExpanded?: boolean }, State> {
	readonly state: State = initialState;

	private wrapper: HTMLDivElement;
	private animationWrapper: HTMLDivElement;
    private listElem: HTMLLIElement;

	private transitioning = false;

    componentDidMount() {
        if(this.props.defaultExpanded) {
            // @ts-ignore
            this.listElem.click();
        }
    }

	private listItemClickHandler = event => {
        if(event.target.nodeName === "A") {
            return
        } else {
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
        }
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
			<li ref={ref => (this.listElem = ref)}  onClick={this.listItemClickHandler} className={`${styles.listItem} ${this.state.open ? styles.open : ''}`} key={this.props.data.id}>
				<div className={styles.questionHeadline}>
                    {
                        // @ts-ignore
                        this.props.isNonFaq ? (
                            <span className={styles.date}>
                                {
                                    // @ts-ignore
                                    new Date(this.props.data.createdAt).getDate()
                                }
                                &nbsp;
                                {
                                    // @ts-ignore
                                    <FormattedDate value={new Date(this.props.data.createdAt)} month={'short'} />
                                }
                                &nbsp;
                                {
                                    // @ts-ignore
                                    new Date(this.props.data.createdAt).getFullYear()
                                }
                            </span>
                        ) : (
                            <span className={styles.label}>
                                <FormattedMessage id={'Q.'} />
                            </span>
                        )
                    }
					<span className={styles.question} tabIndex={0} onKeyDown={this.faqqatabbingfix}>
						{
                            // @ts-ignore
                            this.props.data.question?.question
                        }
					</span>
					<div className={styles.toggleIcon} />
				</div>
				<div ref={ref => (this.animationWrapper = ref)} className={styles.answerWrapper}>
					<div className={styles.answerWrapperInner} ref={ref => (this.wrapper = ref)}>
                        {
                            // @ts-ignore
                            this.props.isNonFaq ? (
                                <span className={`${styles.label} ${styles.labelXl}`}>
                                </span>
                            ) :
                            (
                                <span className={styles.label}>
                                    <FormattedMessage id={'A.'} />
                                </span>
                            )
                        }
						<div
							className={`text-style-body-module ${styles.answer}` + ' ModuleFaqListanswerspan'}
                            // @ts-ignore
							dangerouslySetInnerHTML={{ __html: this.props.data.answer?.childMarkdownRemark.html }}
							tabIndex={-1}
						/>
					</div>
				</div>
			</li>
		);
	}
}

class ModuleFaqList extends Component<{ data: ContentfulModuleFaqListFragment }> {
	render() {
		return (
			<ViewableMonitor>
				<div className={`module-margin`}>
					<ul className={styles.listWrapper}>
						{this.props.data.questions.map(question => (
                            // @ts-ignore
							<FaqListItem key={question.id} data={question} isNonFaq={this.props.data.nonFaqMode} defaultExpanded={this.props.data.defaultExpanded} />
						))}
					</ul>
				</div>
			</ViewableMonitor>
		);
	}
}

export default ModuleFaqList;

export const query = graphql`
	fragment ContentfulModuleFaqListFragment on ContentfulModuleFaqList {
		id
		questions {
			id
            createdAt
			question {
				question
			}
			answer {
				answer
				childMarkdownRemark {
					html
				}
			}
		}
        nonFaqMode
        defaultExpanded
	}
`;