import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleProgramsList.module.scss';
import { ContentfulModuleProgramsListFragment, PageVerticalQuery_allContentfulPageProgram } from '../../gatsby-queries';
import { ProgramListItem } from '../ListItems/ProgramListItem';
import { getPagePath } from '../../utils/URLHelper';
import { FormattedMessage } from 'react-intl';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

const initialState = { activeSchool: '', activeDegree: '' };
type State = Readonly<typeof initialState>;

export default class ModuleProgramsList extends Component<{ programs?: PageVerticalQuery_allContentfulPageProgram; data: ContentfulModuleProgramsListFragment }, State> {
	readonly state: State = initialState;

	private schools: { id: string; title: string }[] = [];
	private degrees: { id: string; title: string }[] = [];
	private schoolsList: HTMLSelectElement;
	private degreesList: HTMLSelectElement;

	private showScoolsFilter = false;
	private showDegreesFilter = false;

	constructor(props) {
		super(props);
		props.programs.edges.forEach(edge => {
			this.schools[edge.node.filterEntity.contentful_id] = { id: edge.node.filterEntity.contentful_id, title: edge.node.filterEntity.title };
			this.degrees[edge.node.filterProgramType.contentful_id] = { id: edge.node.filterProgramType.contentful_id, title: edge.node.filterProgramType.title };
		});
		this.showScoolsFilter = Object.keys(this.schools).length > 1;
		this.showDegreesFilter = Object.keys(this.degrees).length > 1;
	}

	private onSelectChangeHandler = () => {
		if (this.showScoolsFilter) {
			const activeSchool = this.schoolsList.selectedIndex > 0 ? this.schoolsList.options[this.schoolsList.selectedIndex].value : '';
			this.setState({ activeSchool: activeSchool });
		}
		if (this.showDegreesFilter) {
			const activeDegree = this.degreesList.selectedIndex > 0 ? this.degreesList.options[this.degreesList.selectedIndex].value : '';
			this.setState({ activeDegree: activeDegree });
		}
	};

	render() {
		return (
			<div className={`module-margin ${styles.wrapper}`}>
				{(this.showScoolsFilter || this.showDegreesFilter) && (
					<ViewableMonitor>
						<div>
							{this.showScoolsFilter && (
								<div className="SelectList">
									<label>
										<FormattedMessage id={'programs_filter_list_schools'} />
									</label>
									<select ref={ref => (this.schoolsList = ref)} value={this.state.activeSchool} onChange={this.onSelectChangeHandler}>
										<FormattedMessage id="All" tagName="option" />
										{Object.keys(this.schools).map(key => {
											return (
												<option value={this.schools[key].id} key={this.schools[key].id}>
													{this.schools[key].title}
												</option>
											);
										})}
									</select>
								</div>
							)}
							{this.showDegreesFilter && (
								<div className="SelectList">
									<label>
										<FormattedMessage id={'programs_filter_list_degrees'} />
									</label>
									<select ref={ref => (this.degreesList = ref)} value={this.state.activeDegree} onChange={this.onSelectChangeHandler}>
										<FormattedMessage id="All" tagName="option" />
										{Object.keys(this.degrees).map(key => {
											return (
												<option value={this.degrees[key].id} key={this.degrees[key].id}>
													{this.degrees[key].title}
												</option>
											);
										})}
									</select>
								</div>
							)}
						</div>
					</ViewableMonitor>
				)}
				<ViewableMonitor>
					<div className={styles.listHeadings}>
						<div className={styles.listHeading}>
							<FormattedMessage id={'Program & School'} />
						</div>
						<div className={styles.listHeading}>
							<FormattedMessage id={'Degree'} />
						</div>
					</div>
				</ViewableMonitor>
				<div className={styles.itemsWrapper}>
					<ul>
						{this.props.programs.edges.map((program, index) => {
							let visible = true;
							if (this.state.activeSchool !== '' && this.state.activeSchool !== program.node.filterEntity.contentful_id) {
								visible = false;
							}
							if (this.state.activeDegree !== '' && this.state.activeDegree !== program.node.filterProgramType.contentful_id) {
								visible = false;
							}
							return (
								<ViewableMonitor key={index}>
									<ProgramListItem
										visible={visible}
										school={program.node.filterEntity.title}
										degree={program.node.filterProgramType.title}
										url={getPagePath(program.node.slug, 'program')}
										title={program.node.title}
									/>
								</ViewableMonitor>
							);
						})}
					</ul>
				</div>
			</div>
		);
	}
}

export const query = graphql`
	fragment ContentfulModuleProgramsListFragment on ContentfulModuleProgramsList {
		id
	}
`;
