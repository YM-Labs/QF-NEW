import * as React from 'react';

import * as styles from './Search.module.scss';
import { TweenMax } from 'gsap/dist/gsap.min';
import { navigate } from 'gatsby';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { EASE_CUSTOM_IN_OUT } from '../../utils/Constants';
import { Globals } from '../../utils/Globals';

const initialState = { showAllResultsLink: false };
type State = Readonly<typeof initialState>;

class Search extends React.Component<
	{
		currLanguage: any;
		id?: string;
        inMenu?: boolean;
	} & WrappedComponentProps
> {
    readonly state: State = initialState;
	private refBg: HTMLDivElement;
	private visible = false;
	private refSearchWrapper: HTMLDivElement;
	private refSearchInnerWrapper: HTMLDivElement;
	private searchInput: HTMLInputElement;

    componentDidMount() {
        const checkEmpty = document.querySelector('#st-search-input');
            checkEmpty.addEventListener('input', () => {
            // @ts-ignore
            if (checkEmpty.value && checkEmpty.value.length > 0 && checkEmpty.value.trim().length > 0) { 
                this.setState({
                    showAllResultsLink: true
                })
            }
            else {
                this.setState({
                    showAllResultsLink: false
                })
            }
        });
    }

	private allResultsClickHandler = event => {
		event.preventDefault();
		navigate('/' + Globals.CURRENT_LANGUAGE_PREFIX + 'search#all=1&allType=1&s=' + encodeURIComponent(this.searchInput.value));
		if (this.visible) {
			this.toggleSearch(this);
		}
		return false;
	};

	private toggleSearch = e => {
		if (!this.visible) {
			document.body.classList.add('search-open');
			if (e.currentTarget !== undefined) e.currentTarget.attributes['aria-pressed'] = true;
			document.addEventListener('keydown', this.keyHandler);
			this.visible = true;
			TweenMax.set(this.refBg, { visibility: 'visible', pointerEvents: 'all', force3D: true });
			TweenMax.to(this.refBg, 0.45, { opacity: 0.18, force3D: true });
			TweenMax.set(this.refSearchWrapper, { visibility: 'visible', pointerEvents: 'all', force3D: true });
			TweenMax.to(this.refSearchWrapper, 0.45, { opacity: 1, yPercent: 0, ease: EASE_CUSTOM_IN_OUT, force3D: true });
			TweenMax.to(this.refSearchInnerWrapper, 0.5, { opacity: 1, force3D: true });
			TweenMax.to(this.refSearchInnerWrapper, 0.6, {
				y: 0,
				ease: EASE_CUSTOM_IN_OUT,
				force3D: true,
				onComplete: () => {
					this.searchInput.focus();
				}
			});
		} else {
			document.removeEventListener('keydown', this.keyHandler);
			document.body.classList.remove('search-open');
			if (e.currentTarget !== undefined) e.currentTarget.attributes['aria-pressed'] = false;
			this.visible = false;
			TweenMax.to(this.refBg, 0.45, { autoAlpha: 0, force3D: true });
			TweenMax.set(this.refBg, { pointerEvents: 'none' });
			TweenMax.to(this.refSearchWrapper, 0.45, { autoAlpha: 0, yPercent: -50, ease: EASE_CUSTOM_IN_OUT, force3D: true });
			TweenMax.to(this.refSearchInnerWrapper, 0.25, { opacity: 0, force3D: true });
			TweenMax.to(this.refSearchInnerWrapper, 0.45, { y: -100, ease: EASE_CUSTOM_IN_OUT, force3D: true });
			TweenMax.set(this.refSearchWrapper, { pointerEvents: 'none' });
		}
	};

	private hideSearch = () => {
		if (this.visible) {
			this.toggleSearch(this);
		}
	};

	private shiftthefocus = event => {
		if (event.key == 'Enter') {
            // @ts-ignore
			var searchquery = document.getElementById('st-search-input').value;
			window.location.href = '/' + Globals.CURRENT_LANGUAGE_PREFIX + 'search#all=1&allType=1&s=' + searchquery;
		}
	};

	private shiftthetabindexofsearch = event => {
		if (event.key == 'Enter') {
			document.getElementById('searchCloseiconbtn').setAttribute('tabindex', '0');
		}
	};

	private shiftthetabindexofsearchtab = event => {
		if (event.key == 'Enter') {
			document.getElementById('searchCloseiconbtn').setAttribute('tabindex', '-1');
		}
	};

	render() {
		return (
			<div className={`${styles.wrapper} ${this.props.inMenu ? 'inMenu' : ''}`}>
				<div onClick={this.hideSearch} ref={ref => (this.refBg = ref)} className={styles.searchBg} />
				<button
					id={this.props.id}
					tabIndex={-1}
					title={this.props.intl.formatMessage({ id: 'searchicontitle' })}
					aria-label={this.props.intl.formatMessage({ id: 'searchiconarialabel' })}
					onClick={this.toggleSearch}
					className={styles.searchIcon}
				>
					<div id="searchClose" className={styles.searchIconOpen} tabIndex={0} onKeyDown={this.shiftthetabindexofsearch} />
					<div className={styles.searchIconClosed} tabIndex={-1} id="searchCloseiconbtn" onKeyDown={this.shiftthetabindexofsearchtab} />
				</button>
				<div ref={ref => (this.refSearchWrapper = ref)} className={styles.searchWrapper} id="searchWrapper">
					<div ref={ref => (this.refSearchInnerWrapper = ref)} className={styles.innerWrapper + ' container-padding'}>
						<label htmlFor="st-search-input" className="visually-hidden">
							{this.props.intl.formatMessage({ id: 'SearchHelpText' })}
						</label>
						<input
							title={this.props.intl.formatMessage({ id: 'searchinputtitle' })}
							ref={ref => {
								this.searchInput = ref;
							}}
							placeholder={this.props.intl.formatMessage({ id: 'Search' })}
							id="st-search-input"
							className="st-search-input"
							type="text"
							onKeyDown={this.shiftthefocus}
						/>
						<a onClick={this.allResultsClickHandler} className={styles.allResultsLink + (this.state.showAllResultsLink ? ' visible' : '')} href={'/search'}>
                            <span>
							    <FormattedMessage id={'See all results'} />
                            </span>
						</a>
					</div>
				</div>
			</div>
		);
	}

	private keyHandler = evt => {
		evt = evt || window.event;
		var isEscape = false;
		if ('key' in evt) {
			isEscape = evt.key === 'Escape' || evt.key === 'Esc';
		} else {
			isEscape = evt.keyCode === 27;
		}
		if (isEscape) {
			this.hideSearch();
		}
	};
}

export default injectIntl(Search);
