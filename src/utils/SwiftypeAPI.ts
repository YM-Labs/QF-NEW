import axios, { CancelTokenSource } from 'axios';
import * as Qs from 'qs';
import cacheAdapterEnhancer from '../lib/axios-extensions/src/cacheAdapterEnhancer';
import Cache from '../lib/axios-extensions/LRUCache';

interface SwiftypeAPIOptions {
	per_page?: number;
	spelling?: string;
	engine_key?: string;
	filters?: object;
	search_fields?: object;
	page?: number;
	fetch_fields?: object;
	facets?: object;
	document_types?: object;
	functional_boosts?: object;
	sort_field?: object;
	sort_direction?: object;
	highlight_fields?: object;
}

export interface Page {
	title: string;
	type: string;
	external_id: string;
	image: string;
	url: string;
	published_at: Date;
	updated_at: Date;
	popularity: number;
	body: string;
	info: string;
	_index: string;
	_type: string;
	_score: number;
	_version?: any;
	_explanation?: any;
	sort?: any;
	highlight: any;
	id: string;
	description?: string;
	tags_vertical?: string;
	preview_image?: string;
	filter_expert_subjects?: string[]|string;
    filter_expert_expertise?: string[]|string;
	filter_entity?: string[]|string;
	filter_date?: string;
	expert_title?: string;
	first_name?: string;
    last_name?: string;
    title_prefix?: string;
	expert_introduction?: string;
	filter_start_date?: string;
	preview_image_aspect_ratio?: string;
	filter_end_date?: string;
	filter_event_type?: string;
	mediaSpokespeople?: boolean;
}

interface Records {
	page: Page[];
}

interface Facets {}

interface SpellingSuggestion {
	text: string;
	score: number;
}

interface Page2 {
	query: string;
	current_page: number;
	num_pages: number;
	per_page: number;
	total_result_count: number;
	spelling_suggestion?: SpellingSuggestion;
	facets: Facets;
}

interface Info {
	page: Page2;
}

interface Errors {}

export interface SwiftypeAPIResponse {
	record_count: number;
	records: Records;
	info: Info;
	errors: Errors;
}

export class SwiftypeAPI {
	private static ROOT_URL = 'https://api.swiftype.com';
	private defaultCache = new Cache();

	private cancelRequest: CancelTokenSource = null;
	//@ts-ignore:
	private currReqest = null;

	private http = axios.create({
		baseURL: SwiftypeAPI.ROOT_URL,
		adapter: cacheAdapterEnhancer(axios.defaults.adapter, { enabledByDefault: true, cacheFlag: 'cache' }),
		paramsSerializer: function(params) {
			return Qs.stringify(params, { arrayFormat: 'brackets' });
		}
	});

	private defaultConfig: SwiftypeAPIOptions = {
		per_page: 1000,
		page: 1,
		spelling: 'strict',
		engine_key: '',
		filters: undefined,
		search_fields: undefined
	};

	constructor(engineKey: string) {
		this.defaultConfig.engine_key = engineKey;
	}

	public query(query: string, callback: (response: SwiftypeAPIResponse) => void, config: SwiftypeAPIOptions = {}) {
		if (this.cancelRequest) {
			this.cancelRequest.cancel();
			this.cancelRequest = null;
		}

		let configMerge = { ...this.defaultConfig, ...config };
		configMerge['q'] = query;

		this.cancelRequest = axios.CancelToken.source();

		let options = {
			cancelToken: this.cancelRequest.token,
			withCredentials: true,
			// adapter: jsonpAdapter,
			params: configMerge,
			//@ts-ignore:
			cache: this.defaultCache
		};

		this.currReqest = this.http
			.get('/api/v1/public/engines/search.json', options)
			.then(response => {
				this.cancelRequest = null;
				callback(response.data as SwiftypeAPIResponse);
			})
			.catch(thrown => {
				if (axios.isCancel(thrown)) {
					console.log('Request canceled', thrown.message);
				} else {
					// handle error
				}
				this.cancelRequest = null;
			});
	}

	public abort() {
		if (this.cancelRequest) {
			this.cancelRequest.cancel();
			this.cancelRequest = null;
		}
	}
}
