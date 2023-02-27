import * as React from 'react';

import * as styles from './MobileMenuSubMenu.module.scss';
import { TimelineMax } from 'gsap/dist/gsap.min';
import { EASE_CUSTOM_IN_OUT } from '../../utils/Constants';
import GatsbyLink from 'gatsby-link';
import GatsbyLinkExternalSupport from '../../ui/GatsbyLinkExternalSupport';

export type SubMenuItem = { node?: any; title?: string; contentful_id?: string; id: string; label?: string; slug?: string; path?: string };
const initialState = { vertical: null };
type State = Readonly<typeof initialState>;

export class MobileMenuSubMenu extends React.Component<{
	isMainMenu: boolean;
	mapActive?: boolean;
	firstMenuItems?: SubMenuItem[];
	secondaryMenuItems?: SubMenuItem[];
	firstMenuItemsClickHandler?: (event) => void;
	secondaryMenuItemsClickHandler?: (event) => void;
	mapClickHandler?: (event) => void;
	refListItemsArray: HTMLLIElement[];
	showLengthOnSecondaryItems?: boolean;
	wrapperClass?: string;
	activeIndex: number;
	closeCallback: (event) => void;
	animationDirection: 1 | -1;
    isMap?: boolean;
    currLang?: string;
    selectedVertical?: string;
    selectedItem?: string;
    total?: number;
    verticalClass?: string;
    isThirdLevelMenu?: boolean;
    intl?: any;
}, State> {
    readonly state: State = initialState;
	// Animation variables:
	private xItemsOut = -150;

	private refListItems: HTMLLIElement[] = [];
    private refAdditionalListItems: HTMLLIElement[] = [];
	private refWrapper: HTMLDivElement;
	//@ts-ignore:
	private refList: HTMLUListElement;

	private timeline: TimelineMax;

	private visible = false;

	public show = (instant = false) => {
		if (!this.visible) {
			this.visible = true;

			if (this.timeline) {
				this.timeline.kill();
				this.timeline = null;
			}

			this.timeline = new TimelineMax();
			this.timeline.set(this.refWrapper, { display: 'block' });
			this.timeline.to(this.refWrapper, 0.4, { opacity: 1, pointerEvents: 'all', force3D: true });
			this.timeline.staggerTo(this.refListItems, 0.85, { x: 0, ease: EASE_CUSTOM_IN_OUT, force3D: true }, 0.05, 0);
			this.timeline.staggerTo(this.refListItems, 0.85, { opacity: 1, force3D: true }, 0.05, 0.35);

            this.timeline.staggerTo(this.refAdditionalListItems, 0.85, { x: 0, ease: EASE_CUSTOM_IN_OUT, force3D: true }, 0.05, 0);
			this.timeline.staggerTo(this.refAdditionalListItems, 0.85, { opacity: 1, force3D: true }, 0.05, 0.35);

			if (instant) {
				this.timeline.progress(1);
			}
		}
	};

	public hide = (instant = false) => {
		if (this.visible) {
			this.visible = false;

			if (this.timeline) {
				this.timeline.kill();
				this.timeline = null;
			}

			this.timeline = new TimelineMax();
			this.timeline.set(this.refWrapper, { pointerEvents: 'none' });
			// this.timeline.to(this.refListItems, 0.4, {opacity: 0, force3D: true);
			this.timeline.to(this.refWrapper, 0.3, { opacity: 0, force3D: true }, 0);
			this.timeline.set(this.refListItems, { opacity: 0, x: this.xItemsOut * this.props.animationDirection, force3D: true });
            this.timeline.set(this.refAdditionalListItems, { opacity: 0, x: this.xItemsOut * this.props.animationDirection, force3D: true });
			this.timeline.set(this.refWrapper, { display: 'none' });
			if (instant) {
				this.timeline.progress(1);
			}
		}
	};

	public getWidth = () => {
		this.refWrapper.style.display = 'block';
		return this.refWrapper.clientWidth;
	};

	private shiftthemenufocus = event => {
		if (event.key == 'Enter') {
			this.props.firstMenuItemsClickHandler;
		}
	};

	public shiftthemenufocus1 = event => {
		var parent = event.target.parentElement.firstChild.getAttribute("href")

		if (event.key == 'Enter') {
			if (parent == '#map') {
				this.props.mapClickHandler;
                window.setTimeout(() => {
                    document.getElementById('mapMenu').getElementsByTagName('ul')[0].focus();
                }, 0);
			} else {
				this.props.secondaryMenuItemsClickHandler(event);
			}
		}
	};

    componentDidUpdate(): void {
        if(this.props.selectedVertical) {
            let elems = document.querySelectorAll(".selectedVertical");
            for (let i = 0; i < elems.length; i++) {
                // @ts-ignore
                elems[i].textContent = this.props.intl.formatMessage({ id: this.props.selectedVertical })
                elems[i].setAttribute("data-color", this.props.verticalClass)

                var newSpan = document.createElement('span');
                if(this.props.selectedItem) {
                    newSpan.className = 'selectedMenuVerticalItem'
                    newSpan.id = 'selectedMenuVerticalItem'
                    elems[i].appendChild(newSpan);
                    newSpan.textContent = " / " + this.props.intl.formatMessage({ id: this.props.selectedItem }) + " (" + this.props.total + ")";
                }
            }

            let ulelems = document.querySelectorAll("#ullistmenu");
            for (let i = 0; i < ulelems.length; i++) ulelems[i].className = styles[this.props.verticalClass];

            let intro_index = 0;
            if(this.props.verticalClass === 'purple') {
                intro_index = 1
            } else if(this.props.verticalClass === 'red') {
                intro_index = 2
            } else if(this.props.verticalClass === 'orange') {
                intro_index = 3
            }

            let intro = document.querySelectorAll("#intro");
            // @ts-ignore
            for (let i = 0; i < intro.length; i++) intro[i].innerHTML = document.getElementById('vertical-' + intro_index).innerText;
        }
    }

	public render() {
		const secondaryStartIndex = this.props.firstMenuItems ? this.props.firstMenuItems.length : 0;
        
		return (
			<div
                id={this.props.isMap && 'mapMenu'}
				ref={ref => (this.refWrapper = ref)}
				className={`${styles.wrapper} ${this.props.wrapperClass ? this.props.wrapperClass : ''} ${this.props.activeIndex > -1 ? styles.hasSelection : ''}`}
			>
				<div id='submenu' className={styles.menuColumnWrapper + ' ' + (this.props.isMainMenu ? styles.mainMenuWrapper : styles.subMenu)}>
					{
                        <>
                        {(!this.props.firstMenuItemsClickHandler || this.props.isThirdLevelMenu) && this.props.selectedVertical !== '' && (
                            <>
                                <h2 data-color={null} className={`${styles.vertical_title} selectedVertical`}>
                                    {this.props.selectedVertical}
                                </h2>
                                {!this.props.isThirdLevelMenu && <p className={styles.introText} id='intro' />}
                            </>
                        )}
						<ul id='ullistmenu' ref={ref => (this.refList = ref)} className={'ullistmenu'} tabIndex={0}>
							{this.props.firstMenuItems &&
                                // @ts-ignore
								this.props.firstMenuItems.map((menuItem, index) => {
                                    let path = '';
                                    let label = '';
                                    let id = menuItem.contentful_id ? menuItem.contentful_id : '';
                                    let link = false;
                                    if (menuItem.node) {
                                        path = menuItem.node.path;
                                        label = menuItem.node.pageContext.title;
                                        id = menuItem.node.pageContext.id;
                                        link = menuItem.node.link;
                                    } else {
                                        // @ts-ignore
                                        path = menuItem.path ? menuItem.path : menuItem.filterVerticalCategory && menuItem.filterVerticalCategory.slug ? menuItem.filterVerticalCategory.slug + '/' + menuItem.slug : menuItem.slug;
                                        label = menuItem.label ? menuItem.label : menuItem.title;
                                    }
                                    if (path?.indexOf('#') !== 0 && path?.indexOf('/') !== 0) {
                                        path = '/' + path;
                                    }

                                    return (
                                        <>
                                            <li
                                                ref={ref => {
                                                    this.props.refListItemsArray[index] = ref;
                                                    this.refListItems[index] = ref;
                                                }}
                                                className={`${this.props.isMainMenu && 'firstMenuItem'} ${this.props.isThirdLevelMenu && 'thirdLevelMenu'}`}
                                                key={index}
                                                // @ts-ignore
                                                data-null={menuItem.subpages?.map((item) => (!item.slug && true))[0]}
                                            >
                                                {this.props.firstMenuItemsClickHandler && (
                                                    <>
                                                        <p className={styles.intro_hidden} id={`vertical-${index}`}>
                                                            {
                                                                // @ts-ignore
                                                                menuItem.introText
                                                            }
                                                        </p>
                                                        <a
                                                            data-id={id}
                                                            data-link={link}
                                                            className={(this.props.isMainMenu || !this.props.secondaryMenuItems) && index === this.props.activeIndex ? styles.active : ''}
                                                            data-index={index}
                                                            onClick={this.props.firstMenuItemsClickHandler}
                                                            onKeyDown={this.shiftthemenufocus}
                                                            href={path}
                                                            tabIndex={0}
                                                            id={index === 0 && 'firstMenuItem'}
                                                        >
                                                            {label}
                                                        </a>
                                                    </>
                                                )}
                                                {!this.props.firstMenuItemsClickHandler && (
                                                    <GatsbyLinkExternalSupport
                                                        onClick={this.props.closeCallback}
                                                        activeClassName={styles.currentActivePageLink}
                                                        data-id={id}
                                                        data-index={index}
                                                        to={path}
                                                    >
                                                        {label}
                                                    </GatsbyLinkExternalSupport>
                                                )}
                                            </li>
                                            {
                                                // @ts-ignore
                                                !this.props.isMainMenu && menuItem.subpages &&
                                                    // @ts-ignore
                                                    menuItem.subpages.map((menuItemss, ind) => {
                                                            let isAbsoluteUrl = new RegExp('^(?:[a-z]+:)?//', 'i');
                                                            // @ts-ignore
                                                            let path = menuItemss.path ? menuItemss.path : menuItemss.slug;
                                                            if (path && path.indexOf('#') !== 0 && path.indexOf('/') !== 0) {
                                                                path = isAbsoluteUrl.test(menuItemss.path) ? path : '/' + path;
                                                            }
                                                            if(this.props.currLang === 'ar-QA') {
                                                                path = isAbsoluteUrl.test(path?.substring(4)) ? path?.substring(4) : path
                                                            }
                                                            return (
                                                                    <li
                                                                    // @ts-ignore
                                                                    ref={ref => this.refAdditionalListItems[ind] = ref}
                                                                    key={index}
                                                                    >
                                                                        {
                                                                            <GatsbyLink
                                                                                activeClassName={styles.currentActivePageLink}
                                                                                data-index={index}
                                                                                className={''}
                                                                                to={path}
                                                                            >
                                                                                {
                                                                                // @ts-ignore
                                                                                menuItemss.title ? menuItemss.title : menuItemss.label}
                                                                            </GatsbyLink>
                                                                        }
                                                                    </li>
                                                            );
                                                        })}
                                        </>
                                    );
								})}

							{this.props.secondaryMenuItems &&
								this.props.secondaryMenuItems.map((menuItem, index) => {
                                    let isAbsoluteUrl = new RegExp('^(?:[a-z]+:)?//', 'i');
									let path = menuItem.path ? menuItem.path : menuItem.slug;
									let idkt = menuItem && menuItem.id === 'idkt';
                                    let school = menuItem && menuItem.id === 'school';
                                    let entity = menuItem && menuItem.id === 'entities';
									if (path && path.indexOf('#') !== 0 && path.indexOf('/') !== 0) {
										path = isAbsoluteUrl.test(menuItem.path) ? path : '/' + path;
									}
									let isMapLink = path && path.indexOf('#map') === 0;
                                    if(this.props.currLang === 'ar-QA') {
                                        path = isAbsoluteUrl.test(path?.substring(4)) ? path?.substring(4) : path
                                    }
                                    
									return (
										<li
											key={index}
											// @ts-ignore
											className={idkt ? 'firstMenuItem' : `secondaryMenuItem${index === 0 && (school || entity) ? ' firstSecondaryItem' : menuItem.items && menuItem.items.length === 12 && menuItem.id === 'entities' ? ' firstSecondaryItem' : ''}`}
											ref={ref => {
												this.props.refListItemsArray[secondaryStartIndex + index] = ref;
												this.refListItems[secondaryStartIndex + index] = ref;
											}}
										>
											{(isMapLink || this.props.secondaryMenuItemsClickHandler) && (
												<a
													data-index={index}
													className={(isMapLink && this.props.mapActive) || (!this.props.isMainMenu && index === this.props.activeIndex) ? styles.active : ''}
													onClick={isMapLink ? this.props.mapClickHandler : this.props.secondaryMenuItemsClickHandler}
													href={path}
													onKeyDown={this.shiftthemenufocus1}
													tabIndex={0}
                                                    // @ts-ignore
                                                    data-id={menuItem.id}
                                                    data-items={(this.props.secondaryMenuItems[index] as any).items && (this.props.secondaryMenuItems[index] as any).items.length}
												>
													{menuItem.title ? menuItem.title : menuItem.label}
													{!idkt && this.props.showLengthOnSecondaryItems === true ? ` (${(this.props.secondaryMenuItems[index] as any).items.length})` : ''}
												</a>
											)}
											{!this.props.secondaryMenuItemsClickHandler && !isMapLink && (
												<GatsbyLink
													onClick={this.props.closeCallback}
													activeClassName={styles.currentActivePageLink}
													data-index={index}
													className={`${!this.props.isMainMenu && index === this.props.activeIndex ? styles.active : ''}`}
													to={path}
												>
													{menuItem.title ? menuItem.title : menuItem.label}
													{!idkt && this.props.showLengthOnSecondaryItems === true ? ` (${(this.props.secondaryMenuItems[index] as any).items.length})` : ''}
												</GatsbyLink>
											)}
										</li>
									);
								})}
						</ul>
                        </>
					}
				</div>
			</div>
		);
	}
}