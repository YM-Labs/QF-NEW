import * as React from 'react';
import ReactDOM from 'react-dom';
import * as styles from './SearchAdvanced.module.scss';
import { IPageProps } from '../../templates/PageWrapper';
import { SwiftypeAPI, SwiftypeAPIResponse } from '../../utils/SwiftypeAPI';
import { FormattedMessage, injectIntl, useIntl } from 'react-intl';
import * as Qs from 'qs';
import { PageOverviewQuery, PageSearchQuery_allContentfulFilterProgramType } from '../../gatsby-queries';
import { SearchAdvancedResults } from './SearchAdvancedResults';
import { cloneObject, convertFalseToUndefined, deepCompare, mergeLoadState } from './SearchUtils';
import ViewableMonitor from '../ui/ViewableMonitor';
import useDarkMode from 'use-dark-mode';
import ContentLoader from 'react-content-loader';
import { Globals } from '../../utils/Globals';
import Select from 'react-select';

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

const Loader = props => {
	const darkMode = useDarkMode(false);
	let primaryColor = '#f3f3f3';
	let secondaryColor = '#ecebeb';

	if (darkMode.value) {
		primaryColor = '#1D1F21';
		secondaryColor = '#000000';
	}
	return (
		<>
			{!isMobile && (
				<ContentLoader
					height="80"
					width="1250"
					speed={2}
					backgroundColor={primaryColor}
					foregroundColor={secondaryColor}
					rtl={Globals.CURRENT_LANGUAGE_PREFIX == 'ar/' ? true : false}
					{...props}
				>
					<rect x="0" y="40" rx="5" ry="5" width="164" height="12" />
					<rect fill="#113629" x="325" y="30" rx="5" ry="5" width="95" height="12" />
					<rect x="425" y="30" rx="5" ry="5" width="95" height="12" />
					<rect x="325" y="50" rx="5" ry="5" width="450" height="12" />
				</ContentLoader>
			)}
			{isMobile && (
				<ContentLoader
					height="50"
					width="400"
					speed={2}
					backgroundColor={primaryColor}
					foregroundColor={secondaryColor}
					rtl={Globals.CURRENT_LANGUAGE_PREFIX == 'ar/' ? true : false}
					{...props}
				>
					<rect x="0" y="10" rx="5" ry="5" width="54" height="5" />
					<rect fill="#113629" x="95" y="15" rx="5" ry="5" width="195" height="7" />
					<rect x="95" y="0" rx="5" ry="5" width="90" height="7" />
				</ContentLoader>
			)}
		</>
	);
};

const initialState = {
	resultData: null,
	loading: false,
	currentPage: 1,
	loadMore: false,
	allPages: [],
	isLoading: false,
	total_result_count: 0,
	currentType: null,
	initLoad: true,
	filters: {
		page: {
			type: ['expert_profile']
		},
		currTypeFilters: {
			filter_expert_expertise: [],
			filter_entity: []
		}
	}
};

type State = {
	currentType: any;
	initLoad: boolean;
	allPages: Readonly<typeof initialState.allPages>;
	currentPage: Readonly<typeof initialState.currentPage>;
	loadMore: Readonly<typeof initialState.loadMore>;
	isLoading: Readonly<typeof initialState.isLoading>;
	total_result_count: Readonly<typeof initialState.total_result_count>;
	loading: boolean;
	resultData: SwiftypeAPIResponse | null;
	filters: Readonly<typeof initialState.filters>;
	screen: string;
};

class SearchExperts extends React.Component<{
	intl: ReturnType<typeof useIntl>;
	filterData: PageOverviewQuery;
	currLanguage: IPageProps['pageContext']['languageCode'];
},
	State> {
	readonly state: State = cloneObject(initialState);

	private refInput: HTMLInputElement;
	// @ts-ignore
	private refSearchWrapper: HTMLDivElement;

	private swiftypeAPI: SwiftypeAPI = new SwiftypeAPI('aPuy66m8yLwUAuJ_ssRK');

	private filterOptions: { messageID: string; swiftype: string; data: PageSearchQuery_allContentfulFilterProgramType }[];

	private selectLists: { [key: string]: HTMLSelectElement } = {};

	private currSearchQuery: string = '';

	private loadFilterState = null;

	constructor(props) {
		super(props);

		this.filterOptions = [
			{ messageID: 'expertise', swiftype: 'filter_expert_expertise', data: this.props.filterData.allContentfulFilterExpertProfileExpertise },
			// @ts-ignore
			{ messageID: 'entity', swiftype: 'filter_entity', data: this.props.filterData.allContentfulEntities }
		];

		//Load initial state from hash:
		if (typeof window !== 'undefined') {
			this.loadFilterState = this.getFilterStateFromHash();
/*			setTimeout(() => {
				console.log('get state 2');
				this.setState({filters: this.loadFilterState});
				// this.state.filters = this.getFilterStateFromHash()
			}, 100);*/
		}

		if (isMobile) {
			this.state.screen = 'mobile';
		} else {
			this.state.screen = 'desktop';
		}

		this.handlePagination = this.handlePagination.bind(this);
	}

	handlePagination(num) {
		this.setState(
			{
				currentPage: Number(num.target.id)
			},
			async () => {
				try {
					this.submitHandler();
				} catch {
				}
			}
		);

		this.state.isLoading = true;
		ReactDOM.findDOMNode(this.refs[num.target.id])['id'] = num;
	}

	private ImageList = () => (
		<React.Fragment>
			{Array(5)
				.fill('')
				.map((i, index) => (
					<Loader screen={this.state.screen} key={'index' + index} style={{ opacity: Number(2 / i).toFixed(1) }} />
				))}
		</React.Fragment>
	);

	private searchFilters = () => {
		let filters = {
			page: {
				language: this.props.currLanguage === 'ar-QA' ? 'ar' : 'en',
				type: ['expert_profile']
			}
		};
		for (var prop in [this.state.filters.currTypeFilters]) {
			if ([this.state.filters.currTypeFilters].hasOwnProperty(prop)) {
				var innerObj = {};
				innerObj[0] = [this.state.filters.currTypeFilters][prop];
				filters.page[Object.keys(innerObj[0])[0]] = Object.values(innerObj[0])[0];
				filters.page[Object.keys(innerObj[0])[1]] = Object.values(innerObj[0])[1];
			}
		}

		return filters;
	};

	private getFilterStateFromHash() {
		if (typeof window === 'undefined') {
			return cloneObject(initialState.filters);
		}

		let hash = window.location.hash;
		if (typeof hash === 'string' && hash.length > 1) {
			hash = hash.substring(1, hash.length);
			const loadState = Qs.parse(hash, { arrayFormat: 'brackets' });

			this.currSearchQuery = loadState.s ? loadState.s : '';
			delete loadState.s;

			let initState = cloneObject(this.state.filters);
			mergeLoadState(loadState, initState);

			return initState;
		} else {
			return cloneObject(initialState.filters);
		}
	}

	componentDidMount() {
		this.setState({filters: this.loadFilterState});
		this.submitHandler();
		const loadState = typeof window !== 'undefined' ? Qs.parse(window.location.hash, { arrayFormat: 'brackets' }) : null;
		var currentType = loadState.types && Object.keys(loadState.types)[0];
		this.setState({ currentType: currentType });
	}

	componentDidUpdate = (prevProps, prevState: State) => {
		/*		if (this.state.filters.types !== prevState.filters.types) {
					this.state.currentPage = 1;
					this.state.sameType = false;
				}*/
		if (prevProps.currLanguage !== this.props.currLanguage) {
			// this.swiftype.clear();
		}
		if (deepCompare(this.state.filters, prevState.filters) === false) {
			this.submitHandler();
		}
		this.state.resultData ? (this.state.total_result_count = this.state.resultData.info.page.total_result_count) : 0;
	};

	private noInput() {
		return false; //this.currSearchQuery === '' && this.state.filters.currTypeFilters.filter_entity.length === 0 && this.state.filters.currTypeFilters.filter_expert_subjects.length === 0;
	}

	private submitHandler = (event = null) => {
		if (event) {
			event.preventDefault();
		}
		this.currSearchQuery = this.refInput.value;

		//Copy state:
		let queryFilters = cloneObject(this.state.filters);

		//Convert false to undefined to avoid having untoggled filters in query hash.
		convertFalseToUndefined(queryFilters);

		//Add search string to query filters:
		queryFilters.s = this.currSearchQuery;

		//Set window hash:
		window.location.hash = Qs.stringify(queryFilters, { encode: false, arrayFormat: 'brackets' });

		if (this.noInput()) {
			if (this.state.resultData !== null) {
				this.swiftypeAPI.abort();
				this.setState({ resultData: null, loading: false });
			}
			return false;
		} else {
			//Submit search request:
			if (this.state.loading === false) {
				this.setState({ loading: true });
			}
			let config = {
				filters: this.searchFilters(),
				per_page: 100,
				page: this.state.currentPage
			};

			(config as any).sort_field = { page: 'title' };
			(config as any).sort_direction = { page: 'asc' };

			/*			if (config.filters.page.type[0] === 'press_media_mention') {
							// @ts-ignore
							var allMediaMention = this.props.filterData.allContentfulPressMediaMention.edges;

							var results = {
								record_count: allMediaMention.length,
								records: {
									page: allMediaMention
								},
								info: {
									page: {
										query: '',
										current_page: 1,
										num_pages: 1,
										per_page: 100,
										total_result_count: allMediaMention.length / 2,
										facets: {}
									}
								},
								errors: {}
							};
							// @ts-ignore
							this.submitResponseHandler(results);
						} else {*/
			this.swiftypeAPI.query(this.refInput.value, this.submitResponseHandler, config);
			// }
		}
		return false;
	};

	private submitResponseHandler = (response: SwiftypeAPIResponse) => {
		if (this.noInput() !== true && deepCompare(this.state.resultData, response) === false) {
			this.setState({ resultData: response });
		}
		if (this.state.loading === true) {
			this.setState({ loading: false });
		}
	};

	private inputChangeHandler = () => {
		this.submitHandler();
	};

	public shiftfocustoresults = event => {
		if (event.key == 'Enter') {
			document.getElementById('searchresultsfounddisplayed').focus();
		}
	};

	private onSelectChangeHandler = (selectedOptions, listSwiftypeId) => {
		let filters = cloneObject(this.state.filters);
		filters.currTypeFilters[listSwiftypeId] = selectedOptions ? selectedOptions.map(option => option.value) : [] ;
		filters.upcoming = false;
		this.setState({ filters: filters });
		this.submitHandler();
	};

	private setSpellingSuggestion = event => {
		if (event) {
			event.preventDefault();
		}
		this.refInput.value = event.target.dataset.spellingSuggestion;
		this.submitHandler();
	};

	render() {
		let { loadMore } = this.state;
		let pageNumbers = [];
		let renderPageNumbers = [];

		for (let i = 1; i <= Math.ceil(this.state.total_result_count / 100); i++) {
			if (i != 1) {
				pageNumbers.push(i);
			}
		}

		if (pageNumbers.length == 0) {
			loadMore = false;
		}

		let next = this.state.resultData && this.state.resultData.info.page.current_page + 1;
		renderPageNumbers = pageNumbers.map(page => {
			loadMore = true;
			if (page == next) {
				return (
					loadMore && (
						/*
                        <a
                            className="text-style-body EventsList-module--ctaLink--3HOUv searchList"
                            // @ts-ignore
                            id={page}
                            href="javascript:void(0)"
                            ref={page}
                            onClick={this.handlePagination.bind(this)}
                        >
                            Load more&#160;&#160;
                        </a>
                        */
						<a id={page} ref={page} onClick={this.handlePagination} href="javascript:void(0)" className={styles.clickable}>
							<span id={page} ref={page} onClick={this.handlePagination} className={styles.dot} />
							<span id={page} ref={page} onClick={this.handlePagination} className={styles.dot} />
							<span id={page} ref={page} onClick={this.handlePagination} className={styles.dot} />
						</a>
					)
				);
			}
		});
		let resultsMessage = this.props.intl.formatMessage({ id: 'No results' });
		let spellingSuggestion = undefined;

		if (this.state.resultData && this.state.resultData.record_count !== 0) {
			resultsMessage =
				this.state.resultData.record_count > 1
					? this.props.intl.formatMessage({ id: 'search.result.plural' }, { value: this.state.resultData.info.page.total_result_count })
					: this.props.intl.formatMessage({ id: 'search.result.singular' });
		} else if (this.state.resultData && this.state.resultData.info.page.spelling_suggestion) {
			spellingSuggestion = (
				<FormattedMessage
					id="search.result.spellingsuggestion"
					values={{
						link: (
							<a onClick={this.setSpellingSuggestion} href="#" data-spelling-suggestion={this.state.resultData.info.page.spelling_suggestion.text}>
								{this.state.resultData.info.page.spelling_suggestion.text}
							</a>
						)
					}}
				/>
			);
			resultsMessage = resultsMessage + '. ';
		}
		return (
			<div className={`container no-gutters`}>
				<ViewableMonitor disabled={true}>
					<form className={'container'} onSubmit={this.submitHandler}>
						<div className={styles.expertFilters}>
							<div className={styles.inputWrapper}>
								<input
									autoComplete="off"
									className={styles.inputField}
									onChange={this.inputChangeHandler}
									ref={ref => (this.refInput = ref)}
									placeholder={this.props.intl.formatMessage({ id: 'Search' })}
									type="text"
									defaultValue={this.currSearchQuery}
									id={'search_advanced_page_input'}
									aria-label={'searchadvancedpageinput'}
									title={'searchadvancedpageinput'}
									onKeyDown={this.shiftfocustoresults}
								/>
								<button className={styles.submitButton} type="submit" tabIndex={0}>
									{this.props.intl.formatMessage({ id: 'Search' })}
								</button>
							</div>
							<div className={styles.filters}>
								<div className={styles.typeFilterSelectLists}>
									{this.filterOptions.map((options, index) => {
										const values = [];
										const optionsSet = options.data.edges.sort((a, b) => a?.node?.title?.localeCompare(b?.node?.title))
										.filter(function (e) {
											return (
												e.node?.title !== 'Academia' && e.node?.title !== 'Education' && e.node?.title !== 'Community' && e.node?.title !== 'Research' &&
												e.node?.title !== 'الأكاديمية' && e.node?.title !== 'التعليم' && e.node?.title !== 'المجتمع' && e.node?.title !== 'البحوث'
											);
										})
										.map(node => {
											if (this.state.filters.currTypeFilters[options.swiftype].indexOf(node.node.contentful_id) >= 0) {
												values.push({value: node.node.contentful_id, label: node.node.title, swiftypeId: options.swiftype});
											}
											
											return {value: node.node.contentful_id, label: node.node.title, swiftypeId: options.swiftype};
											
										});

										return (
											<div key={index} className="SelectList subsubfilterstabindexcheck">
												<label tabIndex={-1} htmlFor={'_title_' + options.swiftype}>
													<FormattedMessage id={index === 0 ? 'expertise' : 'search_filter_list_' + options.messageID} />
												</label>
												<Select
													isRtl={Globals.CURRENT_LANGUAGE_PREFIX == 'ar/'}
													placeholder={this.props.intl.formatMessage({id: 'select_dropdown'})}
													className={'select-container'}
													classNamePrefix={'select'}
													id={options.swiftype}
													value={values}
													onChange={(values) => this.onSelectChangeHandler(values, options.swiftype)}
													options={optionsSet}
													isMulti
                                                    // @ts-ignore
													ref={ref => (this.selectLists[options.swiftype] = ref)}
													key={options.swiftype}
												/>
											</div>
										);
									})}
								</div>
							</div>
						</div>
						<div className={styles.resultsLabel} id={'searchresultsfounddisplayed'} tabIndex={0}>
									{this.state.resultData && resultsMessage}
							{spellingSuggestion}
								</div>
					</form>
				</ViewableMonitor>
				<div ref={ref => (this.refSearchWrapper = ref)} className={`${styles.searchWrapper} ${this.state.loading ? styles.loading : ''}`}>
					<div>
						{this.state.resultData && this.state.resultData.info.page.current_page >= 1 && (
							<ViewableMonitor>
								<SearchAdvancedResults
									expertMode={true}
									filterData={this.props.filterData}
									messageNoSearchStarted={this.props.intl.formatMessage({ id: 'messageNoSearchStarted' })}
									setSpellingSuggestion={this.setSpellingSuggestion}
									resultData={this.state.resultData}
									sameType={true}
									options={this.state.filters}
								/>
							</ViewableMonitor>
						)}
						<br />
						<ViewableMonitor>
							<div>
								{this.state.loading &&
								/** Dot animation loader
								<div className={styles.dot_flashing} />*/

								/** Skeleton loader */
								this.ImageList()}
							</div>
						</ViewableMonitor>
						<br />
						{/*{renderPageNumbers && Object.values(this.state.filters.types).includes(true) && !this.state.loading ? renderPageNumbers : null}*/}
						{renderPageNumbers && !this.state.loading ? renderPageNumbers : null}
					</div>
				</div>
			</div>
		);
	}
}

export default injectIntl(SearchExperts);
