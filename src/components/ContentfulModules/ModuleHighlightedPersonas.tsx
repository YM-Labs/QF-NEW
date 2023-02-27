import * as React from 'react';
import * as styles from './ModuleHighlightedPersonas.module.scss';
import { ContentfulModuleHighlightedPersonasFragment } from '../../gatsby-queries';
import { getPagePath } from '../../utils/URLHelper';
import ViewableMonitor from '../ui/ViewableMonitor';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql, Link } from 'gatsby';


function ModuleHighlightedPersonas(props: { data: ContentfulModuleHighlightedPersonasFragment, currentSlug?: any }) {

	let lengthClass = styles.length4;
	let gapClass = '';

	const founder = '5dJnCIB4nYGuuWUgqk8EWC';
	const board_of_trustees = '2CGNuzLGFCCacmOUyUOacC';
	const board_of_directors = '3uDxYqevhHwCvA12GUbacH';
	const leadership = '4fAVzB7dgTpNHpBOEGvb30';

	const hh_moza = '4HqGj0J3pCKcia6wK0yOG4';
	const he_hind = '1OLdZbnzzY9pF49QWOea2S';

	if (props.data.personas && props.data.personas.length === 2) {
		lengthClass = styles.length2;
	} else if (props.data.personas && props.data.personas.length === 3) {
		lengthClass = styles.length3;
	} else {
		gapClass = 'gap-' + (4 - (props.data.personas && props.data.personas.length % 4));
	}

	return (
		<div className={`module-margin ${styles.wrapper} ${lengthClass} ${gapClass}`} role="tabpanel">
			{props.data.personas && props.data.personas.map((persona, index) => {
				return (
					<ViewableMonitor key={persona.id + index}>
						<Link to={getPagePath(persona.slug, 'persona')} className={`${styles.personaWrapper} ${persona.introductionText === null && persona.modulesWrapper === null && styles.disabledLink}`} tabIndex={0}>
							{
                                // @ts-ignore
                                <GatsbyImageWrapper alt={persona.name} image={persona.previewImage && persona.previewImage} />
                            }
								<span className={styles.department}>
									{
										persona.filterDepartment.map((department, index) => {
											// @ts-ignore
											if(props.data.contentful_id === founder) {
												return persona.contentful_id === hh_moza ? (index === 1 ? department.title : null) : department.title
											}
											if(props.data.contentful_id === board_of_trustees) {
												if (persona.contentful_id === hh_moza) {
													return index === 0 ? department.title : null
												} else {
													return persona.contentful_id === he_hind ? (index === 0 ? department.title : null) : department.title
												}
											} else if(props.data.contentful_id === board_of_directors || props.data.contentful_id === leadership) {
												if (persona.contentful_id === he_hind || persona.contentful_id === hh_moza) {
													return index === 0 ? department.title : null
												} else {
													return department.title
												}
											// @ts-ignore	
											} else if(props.data.showDepartment) {
												return index === 0 ? department.title : null
											}
										})
									}
								</span>
							<h2 className={`text-style-h2 ${styles.name}`}>{persona.name}</h2>
							{props.data.showDescription && <p className={`text-style-body ${styles.description}`}>{persona.introductionText && persona.introductionText.introductionText}</p>}
						</Link>
					</ViewableMonitor>
				);
			})}
		</div>
	);
}

export default ModuleHighlightedPersonas;

export const query = graphql`
	fragment ContentfulModuleHighlightedPersonasFragment on ContentfulModuleHighlightedPersonas {
		id
		contentful_id
		showDescription
		showDepartment
		personas {
			id
			contentful_id
			slug
			name
			introductionText {
				introductionText
			}
			filterDepartment {
				contentful_id
				title
			}
			previewImage {
				gatsbyImageData(
                    placeholder: NONE
                    height: 642
                    width: 502
                    quality: 85
                  )
			}
			modulesWrapper {
				id
			}
		}
	}
`;
