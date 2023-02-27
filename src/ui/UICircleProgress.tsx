import * as React from 'react';

const HALF_PI = Math.PI / 2;
const TWICE_PI = Math.PI * 2;
export class UICircleProgress extends React.Component<{ className: string; index: number; clickCallback: (index) => void }> {
	private refPath: SVGPathElement;
	private _progress: number = 0;

	private static createSvgArc(x, y, r, startAngle, endAngle) {
		if (startAngle > endAngle) {
			let s = startAngle;
			startAngle = endAngle;
			endAngle = s;
		}
		if (endAngle - startAngle > Math.PI * 2) {
			endAngle = Math.PI * 1.99999;
		}

		const largeArc = endAngle - startAngle <= Math.PI ? 0 : 1;

		return ['M', x, y, 'L', x + Math.cos(startAngle) * r, y - Math.sin(startAngle) * r, 'A', r, r, 0, largeArc, 0, x + Math.cos(endAngle) * r, y - Math.sin(endAngle) * r, 'L', x, y].join(' ');
	}

	public get progress() {
		return this._progress;
	}

	public set progress(progress: number) {
		this._progress = progress;
		this.refPath.setAttribute('d', UICircleProgress.createSvgArc(13, 13, 13, HALF_PI - TWICE_PI * progress, HALF_PI));
	}

	public render() {
		return (
			<li onClick={this.clickHandler} className={this.props.className}>
				<svg viewBox="0 0 26 26">
					<path ref={ref => (this.refPath = ref)} fill="white" opacity="0.2" stroke="none" strokeWidth="0" />
				</svg>
			</li>
		);
	}

	private clickHandler = event => {
		if (event) {
			event.preventDefault();
		}
		this.props.clickCallback(this.props.index);
	};
}
