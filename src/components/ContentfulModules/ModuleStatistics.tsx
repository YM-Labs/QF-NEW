import * as React from 'react';
import * as styles from './ModuleStatistics.module.scss';
import { Component } from 'react';
import { ContentfulModuleStatisticsFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { PieChart } from 'react-minimal-pie-chart';
import { graphql } from 'gatsby';
import Observer from '@researchgate/react-intersection-observer';

const initialState = { visible: false };
type State = Readonly<typeof initialState>;

class ModuleStatistics extends Component<{ data: ContentfulModuleStatisticsFragment; inline?: boolean; inlineFullWidth?: boolean }, State> {
	readonly state: State = initialState;
	handleChange = (event, unobserve) => {
		if (event.isIntersecting) {
			unobserve();
			// const target = event.target;
			this.setState({ visible: true });
		}
	};

	render() {
		return (
			<div className={`module-margin ${styles.wrapper + (this.props.inline === true ? ' ' + styles.inline : '') + (this.props.inlineFullWidth === true ? ' ' + styles.inlineFullWidth : '')}`}>
				<div className={`${styles.title}`}>{this.props.data.expandedStatsTitle.expandedStatsTitle}</div>
				<div className={`text-style-body ${styles.subtitle}`} dangerouslySetInnerHTML={{ __html: this.props.data.subtitle.childMarkdownRemark.html }} />
				{this.props.data.statisticCharts.map((chart, index) => {
					const chartClass = styles.chart + ' ' + chart.displayStyle[0].toLowerCase().replace(' ', '_') + (chart.displayAtHalfColumnWidth ? ' ' + styles.halfWidth : '');
					if (chart.displayStyle[0] === 'Pie Chart') {
						const data = chart.values.map((value) => {
							return { title: value.valueLabel, value: value.value, color: value.highlighted ? 'var(--pieChart-colorHighlighted)' : 'var(--pieChart-color)' };
						});
						return (
							<Observer onChange={this.handleChange}>
								<div key={index} className={chartClass + (this.state.visible ? ' moduleAnimateIn' : '')}>
									<PieChart
										data={data}
										reveal={this.state.visible ? 100 : 0}
										animate={true}
										animationDuration={800}
										lineWidth={50}
										paddingAngle={1}
										labelPosition={75}
										startAngle={-90}
										labelStyle={(index) => ({ fill: chart.values[index].highlighted ? 'var(--pieChart-textColorHighlighted)' : 'var(--pieChart-textColor)' })}
										label={({ dataEntry }) => dataEntry.title}
									/>
									<div className={styles.pieChartIdentifiers}>
										{chart.values.map((value, index) => <span className={value.highlighted ? styles.identifierHighlighted : ''} key={index}>{value.identifier}</span>)}
									</div>
								</div>
							</Observer>);
					} else if (chart.displayStyle[0] === 'Bar Chart') {
						return (
							<ViewableMonitor>
								<div key={index} className={chartClass}>
									{chart.values.map((value, index) => {
										return <div key={index} className={styles.valueWrapper}>
											<div className={styles.value + ' ' + (value.highlighted ? styles.highlighted : '')} style={{ '--data-value': value.value } as React.CSSProperties}>
												<span className={styles.valueLabel}>{value.valueLabel}</span>
											</div>
											<span className={styles.identifier}>{value.identifier}</span>
										</div>;
									})}
								</div>
							</ViewableMonitor>);
					} else {
						return (
							<ViewableMonitor>
								<div key={index} className={chartClass}>
									{chart.values.map((value, index) => {
										return <div key={index} className={styles.value + ' ' + (value.highlighted ? styles.highlighted : '')}
													style={{ '--data-value': value.value } as React.CSSProperties}><span
											className={styles.identifier}>{value.identifier}</span><span className={styles.valueLabel}>{value.valueLabel}</span></div>;
									})}
								</div>
							</ViewableMonitor>);
					}
				})}
					</div>
					);
				}
				}

	export
	default
	ModuleStatistics;

	export
	const
	query = graphql`
		fragment ContentfulModuleStatisticsFragment on ContentfulModuleStatisticS {
			id
			subtitle {
				childMarkdownRemark {
					html
				}
			}
			expandedStatsTitle {
				expandedStatsTitle
			}
			statisticCharts {
				displayStyle
				displayAtHalfColumnWidth
				values {
					value
					valueLabel
					identifier
					highlighted
				}
			}
		}
	`;
