import * as React from 'react';
import ReactDOM from 'react-dom';
import * as styles from './SearchAdvanced.module.scss';
import { TweenMax } from 'gsap/dist/gsap.min';
import { IPageProps } from '../../templates/PageWrapper';
import { SwiftypeAPI, SwiftypeAPIResponse } from '../../utils/SwiftypeAPI';
import { FormattedMessage, injectIntl, useIntl } from 'react-intl';
import * as Qs from 'qs';
import { PageSearchQuery, PageSearchQuery_allContentfulFilterProgramType } from '../../gatsby-queries';
import { SearchAdvancedResults } from './SearchAdvancedResults';
import { EASE_CUSTOM_IN_OUT } from '../../utils/Constants';
import { convertFalseToUndefined, mergeLoadState, cloneObject, deepCompare } from './SearchUtils';
import ViewableMonitor from '../ui/ViewableMonitor';
import useDarkMode from 'use-dark-mode';
import ContentLoader from 'react-content-loader';
import { Globals } from '../../utils/Globals';

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
	filtersVisible: false,
	loading: false,
	currentPage: 1,
	sameType: true,
	loadMore: false,
	allPages: [],
	isLoading: false,
	total_result_count: 0,
	currentType: null,
	initLoad: true,
	filters: {
		all: true,
		allType: true,
		verticals: {
			education: false,
			research: false,
			community: false
		},
		types: {
			school: false,
			university: false,
			program: false,
			place: false,
			entity: false,
			article: false,
			event: false,
			people: false,
			page: false,
			press_release: false,
			press_media_mention: false,
			spokes_people: false,
			ecss: false
		},
		currTypeFilters: {}
	}
};

type State = {
	currentType: any;
	initLoad: boolean;
	allPages: Readonly<typeof initialState.allPages>;
	sameType: Readonly<typeof initialState.sameType>;
	currentPage: Readonly<typeof initialState.currentPage>;
	loadMore: Readonly<typeof initialState.loadMore>;
	isLoading: Readonly<typeof initialState.isLoading>;
	total_result_count: Readonly<typeof initialState.total_result_count>;
	loading: boolean;
	filtersVisible: boolean;
	resultData: SwiftypeAPIResponse | null;
	filters: Readonly<typeof initialState.filters>;
	screen: string;
};

class SearchAdvanced extends React.Component<
	{
		intl: ReturnType<typeof useIntl>;
		filterData: PageSearchQuery;
		currLanguage: IPageProps['pageContext']['languageCode'];
	},
	State
> {
	readonly state: State = cloneObject(initialState);

	private refInput: HTMLInputElement;
	// @ts-ignore
	private refSearchWrapper: HTMLDivElement;

	private swiftypeAPI: SwiftypeAPI = new SwiftypeAPI('aPuy66m8yLwUAuJ_ssRK');

	// @ts-ignore
	private refVerticalAllCheckbox: HTMLInputElement;
	private refVerticalCheckboxes: HTMLInputElement[] = [];

	// @ts-ignore
	private refTypeAllCheckbox: HTMLInputElement;
	private refTypeCheckboxes: HTMLInputElement[] = [];

	private filterOptionsForTypes: { [key: string]: { messageID: string; swiftype: string; data: PageSearchQuery_allContentfulFilterProgramType }[] } = {};
	private selectLists: { [key: string]: HTMLSelectElement[] } = {};

	private refFiltersCollapser: HTMLDivElement;
	private refFiltersCollapserInner: HTMLDivElement;

	private activeFilterTypes: string[];

	private currSearchQuery: string = '';

	constructor(props) {
		super(props);

		this.activeFilterTypes = Object.keys(this.state.filters.types);

		//Setup select list array:
		Object.keys(this.state.filters.types).forEach(type => (this.selectLists[type] = []));

		let nowDate = new Date();

		nowDate.setDate(1);
		let monthList = {
			edges: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
				nowDate.setMonth(month);
				return { node: { title: this.props.intl.formatDate(nowDate, { month: 'long' }), contentful_id: month.toString() } };
			})
		};
		let yearList = { edges: [] };
		let currYear = new Date().getFullYear() + 3;
		if (currYear < 2018 + 3) {
			currYear = 2018 + 3;
		}
		for (let i = 2014; i < currYear; i++) {
			yearList.edges.push({ node: { title: i, contentful_id: i + '' } });
		}

		let partOfQFList = { edges: [{ node: { title: 'Yes', contentful_id: 'true' } }, { node: { title: 'No', contentful_id: 'false' } }] };

		//add filter select options per type:
		this.filterOptionsForTypes['program'] = [
			{ messageID: 'type', swiftype: 'filter_program_type', data: this.props.filterData.allContentfulFilterProgramType },
			// @ts-ignore
			{ messageID: 'entity', swiftype: 'filter_entity', data: this.props.filterData.allContentfulEntities }
		];

		this.filterOptionsForTypes['event'] = [
			{ messageID: 'category', swiftype: 'filter_event_category', data: this.props.filterData.allContentfulCategory },
			{ messageID: 'type', swiftype: 'filter_event_type', data: this.props.filterData.allContentfulEventType },
			// @ts-ignore
			{ messageID: 'entity', swiftype: 'filter_organiser', data: this.props.filterData.allContentfulEntities },
			{ messageID: 'tags', swiftype: 'filter_event_tags', data: this.props.filterData.allContentfulEventTag },
			{ messageID: 'campaign', swiftype: 'filter_campaign', data: this.props.filterData.allContentfulPageCampaign },
			{ messageID: 'place', swiftype: 'filter_place', data: this.props.filterData.allContentfulPlace },
			{ messageID: 'month', swiftype: 'filter_month', data: monthList },
			{ messageID: 'year', swiftype: 'filter_year', data: yearList }
		];

		this.filterOptionsForTypes['article'] = [
			// @ts-ignore
			{ messageID: 'entity', swiftype: 'filter_entity', data: this.props.filterData.allContentfulEntities },
			{ messageID: 'program', swiftype: 'filter_program', data: this.props.filterData.allContentfulPageProgram },
			{ messageID: 'tags', swiftype: 'filter_article_tags', data: this.props.filterData.allContentfulFilterArticleTag },
			{ messageID: 'month', swiftype: 'filter_month', data: monthList },
			{ messageID: 'year', swiftype: 'filter_year', data: yearList }
		];

		this.filterOptionsForTypes['place'] = [
			{ messageID: 'type', swiftype: 'filter_place_category', data: this.props.filterData.allContentfulFilterPlaceCategory },
			{ messageID: 'part_of_qatar', swiftype: 'filter_is_qf', data: partOfQFList }
		];
		this.filterOptionsForTypes['entity'] = [{ messageID: 'part_of_qatar', swiftype: 'filter_is_qf', data: partOfQFList }];

		this.filterOptionsForTypes['school'] = [{ messageID: 'type', swiftype: 'filter_school_types', data: this.props.filterData.allContentfulFilterSchoolType }];

		this.filterOptionsForTypes['people'] = [
			{ messageID: 'department', swiftype: 'filter_department', data: this.props.filterData.allContentfulFilterPersonaDepartment },
			{ messageID: 'program', swiftype: 'filter_program', data: this.props.filterData.allContentfulPageProgram },
			// @ts-ignore
			{ messageID: 'entity', swiftype: 'filter_entity', data: this.props.filterData.allContentfulEntities }
		];

		this.filterOptionsForTypes['press_release'] = [
			{ messageID: 'tags', swiftype: 'filter_press_release_tags', data: this.props.filterData.allContentfulFilterPressReleaseTag },
			// @ts-ignore
			{ messageID: 'entity', swiftype: 'filter_entity', data: this.props.filterData.allContentfulEntities },
			{ messageID: 'month', swiftype: 'filter_month', data: monthList },
			{ messageID: 'year', swiftype: 'filter_year', data: yearList }
		];

		//Load initial state from hash:
		if (typeof window !== 'undefined') {
			this.state.filters = this.getFilterStateFromHash();
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
				} catch {}
			}
		);

		this.state.isLoading = true;
		ReactDOM.findDOMNode(this.refs[num.target.id])['id'] = num;
	}

	private ImageList = () => (
		<React.Fragment>
			{Array(5)
				.fill('')
				.map(i => (
					<Loader screen={this.state.screen} key={i} style={{ opacity: Number(2 / i).toFixed(1) }} />
				))}
		</React.Fragment>
	);

	private searchFilters = () => {
		let filters = {
			page: {
				language: this.props.currLanguage === 'ar-QA' ? 'ar' : 'en',
				tags_vertical: [],
				type: []
			}
		};

		if (this.state.filters.all === false) {
			this.refVerticalCheckboxes.forEach(input => (input.checked ? filters.page.tags_vertical.push(input.dataset.swiftValue) : null));
		}

		if (this.state.filters.allType === false) {
			let selectedType = null;
			//Only allow one selected type at a time:
			this.refTypeCheckboxes.forEach(input => {
				if (input.checked) {
					selectedType = input.dataset.swiftValue;
					filters.page.type.push(selectedType);
				}
			});

			const skipDateFilterLists = selectedType === 'press_release' || selectedType === 'article' || selectedType === 'event';
			//Add type specific select list filters:
			this.selectLists[selectedType] &&
				Object.keys(this.selectLists[selectedType]).forEach(key => {
					const list = this.selectLists[selectedType][key];
					const filterName = list.dataset.swiftypeValue;
					if (list.selectedIndex > 0) {
						if (filterName !== 'filter_year' && filterName !== 'filter_month') {
							filters.page[filterName] = list.options[list.selectedIndex].value;
						}
					}
				});
			for (var prop in [this.state.filters.currTypeFilters]) {
				if ([this.state.filters.currTypeFilters].hasOwnProperty(prop)) {
					var innerObj = {};
					innerObj[0] = [this.state.filters.currTypeFilters][prop];
					filters.page[Object.keys(innerObj[0])[0]] = Object.values(innerObj[0])[0];
				}
			}
			if (skipDateFilterLists) {
				const yearList = this.selectLists[selectedType]['filter_year'];
				const monthList = this.selectLists[selectedType]['filter_month'];
				const searchField = selectedType === 'event' ? 'filter_start_date' : 'filter_date';

				// @ts-ignore
				if (this.state.filters.upcoming) {
					filters.page[searchField] = {
						type: 'range',
						from: new Date().toDateString()
					};
				} else {
					if (yearList.selectedIndex > 0) {
						let from = new Date();
						if (yearList.selectedIndex > 0) {
							from.setFullYear(yearList.options[yearList.selectedIndex].value);
						}
						if (monthList.selectedIndex > 0) {
							from.setMonth(monthList.options[monthList.selectedIndex].value);
						} else {
							from.setMonth(0);
						}
						from.setDate(1);
						from.setHours(0, 0, 0, 0);
						let to = new Date(from.getFullYear(), monthList.selectedIndex > 0 ? from.getMonth() + 1 : 12, 0);

						filters.page[searchField] = {
							type: 'range',
							from: from.toDateString(),
							to: to.toDateString()
						};
					}
				}
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

			if (loadState.all === false || !loadState.all) {
				initState.all = false;
			}
			const hasTypeFilter = Object.values(initState.types).findIndex(value => value === true);
			if (loadState.allType === false || hasTypeFilter >= 0) {
				initState.allType = false;
			}
			return initState;
		} else {
			return cloneObject(initialState.filters);
		}
	}

	componentDidMount() {
		this.submitHandler();
		if (this.state.filters.allType === false && !this.state.filtersVisible) {
			this.toggleFilterVisibility(null, true);
		}
		const loadState = typeof window !== 'undefined' ? Qs.parse(window.location.hash, { arrayFormat: 'brackets' }) : null;
		var currentType = loadState.types && Object.keys(loadState.types)[0];
		this.setState({ currentType: currentType });
		typeof window !== 'undefined' ? document.getElementById('toggleFilterVisibility').click() : null;
	}

	componentDidUpdate = (prevProps, prevState: State) => {
		if (this.state.filters.types !== prevState.filters.types) {
			this.state.currentPage = 1;
			this.state.sameType = false;
		}
		if (prevProps.currLanguage !== this.props.currLanguage) {
			// this.swiftype.clear();
		}
		if (deepCompare(this.state.filters, prevState.filters) === false) {
			this.submitHandler();
			if (deepCompare(this.state.filters.types, this.state.filters.types) || this.state.filters.allType !== prevState.filters.allType) {
				this.setFilterCollapserHeight();
			}
		}
		this.state.resultData ? (this.state.total_result_count = this.state.resultData.info.page.total_result_count) : 0;
	};

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

		if (this.state.filters.allType && this.state.filters.all && this.currSearchQuery === '') {
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
			if (config.filters.page.type.indexOf('press_release') >= 0 || config.filters.page.type.indexOf('article') >= 0) {
				(config as any).sort_field = { page: 'filter_date' };
				// @ts-ignore
			} else if (config.filters.page.type.indexOf('event') >= 0 && !config.filters.upcoming) {
				(config as any).sort_field = { page: 'filter_start_date' };
			}

			// @ts-ignore
			if (queryFilters.upcoming && config.filters.page.type[0] === 'event') {
				(config as any).sort_field = { page: 'filter_start_date' };
				(config as any).sort_direction = { page: 'asc' };
			}

			if (config.filters.page.type[0] === 'spokes_people') {
				(config as any).sort_field = { page: 'title' };
				(config as any).sort_direction = { page: 'asc' };
			}

			if (config.filters.page.type[0] === 'ecss') {
				(config as any).sort_field = { page: 'title' };
				(config as any).sort_direction = { page: 'asc' };
			}

			if (config.filters.page.type[0] === 'press_media_mention') {
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
			} else {
				this.swiftypeAPI.query(this.refInput.value, this.submitResponseHandler, config);
			}
		}
		return false;
	};

	private submitResponseHandler = (response: SwiftypeAPIResponse) => {
		if (!(this.state.filters.allType && this.state.filters.all && this.currSearchQuery === '') && deepCompare(this.state.resultData, response) === false) {
			if (this.state.filters.types.press_media_mention) {
				return this.setState({ resultData: response });
			}
			this.setState({ resultData: response });
		}
		if (this.state.loading === true) {
			this.setState({ loading: false });
		}
	};

	private inputChangeHandler = () => {
		this.submitHandler();
	};

	private onVerticalChangeHandler = event => {
		const target = event.target;
		let filters = cloneObject(this.state.filters);

		const value = target.type === 'checkbox' ? target.checked : target.value;
		if (filters.all) {
			filters.all = false;
			filters.verticals.education = false;
			filters.verticals.community = false;
			filters.verticals.research = false;
		}
		if (target.name) {
			filters.verticals[target.name] = value;
		}
		filters.upcoming = false;
		this.setState({ filters });
	};

	private onTypeChangeHandler = event => {
		const target = event.target;
		let filters = cloneObject(this.state.filters);

		const value = target.type === 'checkbox' ? target.checked : target.value;
		if (filters.allType) {
			filters.allType = false;
		}
		Object.keys(filters.types).forEach(key => (filters.types[key] = false));
		if (target.name) {
			filters.types[target.name] = value;
		}

		filters.currTypeFilters = {};
		this.state.currentType = target.name;

		filters.upcoming = false;

		if (!deepCompare(filters.types, this.state.filters.types)) {
			this.fixFilterCollapseHeight();
			this.setState({ filters });
		}
	};

	private toggleAll = () => {
		let filters = cloneObject(this.state.filters);
		filters.all = !filters.all;
		filters.upcoming = false;
		this.setState({ filters });
	};

	public filteraccesibility = event => {
		if (event.key == 'Enter') {
            document.getElementById(event.target.id).click()
            document.getElementById(event.target.id).focus()
 
			var checklabeltabindex = document.getElementById('thesubfilterslabelcheck') && document.getElementById('thesubfilterslabelcheck').getAttribute('tabindex');
			var thesubfilterssubchecklabeltabindex = document.getElementById('thesubfilterssublabelcheck') && document.getElementById('thesubfilterssublabelcheck').getAttribute('tabindex');

			if (checklabeltabindex == '0') {
				document.getElementsByClassName('subfilterscontainerdiv')[0].getElementsByTagName('label')[0].setAttribute('tabindex', '-1');
			} else if (checklabeltabindex == '-1') {
                document.getElementsByClassName('subfilterscontainerdiv')[0].getElementsByTagName('label')[0].setAttribute('tabindex', '0');
			}

			if (thesubfilterssubchecklabeltabindex == '0') {
                document.getElementsByClassName('subsubfilterstabindexcheck')[0].getElementsByTagName('select')[0].setAttribute('tabindex', '-1');
			} else if (thesubfilterssubchecklabeltabindex == '-1') {
                document.getElementsByClassName('subsubfilterstabindexcheck')[0].getElementsByTagName('select')[0].setAttribute('tabindex', '0');
			}
		}
	};

	public filtercheckaccesibility = event => {
		if (event.key == 'Enter') {
            document.getElementById(event.target.id).click()
			document.getElementById(event.target.id).focus()
		}
	};

	public shiftfocustoresults = event => {
		if (event.key == 'Enter') {
			document.getElementById('searchresultsfounddisplayed').focus();
		}
	};

	public shiftfocustosearchresults = event => {
		if (event.key == 'Enter') {
			document.getElementById('searchresultsfounddisplayed').focus();
		}
	};

	public fixonkeydown = event => {
		if (event.key == 'Enter') {
			document.getElementById(event.target.id).click()
			var parent = document.getElementById('typeFilterSelectLists')
			var parentchild = parent.childNodes;
			window.setTimeout(function() {
				document.getElementById('mapnavtopbackbtn').focus();
				parentchild.forEach((elem) => {
                    // @ts-ignore
					var dispaycheck = window.getComputedStyle(elem).display;
					if (dispaycheck == 'block') {
						//Your code here
						var theanswershift = elem.childNodes[0].childNodes[1]
                        // @ts-ignore
						theanswershift.focus();
					}
				});
			}, 300);
			document.getElementById(event.target.id).focus()
		}
	};

	private toggleAllTypes = () => {
		let filters = cloneObject(this.state.filters);
		if (!filters.allType) {
			filters.allType = true;
			Object.keys(filters.types).forEach(key => (filters.types[key] = false));
			this.fixFilterCollapseHeight();
		}
		filters.upcoming = false;
		this.setState({ filters });
	};

	private onSelectChangeHandler = () => {
		//Add type specific select list filters:

		let selectedType = null;
		Object.keys(this.state.filters.types).forEach(key => {
			if (this.state.filters.types[key] === true) {
				selectedType = key;
			}
		});

		let stateCurrTypeFilters = {};

		Object.keys(this.selectLists[selectedType]).forEach(key => {
			const list = this.selectLists[selectedType][key];
			const filterName = list.dataset.swiftypeValue;
			if (list.selectedIndex > 0) {
				stateCurrTypeFilters[filterName] = list.options[list.selectedIndex].value;
			}
		});
		let filters = cloneObject(this.state.filters);
		filters.currTypeFilters = stateCurrTypeFilters;
		filters.upcoming = false;
		this.setState({ filters: filters });
		document.getElementById('searchresultsfounddisplayed').focus();
	};

	private setSpellingSuggestion = event => {
		if (event) {
			event.preventDefault();
		}
		this.refInput.value = event.target.dataset.spellingSuggestion;
		this.submitHandler();
	};

	private fixFilterCollapseHeight = () => {
		TweenMax.set(this.refFiltersCollapser, { height: this.refFiltersCollapser.clientHeight });
	};

	private setFilterCollapserHeight = () => {
		TweenMax.to(this.refFiltersCollapser, 0.4, {
			ease: EASE_CUSTOM_IN_OUT,
			height: this.refFiltersCollapserInner.clientHeight,
			onComplete: () => {
				TweenMax.set(this.refFiltersCollapser, { height: 'auto' });
			}
		});
	};

	private toggleFilterVisibility = (event?, instant = false) => {
		if (event) {
			event.preventDefault();
		}
		if (!this.state.filtersVisible) {
			this.setState({ filtersVisible: true });
			this.setFilterCollapserHeight();
			TweenMax.to(this.refFiltersCollapser, instant ? 0 : 0.4, { opacity: 1, delay: instant ? 0 : 0.4 });
		} else {
			this.setState({ filtersVisible: false });
			TweenMax.to(this.refFiltersCollapser, instant ? 0 : 0.4, {
				ease: EASE_CUSTOM_IN_OUT,
				height: 0,
				delay: instant ? 0 : 0.1
			});
			TweenMax.to(this.refFiltersCollapser, instant ? 0 : 0.3, { opacity: 0 });
		}
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
				<div ref={ref => (this.refSearchWrapper = ref)} className={`${styles.searchWrapper} ${this.state.loading ? styles.loading : ''}`}>
					<div>
						<ViewableMonitor>
							<form onSubmit={this.submitHandler}>
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
								<span className={styles.resultsLabel} id={'searchresultsfounddisplayed'} tabIndex={0}>
									{this.state.resultData && resultsMessage}
									{spellingSuggestion}
								</span>

								<div className={styles.filters}>
									<div className={styles.verticalFilters}>
										<div className={styles.checkboxWrapper}>
											<input
												onChange={this.toggleAll}
												ref={ref => (this.refVerticalAllCheckbox = ref)}
												checked={this.state.filters.all}
												type="checkbox"
												data-swift-value="All"
												className="filter-vertical"
												name="vertical-all"
												id="filterVerticalAll"
												tabIndex={-1}
											/>
											<label id='filterVerticalAllLabel' onKeyDown={this.filtercheckaccesibility} tabIndex={0} htmlFor="filterVerticalAll">
												<FormattedMessage id="All" />
											</label>
										</div>

										{Object.keys(this.state.filters.verticals).map((key, index) => {
											const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
											return (
												<div key={key} className={styles.checkboxWrapper}>
													<input
														onChange={this.onVerticalChangeHandler}
														ref={ref => (this.refVerticalCheckboxes[index] = ref)}
														checked={!this.state.filters.all && this.state.filters.verticals[key]}
														type="checkbox"
														data-swift-value={capitalized}
														className="filter-vertical"
														name={key}
														id={`filterVertical${capitalized}`}
														tabIndex={-1}
													/>

													<label id={capitalized} onKeyDown={this.filteraccesibility} tabIndex={0} htmlFor={`filterVertical${capitalized}`}>
														{this.props.intl.formatMessage({ id: capitalized })}
													</label>
												</div>
											);
										})}
									</div>
									{
										<div
											tabIndex={0}
											id="toggleFilterVisibility"
											onClick={this.toggleFilterVisibility}
											onKeyDown={this.filteraccesibility}
											className={`${styles.filtersToggleButton} ${this.state.filtersVisible ? styles.open : ''}`}
										>
											<FormattedMessage id="Filters" />
											<span className={styles.filtersToggleIcon} />
										</div>
									}
									<div className={`${styles.filtersCollapser}`} ref={ref => (this.refFiltersCollapser = ref)}>
										<div ref={ref => (this.refFiltersCollapserInner = ref)}>
											<div id='typeFilters' className={styles.typeFilters}>
												<div className={styles.checkboxWrapper + ' subfilterscontainerdiv'}>
													<input
														onChange={this.toggleAllTypes}
														ref={ref => (this.refTypeAllCheckbox = ref)}
														checked={this.state.filters.allType}
														type="checkbox"
														data-swift-value=""
														className="filter-type"
														name="type-all"
														id="filterTypeAll"
														tabIndex={-1}
														aria-label="filterTypeAll"
													/>
													<label id='filterTypeAllLabel' onKeyDown={this.fixonkeydown} tabIndex={0} htmlFor="filterTypeAll">
														<FormattedMessage id="All" />
													</label>
												</div>

												{this.activeFilterTypes.map((key, index) => {
													return (
														<div key={key} className={styles.checkboxWrapper + ' subfilterscontainerdiv'}>
															<input
																onChange={this.onTypeChangeHandler}
																ref={ref => (this.refTypeCheckboxes[index] = ref)}
																checked={this.state.filters.allType === false && this.state.filters.types[key]}
																type="checkbox"
																data-swift-value={key}
																className="filter-type"
																name={key}
																id={`filterVertical${key}`}
																tabIndex={-1}
															/>
															<label id={`filterVerticalLabel${key}`} onKeyDown={this.fixonkeydown} tabIndex={0} htmlFor={`filterVertical${key}`}>
																<FormattedMessage id={'search_filter_' + key} />
															</label>
														</div>
													);
												})}
											</div>

											<div id='typeFilterSelectLists' className={styles.typeFilterSelectLists}>
												{this.activeFilterTypes.map(type => {
													let active = false;
													let idfix = 0;

													if (this.state.initLoad !== false && this.state.currentType === type) {
														active = true;
													} else {
														active = false;
													}
													if (this.filterOptionsForTypes[type]) {
														return (
															<div
																key={type}
																className={
																	styles.filterSelectSet +
																	' ' +
																	(this.state.currentType === type && this.state.filters.types[type] !== false && active ? styles.activeFilterSelectSet : '')
																}
															>
																{this.filterOptionsForTypes[type].map((options, index) => {
																	idfix++;

																	return (
																		<div key={index} className="SelectList subsubfilterstabindexcheck">
																			<label tabIndex={-1} htmlFor={type + idfix + '_title_' + options.swiftype}>
																				<FormattedMessage id={'search_filter_list_' + options.messageID} />
																			</label>
																			<select
																				value={this.state.filters.currTypeFilters[options.swiftype]}
																				onChange={this.onSelectChangeHandler}
																				data-swiftype-value={options.swiftype}
																				ref={ref => (this.selectLists[type][options.swiftype] = ref)}
																				tabIndex={0}
																				aria-label={type + 'filter' + options.messageID}
																				id={type + idfix + '_title_' + options.swiftype}
																			>
																				<FormattedMessage id="All" tagName="option" />
																				{options.data.edges.map(node => {
																					// Hide "Goals" article tag from search
																					if(node.node.contentful_id !== '4k0Dxuv9r5AXsRDAd5Mo1')
																					return (
																						<option
																							aria-label={type + 'option' + node.node.title}
																							value={node.node.contentful_id}
																							key={node.node.contentful_id}
																							tabIndex={0}
																						>
																							{node.node.title}
																						</option>
																					);
																				})}
																			</select>
																		</div>
																	);
																})}
															</div>
														);
													}
												})}
											</div>
										</div>
									</div>
								</div>
							</form>
						</ViewableMonitor>
						{this.state.resultData && this.state.resultData.info.page.current_page >= 1 && (
							<ViewableMonitor>
								<SearchAdvancedResults
									filterData={this.props.filterData}
									messageNoSearchStarted={this.props.intl.formatMessage({ id: 'messageNoSearchStarted' })}
									setSpellingSuggestion={this.setSpellingSuggestion}
									resultData={this.state.resultData}
									sameType={this.state.sameType}
									options={this.state.filters}
								/>
							</ViewableMonitor>
						)}
						<br />
						<ViewableMonitor>
							<div>
								{this.state.loading &&
									(!this.state.filters.types.press_media_mention) &&
									/** Dot animation loader
								<div className={styles.dot_flashing} />*/

									/** Skeleton loader */
									this.ImageList()}
							</div>
						</ViewableMonitor>
						<br />
						{renderPageNumbers && Object.values(this.state.filters.types).includes(true) && !this.state.loading ? renderPageNumbers : null}
					</div>
				</div>
			</div>
		);
	}
}

export default injectIntl(SearchAdvanced);
