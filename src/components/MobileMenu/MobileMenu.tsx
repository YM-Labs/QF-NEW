import * as React from 'react';

import * as styles from './MobileMenu.module.scss';
import { globalsQueryAndLayout_entities, globalsQueryAndLayout_places, globalsQueryAndLayout_programs, MobileMenuFragment } from '../../gatsby-queries';
import { TimelineMax, TweenMax } from 'gsap/dist/gsap.min';
import { EASE_CUSTOM_IN_OUT } from '../../utils/Constants';
import MobileMenuSocialCopyright from './MobileMenuSocialCopyright';
import { getActiveMenu, parseSecondaryMenus, SecondaryMenusParsed } from './MobileMenuHelpers';
import { MobileMenuSubMenu } from './MobileMenuSubMenu';
import { MobileMenuPreviewItem } from './MobileMenuPreviewItem';
import MapLoader from '../../utils/MapLoader';
import Map from './Map';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import DarkModeToggle from '../../ui/DarkModeToggle';
import GatsbyLink from 'gatsby-link';
import { graphql } from 'gatsby';

const initialState = { activeMenuIndexes: new Array(5), selectedID: '', currentPreviewURL: '', menuData: null, mapActive: false, mapListMode: true, hidePreviewWrapper: false, selectedVertical: null, verticalClass: null, selectedItem: null, total: 0 };
type State = Readonly<typeof initialState> & { menuData: { [key: string]: ResultItem } };

export type ResultItem = {
	contentful_id: string;
	title: string;
	phone: string;
	fax: string;
	email: string;
	node_locale: string;
	type: string[] | null;
	ct: string;
	entityDescription?: {
		entityDescription?: string;
	};
	subtitle?: {
		subtitle?: string;
	};
	filterEntity?: {
		slug: string;
		title: string;
	};
	filterVerticalCategory?: any;
	filterProgramType?: {
		title: string;
	};
	openingHours?: any;
	location: {
		contentful_id: string;
		placeName: string;
		placeAddress: string;
		placeLocation?: {
			lon: number;
			lat: number;
		};
	};
	heroImage?: any;
};

export class MobileMenu extends React.Component<
	{
		programs: globalsQueryAndLayout_programs;
		places: globalsQueryAndLayout_places;
		entities: globalsQueryAndLayout_entities;
		data: MobileMenuFragment[];
		currLanguage: any;
		open: boolean;
		footerCopyrightMessage: string;
		closeHandler: (event) => void;
		id?: any;
        alternateURL?: string;
        langs?: any;
        location?: any;
	} & WrappedComponentProps,
	State
> {
	readonly state: State = initialState;

	//Refs:
	private refNav: HTMLElement;
	private refBg: HTMLDivElement;
	//@ts-ignore:
	private refLogo: GatsbyLink;
	//@ts-ignore:
	private refMobileNavigationButton: HTMLDivElement;
	private refInnerWrapper: HTMLDivElement;
	private refLayoutWrapper: HTMLDivElement;
	private refSocialLinks: HTMLAnchorElement[] = [];

	// Menus nested by index refs:
	private refsMenuListItems: Array<HTMLLIElement | HTMLLIElement[]>[] = [[], [], [], [], []];
	private refsMenuWrapperOuterWrappers: HTMLDivElement[] = [];
	private refSubmenus: Array<MobileMenuSubMenu | MobileMenuSubMenu[]>[] = [[], [], [], [], []];

	//Active menu state:
	private currMenuLevelIndex = 0;
	private activeSubmenuIndexes = new Array(4);

	//Sizing variables:
	private windowWidth: number;
	//@ts-ignore:
	private mobileMode = false;
	private fullMenuMode: boolean = false;
	private fullMenuBreak = 1380;

	//For holding parsed sub menu data sets (see componentDidUpdate):
	private secondaryMenusData: SecondaryMenusParsed = [[], [], [], [], []]; //Needs to match the 3 verticals + map = 4

	// Animation state:
	private activeTimeline: TimelineMax = null;
	private activeMenu: MobileMenuFragment;
	private refMenuItemPreview: MobileMenuPreviewItem;

	private animationDirection: 1 | -1 = 1;

	public instantOpen = false;

	constructor(props) {
		super(props);
		if (typeof window !== 'undefined') {
			fetch('/menupreviews.json')
            .then((resp) => resp.json())
            .then((response) => {
				this.setState({ menuData: response });
			});
		}

		this.activeMenu = getActiveMenu(this.props.data, this.props.currLanguage);

		this.checkAnimationDirection();
		parseSecondaryMenus(this.secondaryMenusData, this.props.currLanguage, this.props.programs, this.props.places, this.props.entities, this.activeMenu.mapCategories, this.props.intl);
	}

    //@ts-ignore:
	async openMap() {
		if (this.state.mapActive === false) {
			this.mapMenuPointClicked();
		}

		const locationID = window.location.hash.substr(5);

		if (locationID.length > 0) {
			if (this.currMenuLevelIndex !== 2 && 0 !== this.activeSubmenuIndexes[2]) {
				this.gotoMenu(2, 0, true);
			}
			setTimeout(() => {
				const activeMenus = this.getActiveSubMenusArray(2);

				if (activeMenus[2]) {
					const locationIDLookup = locationID + (this.props.currLanguage.link === '/ar' ? '___ar-QA' : '');
					const activeItemIndex = activeMenus[2].props.firstMenuItems.findIndex(edge => edge.node.pageContext.id === locationID);
					if (activeItemIndex >= 0) {
						this.setState({ selectedID: locationIDLookup, currentPreviewURL: activeMenus[2].props.firstMenuItems[activeItemIndex].node.path });
						this.gotoMenu(3, activeItemIndex, true);
					}
				}
			}, 0);
		}
	}

	private checkAnimationDirection = () => {
		if (this.props.currLanguage.link === '/ar') {
			this.animationDirection = -1;
		} else {
			this.animationDirection = 1;
		}
	};

	componentDidUpdate(prevProps) {
		if (prevProps.currLanguage.langKey !== this.props.currLanguage.langKey) {
			this.activeMenu = getActiveMenu(this.props.data, this.props.currLanguage);
			this.checkAnimationDirection();
			parseSecondaryMenus(this.secondaryMenusData, this.props.currLanguage, this.props.programs, this.props.places, this.props.entities, this.activeMenu.mapCategories, this.props.intl);
			this.resizeHandler();
		}

		if (prevProps.open !== this.props.open) {
			if (this.activeTimeline) {
				this.activeTimeline.kill();
			}
			if (this.props.open) {
				this.activeTimeline = new TimelineMax();
				this.activeTimeline.set(this.refNav, { visibility: 'visible', force3D: true });
				this.activeTimeline.set(this.refNav, { pointerEvents: 'all' });
				this.activeTimeline.to(this.refBg, 0.65, { opacity: 0.18, force3D: true }, 0);

				this.activeTimeline.to(this.refSocialLinks, 0.85, { opacity: 1, force3D: true }, 0);
				this.activeTimeline.to(this.refSocialLinks, 0.85, { y: 0, ease: EASE_CUSTOM_IN_OUT, force3D: true }, 0);

				if (this.currMenuLevelIndex === 0) {
					(this.refSubmenus[0][0] as MobileMenuSubMenu).show(this.instantOpen);
				}

				this.activeTimeline.to(this.refInnerWrapper, 0.65, { xPercent: 0, ease: EASE_CUSTOM_IN_OUT, force3D: true }, 0);

				this.instantOpen = false;
			} else {
				this.removeMapFromWindowLocation();
				this.activeTimeline = new TimelineMax();
				this.activeTimeline.set(this.refNav, { pointerEvents: 'none', force3D: true });
				this.activeTimeline.to(this.refBg, 0.35, { opacity: 0, force3D: true }, 0);

				if (this.currMenuLevelIndex === 0) {
					(this.refSubmenus[0][0] as MobileMenuSubMenu).hide();
				}

				this.activeTimeline.to(this.refSocialLinks, 0.15, { opacity: 0, force3D: true }, 0);
				this.activeTimeline.to(this.refInnerWrapper, 0.3, { xPercent: this.animationDirection === 1 ? -100 : 100, ease: EASE_CUSTOM_IN_OUT, force3D: true }, 0);

				this.activeTimeline.set(this.refNav, { visibility: 'hidden', pointerEvents: 'none' });
				this.activeTimeline.set(this.refSocialLinks, { opacity: 0, y: 25, force3D: true });
			}
		}
	}

	private setMapMapToggleActive = event => {
		if (event) {
			event.preventDefault();
		}
		if (this.state.mapListMode === true) {
			this.setState({ mapListMode: false });
		}
	};

	private setMapListToggleActive = event => {
		if (event) {
			event.preventDefault();
		}

		if (this.state.mapListMode === false) {
			this.setState({ mapListMode: true });
		}
	};

	private topBackButtonClicked = event => {
		if (event) {
			event.preventDefault();
		}
		this.gotoMenu(this.currMenuLevelIndex - 1, this.activeSubmenuIndexes[this.currMenuLevelIndex - 1]);
	};

	private topBackButtontabbed = event => {
		if (event.key == 'Enter') {
			this.topBackButtonClicked(event);
            const mapBackButtonVisible = this.state.mapActive && this.state.activeMenuIndexes[2] > -1;
			window.setTimeout(() => {
                if(mapBackButtonVisible) {
                    document.getElementById('mapnavtopbackbtn').focus();
                } else {
                    document.getElementById('mapMenu').getElementsByTagName('ul')[0].focus();
                }
			}, 0);
		} else if (event.key == 'Tab') {
			
            function isInViewport(el) {
                return (window.getComputedStyle(el).getPropertyValue('display') !== 'none')
            }
            
            window.setTimeout(() => {
                var visibleSubmenu = document.getElementById('mapnavtopbackbtn').nextElementSibling.nextElementSibling.children[2]
                visibleSubmenu.getElementsByTagName('ul')[0].focus()
                var children = visibleSubmenu.children;
                for(var i=0; i< children.length; i++) {
                    var child = children[i];
                    if(isInViewport(child)) {
                        child.getElementsByTagName('ul')[0].focus();
                    }
                }
            }, 0);
		}
	};

	private topshortmenuBackButtontabbed = event => {
		if (event.key == 'Enter') {
			this.mobileBackNavigationItemClicked(event);
		}
	};

	private mobileBackNavigationItemClicked = event => {
		if (event) {
			event.preventDefault();
		}

		this.gotoMenu((this.currMenuLevelIndex === 3 && this.state.hidePreviewWrapper) ? this.currMenuLevelIndex - 2 : this.currMenuLevelIndex - 1, this.state.hidePreviewWrapper ? this.activeSubmenuIndexes[this.currMenuLevelIndex - 2] : this.activeSubmenuIndexes[this.currMenuLevelIndex - 1]);
		if (this.currMenuLevelIndex < 1 && this.state.mapActive === true) {
			this.setState({ mapActive: false });
		}
		if (this.state.mapListMode === false) {
			this.setState({ mapListMode: true });
		}
        if(this.currMenuLevelIndex !== 2)
        this.setState({ selectedItem: '' });
	};

	private verticalMenuItemClicked = event => {
		if (event) {
			event.preventDefault();
		}
		const menuItemIndex = parseInt(event.target.dataset.index);
		if (menuItemIndex !== this.activeMenu.menuItems.length && this.state.mapActive === true) {
			this.setState({ mapActive: false });
		}

        let val;
        let verticalClass;

        if(menuItemIndex === 0) {
            val = 'Education'
            verticalClass = 'purple'
        } else if(menuItemIndex === 1) {
            val = 'Research'
            verticalClass = 'blue'
        } else if(menuItemIndex === 2) {
            val = 'Community'
            verticalClass = 'red'
        } else if(menuItemIndex === 3) {
            val = 'World Cup'
            verticalClass = 'orange'
        }

        this.setState({ selectedVertical: val, verticalClass: verticalClass });
		this.gotoMenu(1, menuItemIndex);
        document.documentElement.style.overflowY = 'scroll';
	};

	private secondaryMenuItemClicked = (event) => {
		if (event) {
			event.preventDefault();
		}
        this.setState({ selectedItem: event.target.dataset.id, total: event.target.dataset.items });
		const menuItemIndex = parseInt(event.target.dataset.index);
		this.gotoMenu(2, menuItemIndex);
        document.documentElement.style.overflowY = 'scroll';
	};

	private tertiaryMenuItemClicked = event => {
		const dataLink = event.target.getAttribute('data-link')
		if (!dataLink && event) {
			event.preventDefault();
		}
		const menuItemIndex = parseInt(event.target.dataset.index);
		const menuItemID = event.target.dataset.id + (this.props.currLanguage.link === '/ar' ? '___ar-QA' : '');
		if (menuItemID) {
			this.setState({ selectedID: menuItemID, currentPreviewURL: event.target.getAttribute('href') });
		}
		
		if (dataLink) {
			this.gotoMenu(3, menuItemIndex, true, dataLink);
			document.getElementById("close-menu").click();
			this.setState({ hidePreviewWrapper: true });
		} else {
			this.gotoMenu(3, menuItemIndex);
		}
        document.documentElement.style.overflowY = 'scroll';
	};

	private mapMenuItemClicked = event => {
		if (event) {
			event.preventDefault();
		}
		const menuItemIndex = parseInt(event.target.dataset.index);
		this.gotoMenu(2, menuItemIndex);
        document.documentElement.style.overflowY = 'scroll';
	};

	private mapMenuPointClicked = (event?) => {
		new MapLoader().initMap();
		this.gotoMenu(1, this.activeMenu.menuItems.length, !event);
		if (this.activeSubmenuIndexes[1] === this.activeMenu.menuItems.length) {
			this.setState({ mapActive: true });
		} else {
			this.setState({ mapActive: false });
			this.removeMapFromWindowLocation(event);
		}
	};

	private removeMapFromWindowLocation(event?) {
		if (window.location.hash && window.location.hash.indexOf('#map') === 0) {
			window.location.hash = '';
			if (event) {
				event.preventDefault();
			}
		}
	}

	private getActiveSubMenusArray(menuLevelIndex: number) {
		let activeMenus = [this.refSubmenus[0][0] as MobileMenuSubMenu];
		if (menuLevelIndex > 0) {
			activeMenus.push(this.refSubmenus[1][this.activeSubmenuIndexes[1]] as MobileMenuSubMenu);
		}
		if (menuLevelIndex > 1) {
			activeMenus.push(this.refSubmenus[2][this.activeSubmenuIndexes[1]][this.activeSubmenuIndexes[2]]);
		}
		if (menuLevelIndex > 2) {
			activeMenus.push(this.refMenuItemPreview as any);
		}
		return activeMenus;
	}

	private getMenuToWidth = (activeSubmenusArray: MobileMenuSubMenu[], link) => {
		let joinedWidths = 0;
		if (this.fullMenuMode && this.state.mapActive && activeSubmenusArray.length > 2) {
			joinedWidths = activeSubmenusArray[0].getWidth() + activeSubmenusArray[activeSubmenusArray.length - 1].getWidth() + 250;
		} else if (activeSubmenusArray.length === 1) {
			joinedWidths = this.fullMenuMode ? 350 : 215;
		} else if (this.fullMenuMode) {
			link ? joinedWidths = 900 : activeSubmenusArray.forEach(menu => (joinedWidths += menu && menu.getWidth()));
		} else {
			joinedWidths = 350;
		}
		return joinedWidths;
	};

	private gotoMenu(menuLevelIndex: number, menuItemIndex: number, instant = false, link = false) {
		let duration = instant ? 0 : 0.4;
		if (this.currMenuLevelIndex < menuLevelIndex) {
			// New higher menu clicked:

			this.activeSubmenuIndexes[menuLevelIndex] = menuItemIndex;
			let activeMenus = this.getActiveSubMenusArray(menuLevelIndex);
			const toWidth = this.getMenuToWidth(activeMenus, link);
			!link && activeMenus[menuLevelIndex].show(instant);
			TweenMax.to(this.refLayoutWrapper, duration, { width: link ? toWidth : toWidth, ease: EASE_CUSTOM_IN_OUT });
			this.currMenuLevelIndex = menuLevelIndex;

			if (menuLevelIndex === 1) {
				window.setTimeout(function() {
					activeMenus[menuLevelIndex]['refListItems'][0].querySelector('a').focus();
				}, 300);
			} else if (menuLevelIndex === 2) {
				window.setTimeout(function() {
					activeMenus[menuLevelIndex]['refListItems'][0].querySelector('a').focus();
				}, 300);
			} else if (menuLevelIndex === 3) {
				window.setTimeout(() => {
					var seletor = !link && activeMenus[menuLevelIndex]['refWrapper']['offsetParent'];
					var elem = seletor && seletor.getElementsByTagName('h3')[0];
					elem && elem.focus();
				}, 0);
			}
		} else if (this.currMenuLevelIndex === menuLevelIndex) {
			// Same menu clicked (toggle it away):
			let activeMenus = this.getActiveSubMenusArray(menuLevelIndex);

			//Hide current active one:
			!link && activeMenus[menuLevelIndex].hide(instant);
			if (menuItemIndex !== this.activeSubmenuIndexes[menuLevelIndex]) {
				//Set new active index:
				this.activeSubmenuIndexes[menuLevelIndex] = menuItemIndex;
				activeMenus = this.getActiveSubMenusArray(menuLevelIndex);
				!link && activeMenus[menuLevelIndex].show(instant);

				// Accesibility fix on key tabbing
				if (menuLevelIndex == 1 || menuLevelIndex == 2) {
					var selector = activeMenus[menuLevelIndex]['refListItems'][0];
					var elem = selector.getElementsByTagName('a');
					var activemenuelement = elem[0];
					activemenuelement.focus();
				}
			} else {
				this.activeSubmenuIndexes[this.currMenuLevelIndex] = -1;
				this.currMenuLevelIndex = this.currMenuLevelIndex - 1;
				// this.activeSubmenuIndexes[this.currMenuLevelIndex] = -1;
				activeMenus = this.getActiveSubMenusArray(this.currMenuLevelIndex);

				const toWidth = this.getMenuToWidth(activeMenus, link);
				TweenMax.to(this.refLayoutWrapper, duration, { width: toWidth, ease: EASE_CUSTOM_IN_OUT });
			}
		} else {
			//Lower menu selected:
			let activeMenus = this.getActiveSubMenusArray(this.currMenuLevelIndex);
			while (this.currMenuLevelIndex >= menuLevelIndex) {
				!link && activeMenus[this.currMenuLevelIndex] && activeMenus[this.currMenuLevelIndex].hide(instant);
				this.activeSubmenuIndexes[this.currMenuLevelIndex] = -1;
				this.currMenuLevelIndex--;
			}
			this.currMenuLevelIndex = menuLevelIndex;

			//Set new active index:
			this.activeSubmenuIndexes[menuLevelIndex] = menuItemIndex;
			activeMenus = this.getActiveSubMenusArray(menuLevelIndex);
			activeMenus[menuLevelIndex].show(instant);

			// Accesibility fix on key tabbing
			//var theanswer = activeMenus[menuLevelIndex]['refListItems'][0];
			//var fajr =  $(theanswer).find("a");
			//var activemenuelement = fajr[0];
			//activemenuelement.focus();

			const toWidth = this.getMenuToWidth(activeMenus, link);
			TweenMax.to(this.refLayoutWrapper, duration, { width: toWidth, ease: EASE_CUSTOM_IN_OUT });
		}
		if (this.currMenuLevelIndex < 3) {
			this.setState({ selectedID: '', currentPreviewURL: '' });
		}
		this.setState({ activeMenuIndexes: this.activeSubmenuIndexes });
	}

	componentDidMount() {
		window.addEventListener('resize', this.resizeHandler);
		this.resizeHandler();

		TweenMax.set(this.refBg, { opacity: 0, force3D: true });
		TweenMax.set(this.refSocialLinks, { opacity: 0, y: 25, force3D: true });
		TweenMax.set(this.refInnerWrapper, { xPercent: this.animationDirection === 1 ? -100 : 100, force3D: true });
		TweenMax.set(this.refNav, { visibility: 'hidden', pointerEvents: 'none', force3D: true });
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeHandler);
	}

	private resizeHandler = () => {
		this.windowWidth = window.innerWidth;
		this.fullMenuMode = this.windowWidth >= this.fullMenuBreak;
		if (this.windowWidth < 768) {
			this.mobileMode = true;
		} else {
			let activeMenus = this.getActiveSubMenusArray(this.currMenuLevelIndex);
			const toWidth = this.getMenuToWidth(activeMenus, null);
			TweenMax.set(this.refLayoutWrapper, { width: toWidth });
		}
		if (!this.props.open) {
			TweenMax.set(this.refInnerWrapper, { xPercent: this.animationDirection === 1 ? -100 : 100, force3D: true });
		}
	};

	public render() {
		const mapMenuItemIndex = this.activeMenu.menuItems.length;
		const mapBackButtonVisible = this.state.mapActive && this.state.activeMenuIndexes[2] > -1;
		const mobileBackButtonVisible = this.state.activeMenuIndexes[1] > -1;
		this.refsMenuListItems[1][mapMenuItemIndex] = [];
        var pathArray = this.props.location.pathname.split('/');
        var subMenuPath = [
            { path: 'education/', index: 0, style: 'purple' }, 
            { path: '/education', index: 0, style: 'purple' },
            { path: 'ar/education/', index: 0, style: 'purple' }, 
            { path: '/ar/education', index: 0, style: 'purple' },
            { path: 'research/', index: 1, style: 'blue' }, 
            { path: '/research', index: 1, style: 'blue' },
            { path: 'ar/research/', index: 1, style: 'blue' }, 
            { path: '/ar/research', index: 1, style: 'blue' },
            { path: 'community/', index: 2, style: 'red' }, 
            { path: '/community', index: 2, style: 'red' },
            { path: 'ar/community/', index: 2, style: 'red' }, 
            { path: '/ar/community', index: 2, style: 'red' },
            { path: 'education-city-world-cup/', index: 3, style: 'orange' }, 
            { path: '/education-city-world-cup', index: 3, style: 'orange' },
            { path: 'ar/education-city-world-cup/', index: 3, style: 'orange' }, 
            { path: '/ar/education-city-world-cup', index: 3, style: 'orange' }
        ]
        let arrayIndex = this.props.currLanguage.link === '/ar' ? 2 : 1
        let arrayPos = this.props.currLanguage.link === '/ar' ? 3 : 2
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

		return (
			<nav ref={ref => (this.refNav = ref)} id={this.props.id} data-color={subMenuPath.map(page => (page.path === this.props.location.pathname || (pathArray.length > arrayPos && page.path === '/' + pathArray[arrayIndex])) ? page.style : null).join('')} className={`${styles.wrapper} ${subMenuPath.map(page => (page.path === this.props.location.pathname || (pathArray.length > arrayPos && page.path === '/' + pathArray[arrayIndex])) ? styles[page.style] : null).join('')}`}>
				<div ref={ref => (this.refBg = ref)} onClick={this.props.closeHandler} className={styles.bgOverlay} />
				<Map
					// @ts-ignore
					className={this.state.mapListMode ? '' : styles.mapMobileActive}
					activeMarkerID={this.state.selectedID}
					activeMarker={this.refMenuItemPreview}
					open={this.state.mapActive && this.props.open}
					currentLanguage={this.props.currLanguage.langKey}
					menuData={this.state.menuData}
				/>
				<div ref={ref => (this.refInnerWrapper = ref)} className={styles.innerWrapper + ' ' + (this.state.mapActive ? 'mapActive' : '')}>
					<div ref={ref => (this.refLayoutWrapper = ref)} className={styles.layoutWrapper}>
						<div
							tabIndex={0}
							id="mapnavtopbackbtn"
							onKeyDown={this.topBackButtontabbed}
							onClick={this.topBackButtonClicked}
							className={styles.topBackButton + (mapBackButtonVisible ? ' ' + styles.topBackButtonVisible : '')}
						>
							<FormattedMessage id="Back" />
						</div>
						<div className={styles.mapListToggle + (this.state.mapActive ? ' ' + styles.mapListToggleVisible : '')}>
							<div onClick={this.setMapMapToggleActive} className={styles.mapListToggleButton + (this.state.mapListMode ? '' : ' ' + styles.activeMapToggleButton)}>
								<FormattedMessage id="Map" />
							</div>
							<div onClick={this.setMapListToggleActive} className={styles.mapListToggleButton + (!this.state.mapListMode ? '' : ' ' + styles.activeMapToggleButton)}>
								<FormattedMessage id="List" />
							</div>
						</div>
						<div className={styles.menusOuterWrapper}>
							{/*Main Menu (level 1):*/}

							<MobileMenuSubMenu
								animationDirection={this.animationDirection}
								closeCallback={this.props.closeHandler}
								activeIndex={this.state.activeMenuIndexes[1]}
								mapActive={this.state.mapActive}
								isMainMenu={true}
								ref={ref => (this.refSubmenus[0][0] = ref)}
								firstMenuItems={this.activeMenu.menuItems}
                                currLang={this.props.currLanguage.langKey}
								secondaryMenuItems={this.activeMenu.secondaryMenuItems}
								firstMenuItemsClickHandler={this.verticalMenuItemClicked}
								mapClickHandler={this.mapMenuPointClicked}
								refListItemsArray={this.refsMenuListItems[0] as HTMLLIElement[]}
								wrapperClass={styles.mainMenu}
                                selectedVertical={this.state.selectedVertical}
                                selectedItem={this.state.selectedItem}
                                total={this.state.total}
                                verticalClass={this.state.verticalClass}
                                intl={this.props.intl}
							/>

							{/*All sub menus in (level 2) wrapped:*/}
							<div ref={ref => (this.refsMenuWrapperOuterWrappers[1] = ref)} id='subMenusWrapper' className={styles.subMenusWrapper}>
								{this.activeMenu.menuItems.map((menuItem, menuIndex) => {
									this.refsMenuListItems[1][menuIndex] = [];
									return (
                                        <>
										<MobileMenuSubMenu
											animationDirection={this.animationDirection}
											closeCallback={this.props.closeHandler}
											activeIndex={this.state.activeMenuIndexes[1] === menuIndex ? this.state.activeMenuIndexes[2] : -1}
											isMainMenu={false}
											key={menuIndex}
											showLengthOnSecondaryItems={true}
											ref={ref => (this.refSubmenus[1][menuIndex] = ref)}
											firstMenuItems={menuItem.subpages}
											// @ts-ignore
											id={`secondaryMenuItem_${menuIndex}`}
											// @ts-ignore
											secondaryMenuItemsClickHandler={this.secondaryMenuItemClicked}
                                            currLang={this.props.currLanguage.langKey}
											secondaryMenuItems={this.secondaryMenusData[menuIndex]}
											refListItemsArray={this.refsMenuListItems[1][menuIndex] as HTMLLIElement[]}
                                            intl={this.props.intl}
										/>
                                        </>
									);
								})}
								{/* Special map sub menu:*/}
								<MobileMenuSubMenu
									animationDirection={this.animationDirection}
									closeCallback={this.props.closeHandler}
									wrapperClass={styles.mapMenuWrapper}
                                    isMap={true}
									activeIndex={this.state.activeMenuIndexes[1] === mapMenuItemIndex ? this.state.activeMenuIndexes[2] : -1}
									isMainMenu={false}
									key={'map' + mapMenuItemIndex}
									showLengthOnSecondaryItems={true}
									ref={ref => (this.refSubmenus[1][mapMenuItemIndex] = ref)}
									secondaryMenuItemsClickHandler={this.mapMenuItemClicked}
									secondaryMenuItems={this.secondaryMenusData[mapMenuItemIndex]}
									refListItemsArray={this.refsMenuListItems[1][mapMenuItemIndex] as HTMLLIElement[]}
								/>
							</div>

							{/*All sub menus in (level 3) wrapped:*/}
							<div ref={ref => (this.refsMenuWrapperOuterWrappers[2] = ref)} className={styles.subMenusWrapper + ' ' + styles.thirdList}>
								{this.secondaryMenusData.map((menuCategory, menuIndex) => {
									this.refsMenuListItems[2][menuIndex] = [];
									//@ts-ignore:
									this.refSubmenus[2][menuIndex] = [];
									const isMap = menuIndex === this.secondaryMenusData.length - 1;
									return menuCategory.map((menu, index) => {
										this.refsMenuListItems[2][menuIndex][index] = [];
										this.refSubmenus[2][menuIndex][index] = [];
										return (
											<MobileMenuSubMenu
												animationDirection={this.animationDirection}
												closeCallback={this.props.closeHandler}
												activeIndex={this.state.activeMenuIndexes[2] === index ? this.state.activeMenuIndexes[3] : -1}
												isMainMenu={false}
                                                isThirdLevelMenu={true}
												key={index}
												wrapperClass={styles.thirdList + (isMap ? ' ' + styles.mapThirdList : '')}
												ref={ref => (this.refSubmenus[2][menuIndex][index] = ref)}
												firstMenuItems={menu.items}
												firstMenuItemsClickHandler={this.tertiaryMenuItemClicked}
												refListItemsArray={this.refsMenuListItems[2][menuIndex][index] as HTMLLIElement[]}
                                                intl={this.props.intl}
											>
                                            </MobileMenuSubMenu>
										);
									});
								})}
							</div>

							{/* Prviews (level 3) wrapped:*/
								!this.state.hidePreviewWrapper && (
									<div ref={ref => (this.refsMenuWrapperOuterWrappers[3] = ref)} className={`${styles.subMenusWrapper} ${styles.previewWrapper}`}>
										<MobileMenuPreviewItem
											closeCallback={this.props.closeHandler}
											currentLanguage={this.props.currLanguage.langKey}
											menuData={this.state.menuData}
											url={this.state.currentPreviewURL}
											ref={ref => (this.refMenuItemPreview = ref)}
											currentID={this.state.selectedID}
										/>
									</div>
								)
							}
						</div>
						{
                            isMobile &&
                            <MobileMenuSocialCopyright
                                refSocialLinks={this.refSocialLinks}
                                footerCopyrightMessage={this.props.footerCopyrightMessage}
                                instagramLink={this.activeMenu.instagramLink}
                                twitterLink={this.activeMenu.twitterLink}
                                alternateURL={this.props.alternateURL}
                                langs={this.props.langs}
                            >
                                {this.props.children}
                            </MobileMenuSocialCopyright>
                        }
					</div>

					{/* Menu sidebar (top bar on mobile) */}
					<div className={styles.sideBar}>
                        <>
                            <div
                                ref={ref => (this.refMobileNavigationButton = ref)}
                                onClick={this.mobileBackNavigationItemClicked}
                                onKeyDown={this.topshortmenuBackButtontabbed}
                                className={styles.mobileNavigationLink + (mobileBackButtonVisible ? ' ' + styles.mobileNavigationLinkVisible : '')}
                                tabIndex={0}
                                id={'backbtnmainnav'}
                            >
                                <FormattedMessage id="Back" />
                            </div>
                            <GatsbyLink
                                title={this.props.intl.formatMessage({ id: 'QFlogomenubartitle' })}
                                aria-label={this.props.intl.formatMessage({ id: 'QFlogomenubararialabel' })}
                                ref={ref => (this.refLogo = ref)}
                                onClick={this.props.closeHandler}
                                className={styles.logo}
                                to={this.props.currLanguage.link}
                            />
                            {
                                isMobile && (
                                    <>
                                        <DarkModeToggle />
                                    </>
                                )
                            }
                            {
                                !isMobile && (
                                    <a
                                        title={this.props.intl.formatMessage({ id: 'closemenutitle' })}
                                        className={styles.closeButton}
                                        href="#close-menu"
                                        id="close-menu"
                                        onClick={this.props.closeHandler}
                                        aria-label={this.props.intl.formatMessage({ id: 'closemenuarialabel' })}
                                    />
                                )
                            }
                        </>
					</div>
				</div>
			</nav>
		);
	}
}

export const query = graphql`
	fragment MobileMenuFragment on ContentfulMenu {
		node_locale
		twitterLink
		instagramLink
		menuItems {
			id
			label
			path
			subpages {
				... on ContentfulPageEducationCitySpeakerSeries {
                    id
                    slug
                    title
                }
                ... on ContentfulPageVertical {
                    id
                    title
                    slug
                }
                ... on ContentfulMenuItem {
                    id
                    label

                    subpages {
                        ... on ContentfulPageVertical {
                            id
                            title
                            slug
                        }
                    }
                }
			}
            introText
		}
		secondaryMenuItems {
			id
			title
			path
		}
		mapCategories {
			title
			id
			references {
				contentful_id
				title
				slug
				filterVerticalCategory {
					title
					slug
				}
			}
		}
	}
`;
