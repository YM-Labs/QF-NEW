import * as React from 'react';
import * as styles from './ModuleMultipleQuotes.module.scss';
import { Component } from 'react';
import { ContentfulModuleMultipleQuotesFragment } from '../../gatsby-queries';
// import { ContentfulModuleMultipleQuotesFragment, ContentfulModuleMultipleQuotesFragment_quotes } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

const initialState = { currentQuote: 0 };
type State = Readonly<typeof initialState>;

class ModuleMultipleQuotes extends Component<{ data: ContentfulModuleMultipleQuotesFragment }, State> {
	private refQuoteWrapper: HTMLDivElement;
	readonly state: State = initialState;
	private refsQuote = []

	constructor(props) {
		super(props);

		if(this.props.data.quotes) {
			for(let index = 0; index < this.props.data.quotes.length; index++) {
				this.refsQuote[index] = React.createRef()
			}
		}

	}

	public componentDidMount() {
		window.addEventListener('resize', this.resize);
		this.resize();
	}

	resize = () => {
		if(this.refsQuote.length <= 0) return
		let isMobile = (typeof window !== 'undefined') && window.innerWidth <= 767;
		let height = 0
		if(isMobile) {
			height = this.refsQuote[this.state.currentQuote].current.getBoundingClientRect().height;
		} else {
			this.refsQuote.forEach(quote => {
				if(quote.current) {
					let rect = quote.current.getBoundingClientRect();
					if (rect.height > height)
						height = rect.height;
				}
			});
		}
		if(this.refQuoteWrapper) {
			this.refQuoteWrapper.style.height = height + 'px';
		}
	};

	onAuthorClick = (index) => {
		let isMobile = (typeof window !== 'undefined') && window.innerWidth <= 767;
		if(isMobile && this.refsQuote[index].current) {
			let rect = this.refsQuote[index].current.getBoundingClientRect();
			if(this.refQuoteWrapper) {
				this.refQuoteWrapper.style.height = rect.height + 'px';
			}
		}

		this.setState({ currentQuote: index });
	};

	render() {
		return (
			<div className={`module-margin ${styles.wrapper}`}>
				<ViewableMonitor>
					<div className={styles.inner}>
						<ul className={styles.quotesAuthorsList}>
							{this.props.data.quotes && this.props.data.quotes.map((quote, index) => (
								<li className={`${styles.quotesAuthor} ${index === this.state.currentQuote ? styles.isActive : ''}`} key={'author_' + quote.id + index}
									onClick={() => this.onAuthorClick(index)}>
									<div>
										<p className={styles.authorName}>{quote.quoteAuthorName}</p>
										<p className={styles.authorTitle}>{quote.quoteAuthorTitle}</p>
									</div>
								</li>
							))}
						</ul>
						<div className={styles.quoteList}>
							<div ref={ref => (this.refQuoteWrapper = ref)} className={styles.quotesWrapper}>
								{this.props.data.quotes && this.props.data.quotes.map((quote, index) => (
									<div ref={this.refsQuote[index]} key={'quote_' + quote.id + index}
										 className={`text-style-quote ${styles.quote} ${index === this.state.currentQuote ? styles.isActive : ''}`}
										 dangerouslySetInnerHTML={{ __html: quote.quoteText.quoteText }} />
								))}
							</div>
						</div>
					</div>
				</ViewableMonitor>
			</div>
		);
	}
}

export default ModuleMultipleQuotes;

export const query = graphql`
	fragment ContentfulModuleMultipleQuotesFragment on ContentfulModuleMultipleQuotes {
		id
		quotes {
			id
			quoteText {
				quoteText
			}
			quoteAuthorName
			quoteAuthorTitle
		}
	}
`;
