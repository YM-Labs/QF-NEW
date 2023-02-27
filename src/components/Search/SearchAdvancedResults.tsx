import * as React from 'react';
import * as styles from './SearchAdvancedResults.module.scss';
import { Page, SwiftypeAPIResponse } from '../../utils/SwiftypeAPI';
import { isArabic } from '../../utils/StringUtils';
import { FormattedMessage } from 'react-intl';
import { EntryPreview } from '../Previews/EntryPreview';
import { UpcomingEventListItem } from '../ListItems/UpcomingEventListItem';
import { PageOverviewQuery, PageSearchQuery, PageEducationCitySpeakerSeriesQuery } from '../../gatsby-queries';
import { PressListItem } from '../ListItems/PressListItem';
import { sanitizeUrl } from '../../utils/URLHelper';
import { ExpertProfilePreview } from '../Previews/ExpertProfilePreview';
import { ECSSPreview } from '../Previews/ECSSPreview';

let arr = [];
let allResults = [];
let finalResults = {};

function flatten(arry) {
	if (!Array.isArray(arry)) {
		return [arry];
	}

	var array = [];
	for (var i = 0; i < arry.length; i++) {
		array = array.concat(flatten(arry[i]));
	}
	return array;
}

export class SearchAdvancedResults extends React.Component<{
	filterData: PageSearchQuery | PageOverviewQuery;
	messageNoSearchStarted: string;
	resultData: SwiftypeAPIResponse;
	sameType: boolean;
	setSpellingSuggestion: (event) => void;
	expertMode?:boolean;
    ecssMode?:boolean;
	options?: any;
}> {
	state = {
		page: [],
		current_page: null,
		isLoading: false,
		isError: false
	};

	constructor(props) {
		super(props);
		if (!this.props.sameType) {
			arr = [];
		}
	}

	componentDidMount() {
		var liText = '',
			liList = document.getElementById('list') && document.getElementById('list').childNodes,
			listForRemove = [];

        liList && liList.forEach((elem) => {
			var text = elem.textContent;

			if (liText.indexOf('|' + text + '|') == -1) liText += '|' + text + '|';
			else listForRemove.push(elem);
		});
    
		listForRemove.forEach((elem) => {
			elem.remove();
		});
	}

	private sortByType(data: Page[]): { title: string; items: Page[] }[] {
		let result = [];
		data.forEach(page => {
			result[page.type] ? result[page.type].push(page) : (result[page.type] = [page]);
		});
		let mappedResult = [];
		for (const [key, values] of Object.entries(result)) {
			mappedResult.push({ title: key, items: values });
		}

		mappedResult.sort(function(key, item) {
            if(item.title !== 'page')
			return key !== 'press_release' && item.items.length > 5 ? -1 : 1;
		});

		return mappedResult;
	}

	private getResultsForBucket(bucket: { title: string; items: Page[] }) {
		var urlParams = new URL(window.location.href.replace(/#/g,"?"))
		var press_media_mention = urlParams.searchParams.get("types[press_media_mention]");

		const type = bucket.items[0].type ? bucket.items[0].type : (press_media_mention ? 'press_media_mention' : 'spokes_people');

		switch (type) {
			case 'event':
				return (
					<ul className={styles.listWrapper} id="list">
						{bucket.items.map(record => {
							return <UpcomingEventListItem data={record} key={record.external_id} typeList={(this.props.filterData as PageSearchQuery).allContentfulEventType} />;
						})}
					</ul>
				);
			case 'press_release':
				return (
					<ul className={styles.listWrapper} id="list">
						{bucket.items.map(record => {
							return <PressListItem title={record.title} date={record.filter_date} url={record.url.replace(window.location.origin, '')} key={record.external_id} />;
						})}
					</ul>
				);
			case 'press_media_mention':
				// @ts-ignore
				const allItems = [...new Map(bucket.items.map(item => [item.node.contentful_id, item])).values()];
				return (
					<ul>
						{allItems.map((edge, index) => {
							return (
								// @ts-ignore
								<PressListItem media={edge.node.mediaOrganisation} title={edge.node.title.title} date={edge.node.date} url={edge.node.link} key={index} isArabic={isArabic(edge.node.title.title)}
								/>
							);
						})}
					</ul>
				);
			case 'article':
				return bucket.items.map(record => {
					return (
						<EntryPreview
							aspectRatio={parseFloat(record.preview_image_aspect_ratio)}
							className={styles.articlePreview}
							url={record.url ? sanitizeUrl(record.url.replace(window.location.origin, '')) : null}
							key={record.external_id}
							imageBasePath={record.preview_image}
							category={bucket.title}
							vertical={record.tags_vertical}
							title={record.title}
							description={record.description}
						/>
					);
				});
			case 'people':
				return bucket.items.map(record => {
					return (
						<EntryPreview
							aspectRatio={502 / 642}
							url={record.url ? sanitizeUrl(record.url.replace(window.location.origin, '')) : null}
							key={record.external_id}
							imageBasePath={record.preview_image}
							category={bucket.title}
							vertical={record.tags_vertical}
							title={record.title}
							description={record.description}
							className={styles.personPreview}
						/>
					);
				});
			case 'spokes_people':
				return bucket.items.map(record => {
					return (
						<EntryPreview
							aspectRatio={502 / 642}
							url={record.url ? sanitizeUrl(record.url.replace(window.location.origin, '')) : null}
							key={record.external_id}
							imageBasePath={record.preview_image}
							category={bucket.title}
							vertical={record.tags_vertical}
							title={record.title}
							// @ts-ignore
							description={record.expertise}
							className={styles.personPreview}
						/>
					);
				});
			case 'expert_profile':
				return bucket.items.sort((a, b) => a?.last_name?.localeCompare(b?.last_name)).map(record => {
					return (
						<ExpertProfilePreview
							url={record.url ? sanitizeUrl(record.url.replace(window.location.origin, '')) : null}
							key={record.external_id}
							imageBasePath={record.preview_image}
							category={bucket.title}
							filterData={this.props.filterData as PageOverviewQuery}
							filter_expert_subjects={record.filter_expert_subjects}
                            filter_expert_expertise={record.filter_expert_expertise}
							filter_entity={record.filter_entity}
							name={(typeof record.title_prefix != "undefined" ? record.title_prefix + ' ' : '') + record.first_name + ' ' + record.last_name}
							title={record.expert_title}
							// @ts-ignore
							description={record.expert_introduction}
							className={styles.expertProfilePreview}
						/>
					);
				});
			case 'ecss':
				// @ts-ignore
				return bucket.items.map((record) => {
					return (
						<ECSSPreview 
                            className={'small'}
                            itemsClass={null}
                            imageBasePath={record.preview_image}
                            // @ts-ignore
                            data={record}
                            listMode={true}
                            key={record.external_id}
                            // @ts-ignore
                            filterData={this.props.filterData as PageEducationCitySpeakerSeriesQuery}
                        />
					);
				});
            case 'ecss_expert':
                return
			default:
				return bucket.items.map(record => {
					return (
						<EntryPreview
							url={record.url ? sanitizeUrl(record.url.replace(window.location.origin, '')) : null}
							key={record.external_id}
							imageBasePath={record.preview_image}
							category={bucket.title}
							vertical={record.tags_vertical}
							title={record.title}
							description={record.description}
						/>
					);
				});
		}
	}

	isEmpty(obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) return false;
		}
		return true;
	}

	render() {
		const hasData = this.props.resultData && this.props.resultData.record_count !== 0;
		const showSpellingSuggestion = this.props.resultData && this.props.resultData.info.page.spelling_suggestion;
		const buckets = hasData && this.sortByType(this.props.resultData.records.page);
		this.state.current_page = this.props.resultData && this.props.resultData.info.page.current_page;
		let newArray = null;
		newArray = this.props.resultData && buckets[0] ? buckets[0].items : null;
		var urlParams = new URL(window.location.href.replace(/#/g,"?"))
		var press_media_mention = urlParams.searchParams.get("types[press_media_mention]");

		if (!this.props.sameType) {
			arr[this.props.resultData && this.state.current_page + 1] = [];
		}

		for (let i = 0; i < (this.props.resultData && Math.ceil(this.props.resultData.info.page.total_result_count / 100)); i++) {
			arr[this.props.resultData && this.state.current_page] = [newArray];
			if (this.state.current_page > 1) {
				var filtered = arr.filter(function(el) {
					return el != null;
				});

				finalResults = filtered;
			} else {
				finalResults = newArray;
			}
		}

		if (this.props.options.types && !Object.values(this.props.options.types).includes(true)) {
			allResults = buckets;
		} else {
			if (buckets) {
				allResults = [
					{ title: this.props.resultData && this.props.resultData.records.page[0].type ? this.props.resultData.records.page[0].type : (press_media_mention ? 'press_media_mention' : 'spokes_people'), items: flatten(finalResults) }
				];
			} else {
				allResults = [];
			}
		}

		return (
			<div className={`module-margin`}>
				{showSpellingSuggestion && (
					<div className={styles.noResultsWrapper}>
						<div>
							<FormattedMessage id="No results" />
						</div>
						<div className={styles.spellingSuggestion}>
							<FormattedMessage
								id="search.result.spellingsuggestion"
								values={{
									link: (
										<a onClick={this.props.setSpellingSuggestion} href="#" data-spelling-suggestion={this.props.resultData.info.page.spelling_suggestion.text}>
											{this.props.resultData.info.page.spelling_suggestion.text}
										</a>
									)
								}}
							/>
						</div>
					</div>
				)}
				{!hasData && !showSpellingSuggestion && (
					<div className={styles.noResultsWrapper}>
						<div>{this.props.messageNoSearchStarted}</div>
					</div>
				)}
				{(!this.props.expertMode && !this.props.ecssMode) && hasData &&
					allResults.map(bucket => {
						if (bucket.title) {
							return (
								<div key={bucket.title} className={`module-margin`}>
                                    {
                                        bucket.title !== 'ecss_expert' && (
                                            <>
                                                <h4 className={styles.bucketTitle} tabIndex={0}>
                                                    <FormattedMessage id={(bucket.items.length > 1 ? 'plural_' : 'singular_') + bucket.title} />
                                                    {this.props.resultData.records.page[0].type !== 'article' &&
                                                        ` (${!Object.values(this.props.options.types).includes(true) ? bucket.items.length : this.props.resultData.info.page.total_result_count})`}
                                                </h4>
                                                <div className={'module-margin-small ' + styles.bucketItems + ' ' + styles.searchResults}>{this.getResultsForBucket(bucket)}</div>
                                            </>
                                        )
                                    }
								</div>
							);
						}
					})}
				{(this.props.expertMode === true || this.props.ecssMode === true) && hasData &&
					allResults.map(bucket => {
						if (bucket.title) {
							return (
								<div key={bucket.title} className={`module-margin`}>
									<div className={'module-margin-small'}>{this.getResultsForBucket(bucket)}</div>
								</div>
							);
						}
					}
                )}
			</div>
		);
	}
}
