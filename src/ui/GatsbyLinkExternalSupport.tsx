import * as React from 'react';
import { Link } from 'gatsby';

// Since DOM elements <a> cannot receive activeClassName,
// destructure the prop here and pass it only to GatsbyLink
const GatsbyLinkExternalSupport = ({ children, to, ...other }: any) => {
	// Tailor the following test to your environment.
	// This example assumes that any internal link (intended for Gatsby)
	// will start with exactly one slash, and that anything else is external.
	const internal = /^\/(?!\/)/.test(to as string);

	// Use Gatsby Link for internal links, and <a> for others
	if (internal && !other.openinnewtab) {
		return (
			<Link to={to} {...other}>
				{children}
			</Link>
		);
	}
	return (
		<a target="_blank" href={to as string} {...other}>
			{children}
		</a>
	);
};

export default GatsbyLinkExternalSupport;
