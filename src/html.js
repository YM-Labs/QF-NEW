import React from 'react';
import * as PropTypes from 'prop-types';
const propTypes = {
	headComponents: PropTypes.node.isRequired,
	body: PropTypes.node.isRequired,
	postBodyComponents: PropTypes.node.isRequired
};

class Html extends React.Component {
	render() {
		const { headComponents, body, postBodyComponents } = this.props;

		return (
			<html data-body-class="no-js" {...this.props.htmlAttributes}>
				<head>
					<meta charSet="utf-8" />
					<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
					<link rel="manifest" href="/site.webmanifest" />
					<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#11362a" />
					<meta name="msapplication-TileColor" content="#ffffff" />
					<meta name="theme-color" content="#ffffff" />
					{headComponents}
					<meta name="referrer" content="origin" />
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<style
						type="text/css"
						dangerouslySetInnerHTML={{
							__html:
								'.oldPR img{margin-top:60px;margin-bottom:60px;height:auto}@media (min-width:768px){.oldPR img{margin-top:150px;margin-bottom:150px}}@media (min-width:1480px){.oldPR img{margin-top:180px;margin-bottom:180px}'
						}}
					/>
				</head>
				<body id="top" data-swiftype-index="false" className='bg-white'>
					<div id="___gatsby" dangerouslySetInnerHTML={{ __html: body }} />
					{postBodyComponents}
				</body>
			</html>
		);
	}
}

Html.propTypes = propTypes;

export default Html;
