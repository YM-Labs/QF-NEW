import React, { useState } from 'react';
import useDarkMode from 'use-dark-mode';
import Icon from './UIThemeControls';

import * as styles from './DarkModeToggle.module.scss';

const darkProgressIndicator = () => {
	var indicator = typeof document !== 'undefined' && document.getElementById('gatsby-plugin-page-progress');
	if (indicator) indicator.style.backgroundColor = '#6BCDB2';
};

const lightProgressIndicator = () => {
	var indicator = typeof document !== 'undefined' && document.getElementById('gatsby-plugin-page-progress');
	if (indicator) indicator.style.backgroundColor = '#e14524';
};

const DarkModeToggle = () => {
	const [mode, setMode] = useState(false);
	const { value } = useDarkMode(false);
	const darkMode = useDarkMode(mode);

	const toggleTheme = event => {
		if (event) {
			event.preventDefault();
		}
		var target = event.currentTarget.parentNode
		if ( target.className.indexOf('sun_animated') > -1 ) {
			target.className = 'moon_animated';
		} else {
			target.className = 'sun_animated';
		}
		setMode(!mode);
		var embedClasses = [".twitter-tweet", ".twitter-timeline", ".twitter-follow-button", ".twitter-share-button"].join(",");
		if (document.querySelector(embedClasses) !== null) {
			window.location.reload();
		}
		
	};

	if (typeof window !== 'undefined' && localStorage.getItem('darkMode') === 'true') {
		typeof window !== 'undefined' && localStorage.setItem('progressBarColor', '#6BCDB2');
		darkProgressIndicator();
	} else {
		lightProgressIndicator();
		typeof document !== 'undefined' && localStorage.setItem('progressBarColor', '#e14524');
	}

	let isNativeDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
	if (typeof window !== 'undefined' && !localStorage.getItem('darkMode') && isNativeDarkMode) {
		typeof window !== 'undefined' && localStorage.setItem('progressBarColor', '#6BCDB2');
		darkProgressIndicator();
	}

	return (
		<div className={styles.wrapper}>
			<button id="mode" type="button" onClick={darkMode.toggle} tabIndex={0}>
				{value ? <Icon type="sun" onClick={toggleTheme} onTab={toggleTheme} /> : <Icon type="moon" onClick={toggleTheme} onTab={toggleTheme} />}
			</button>
		</div>
	);
};

export default DarkModeToggle;
