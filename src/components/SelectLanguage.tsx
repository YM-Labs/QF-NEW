import * as React from 'react';
import Link from 'gatsby-link';
import * as Qs from 'qs';
import { getRelativeURL } from '../utils/URLHelper';

import * as styles from './SelectLanguage.module.scss';

interface Props {
	langs: Array<{ link: string; langKey: string; selected: boolean }>;
	alternateURL: string;
	inMenu: boolean;
	isSearch?: boolean;
}

function setJSON(key, value) {
    typeof window !== 'undefined' && window.localStorage.setItem(key, value);
}

const setPreferances = (lang: any) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    if(isMobile)
        document.getElementById('NavigationBg') && document.getElementById('NavigationBg').classList.remove("menu-open")
	setJSON('nf_lang', lang === 'en-US' ? 'en' : 'ar')
	setJSON('nf_country', lang === 'en-US' ? 'us' : 'qa');
    window.getSelection()?.removeAllRanges();
};

const SelectLanguage = (props: Props) => {
	let url = props.alternateURL
	if(props.isSearch) {
		url = props.alternateURL + '/#' + Qs.stringify(Qs.parse(window.location.hash.slice(1)), { encode: false })
	}
	return (
		<div className={props.inMenu ? styles.wrapperInMenu : styles.wrapper}>
			{props.langs?.map(lang => {
				if (!lang.selected) {
					return (
						<Link onClick={() => { setPreferances(lang.langKey)} } to={getRelativeURL(url)} key={lang.langKey}>
							{lang.langKey === 'en-US' ? 'English' : 'العربية'}
						</Link>
					);
				}
			})}
		</div>
	);
};

export default SelectLanguage;
