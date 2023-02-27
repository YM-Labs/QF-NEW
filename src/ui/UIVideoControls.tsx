import React from 'react';

export const PauseIcon = ({ onPlayerClick, onPlayerTab }) => {
	return (
		<svg
			tabIndex={0}
			// @ts-ignore
			title={'Homepage video pause button'}
			aria-label={'Homepage video pause button'}
			onClick={onPlayerClick}
			onKeyDown={onPlayerTab}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="#fff"
			strokeWidth="1"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="feather feather-pause"
		>
			<rect x="6" y="4" width="4" height="16"></rect>
			<rect x="14" y="4" width="4" height="16"></rect>
		</svg>
	);
};

export const PlayIcon = ({ onPlayerClick, onPlayerTab }) => {
	return (
		<svg
			tabIndex={0}
			// @ts-ignore
			title={'Homepage video play button'}
			aria-label={'Homepage video play button'}
			onClick={onPlayerClick}
			onKeyDown={onPlayerTab}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 20 24"
			fill="none"
			stroke="#ffffff"
			strokeWidth="1"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="feather feather-play"
		>
			<polygon points="5 3 19 12 5 21 5 3"></polygon>
		</svg>
	);
};
