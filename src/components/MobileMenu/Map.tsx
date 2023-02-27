import * as React from 'react';
import * as styles from './Map.module.scss';
import { ResultItem } from './MobileMenu';
import { WrappedComponentProps, injectIntl } from 'react-intl';

class Map extends React.Component<
	{ className: string; menuData: { [key: string]: ResultItem }; currentLanguage: string; open: boolean; activeMarkerID: string; activeMarker: object } & WrappedComponentProps
> {
	private map: any;
	private wrapper: HTMLDivElement;
	private markersAdded = false;
	private currentMarkers: google.maps.Marker[] = [];

	private currentActiveMarker = null;
	private windowWidth: number;
	private panBy: number = 0;

	private infoWindow = null;

	private setDarkTheme = async () => {
		let mapThemeData = [
			{
				elementType: 'geometry',
				stylers: [
					{
						color: '#212121'
					}
				]
			},
			{
				elementType: 'labels.icon',
				stylers: [
					{
						visibility: 'off'
					}
				]
			},
			{
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#757575'
					}
				]
			},
			{
				elementType: 'labels.text.stroke',
				stylers: [
					{
						color: '#212121'
					}
				]
			},
			{
				featureType: 'administrative',
				elementType: 'geometry',
				stylers: [
					{
						color: '#757575'
					}
				]
			},
			{
				featureType: 'administrative.country',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#9e9e9e'
					}
				]
			},
			{
				featureType: 'administrative.land_parcel',
				stylers: [
					{
						visibility: 'off'
					}
				]
			},
			{
				featureType: 'administrative.locality',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#bdbdbd'
					}
				]
			},
			{
				featureType: 'poi',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#757575'
					}
				]
			},
			{
				featureType: 'poi.park',
				elementType: 'geometry',
				stylers: [
					{
						color: '#181818'
					}
				]
			},
			{
				featureType: 'poi.park',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#616161'
					}
				]
			},
			{
				featureType: 'poi.park',
				elementType: 'labels.text.stroke',
				stylers: [
					{
						color: '#1b1b1b'
					}
				]
			},
			{
				featureType: 'road',
				elementType: 'geometry.fill',
				stylers: [
					{
						color: '#2c2c2c'
					}
				]
			},
			{
				featureType: 'road',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#8a8a8a'
					}
				]
			},
			{
				featureType: 'road.arterial',
				elementType: 'geometry',
				stylers: [
					{
						color: '#373737'
					}
				]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry',
				stylers: [
					{
						color: '#3c3c3c'
					}
				]
			},
			{
				featureType: 'road.highway.controlled_access',
				elementType: 'geometry',
				stylers: [
					{
						color: '#4e4e4e'
					}
				]
			},
			{
				featureType: 'road.local',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#616161'
					}
				]
			},
			{
				featureType: 'transit',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#757575'
					}
				]
			},
			{
				featureType: 'water',
				elementType: 'geometry',
				stylers: [
					{
						color: '#000000'
					}
				]
			},
			{
				featureType: 'water',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#3d3d3d'
					}
				]
			}
		];
		this.map.setOptions({ styles: mapThemeData });
	};

	private setLightTheme = async () => {
		let mapThemeData = [
			{
				featureType: 'administrative',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'on'
					},
					{
						gamma: '1.82'
					}
				]
			},
			{
				featureType: 'administrative',
				elementType: 'labels.text.fill',
				stylers: [
					{
						visibility: 'on'
					},
					{
						gamma: '1.96'
					},
					{
						lightness: '-9'
					}
				]
			},
			{
				featureType: 'administrative',
				elementType: 'labels.text.stroke',
				stylers: [
					{
						visibility: 'off'
					}
				]
			},
			{
				featureType: 'landscape',
				elementType: 'all',
				stylers: [
					{
						visibility: 'on'
					},
					{
						lightness: '25'
					},
					{
						gamma: '1.00'
					},
					{
						saturation: '-100'
					}
				]
			},
			{
				featureType: 'poi.business',
				elementType: 'all',
				stylers: [
					{
						visibility: 'off'
					}
				]
			},
			{
				featureType: 'poi.park',
				elementType: 'all',
				stylers: [
					{
						visibility: 'off'
					}
				]
			},
			{
				featureType: 'road',
				elementType: 'geometry.stroke',
				stylers: [
					{
						visibility: 'off'
					}
				]
			},
			{
				featureType: 'road',
				elementType: 'labels.icon',
				stylers: [
					{
						visibility: 'off'
					}
				]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry',
				stylers: [
					{
						hue: '#ffaa00'
					},
					{
						saturation: '-43'
					},
					{
						visibility: 'on'
					}
				]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry.stroke',
				stylers: [
					{
						visibility: 'off'
					}
				]
			},
			{
				featureType: 'road.highway',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'simplified'
					},
					{
						hue: '#ffaa00'
					},
					{
						saturation: '-70'
					}
				]
			},
			{
				featureType: 'road.highway.controlled_access',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'on'
					}
				]
			},
			{
				featureType: 'road.arterial',
				elementType: 'all',
				stylers: [
					{
						visibility: 'on'
					},
					{
						saturation: '-100'
					},
					{
						lightness: '30'
					}
				]
			},
			{
				featureType: 'road.local',
				elementType: 'all',
				stylers: [
					{
						saturation: '-100'
					},
					{
						lightness: '40'
					},
					{
						visibility: 'off'
					}
				]
			},
			{
				featureType: 'transit.station.airport',
				elementType: 'geometry.fill',
				stylers: [
					{
						visibility: 'on'
					},
					{
						gamma: '0.80'
					}
				]
			},
			{
				featureType: 'water',
				elementType: 'all',
				stylers: [
					{
						visibility: 'off'
					}
				]
			}
		];
		this.map.setOptions({ styles: mapThemeData });
	};

	private mapsAPILoadedCallback = async () => {
		this.map = new google.maps.Map(this.wrapper, {
			center: { lat: 25.313964, lng: 51.4394043 },
			zoom: 15,
			disableDefaultUI: true
		});
		this.map.panBy(this.panBy, 0);
		let darkMode = document.body.classList.contains('dark-mode');
		if (darkMode) {
			window.google && this.setDarkTheme();
		} else {
			window.google && this.setLightTheme();
		}
		this.setupMarkers();
	};

	private setPanBy = () => {
		let desktop = this.props.currentLanguage === 'ar-QA' ? 730 : -730;
		let mobile = this.props.currentLanguage === 'ar-QA' ? 431 : -431;
		this.windowWidth = window.innerWidth;
		this.panBy = desktop * 0.5;
		if (this.windowWidth < 768) {
			this.panBy = desktop * 0.5;
		} else if (this.windowWidth < 1380) {
			this.panBy = mobile * 0.5;
		}
	};

	private setupMarkers = () => {
		if (this.map && this.props.menuData && this.markersAdded === false) {
			if (this.currentMarkers.length >= 0) {
				Object.values(this.currentMarkers).forEach(marker => marker.setMap(null));
				this.currentMarkers = [];
			}

			const values = Object.values(this.props.menuData);
			values.forEach(node => {
				// @ts-ignore
				if (node.node_locale === this.props.currentLanguage && node.location && node.location.placeLocation) {
					let marker = new google.maps.Marker({
						// @ts-ignore
						position: { lat: node.location.placeLocation.lat, lng: node.location.placeLocation.lon },
						icon: {
							path: google.maps.SymbolPath.CIRCLE,
							scale: 6,
							strokeWeight: 10,
							fillOpacity: 1,
							strokeColor: '#ff2080',
							strokeOpacity: 0,
							fillColor: '#E95C2F'
						},
						map: this.map
					});
					// @ts-ignore
					marker.setTitle(node.location.placeName);
					// @ts-ignore
					marker.set('address', node.location.placeAddress);
					marker.addListener('click', () => this.markerClickHandler(node));
					// @ts-ignore
					this.currentMarkers[node.contentful_id] = marker;
				}
			});
			this.markersAdded = true;
			if (this.currentMarkers[this.props.activeMarkerID]) this.highlightActiveMarker();
		}
	};

	private highlightActiveMarker = () => {
		let newMarker = null;
		let curLang = this.props.currentLanguage === 'ar-QA' ? 'rtl' : 'ltr';
		if (this.props.activeMarkerID.includes('___ar-QA')) {
			newMarker = this.currentMarkers[this.props.activeMarkerID.replace(/___ar-QA/g, '')];
		} else {
			newMarker = this.currentMarkers[this.props.activeMarkerID];
		}
		if (this.currentActiveMarker && newMarker !== this.currentActiveMarker) {
			if (this.currentActiveMarker.getAnimation()) {
				this.currentActiveMarker.setAnimation(null);
				// @ts-ignore
				if (!this.props.activeMarker.visible) {
					this.infoWindow.close(this.map);
				}
			}
			this.currentActiveMarker = null;
		}
		if (newMarker) {
			this.map.setZoom(16);
			// @ts-ignore
			this.map.panTo(newMarker.position);
			this.map.panBy(this.panBy, 0);
			this.currentActiveMarker = newMarker;
			if (!this.currentActiveMarker.getAnimation()) {
				this.currentActiveMarker.setAnimation(google.maps.Animation.BOUNCE);
			}

			if (this.infoWindow) {
				this.infoWindow.close();
			}
			this.infoWindow = window.google && new google.maps.InfoWindow({ maxWidth: 300 });
			this.infoWindow &&
				this.infoWindow.setOptions({
					// @ts-ignore
					content:
						"<div class='map-box-content'>" +
						"<h4 class='text-style-h4'>" +
						newMarker.getTitle() +
						"</h4><div class='text-style-description " +
						curLang +
						"'>" +
						newMarker.get('address') +
						" <br /><br /><a target='_blank' href='https://www.google.com/maps/dir//" +
						newMarker.get('address') +
						"'>" +
						this.props.intl.formatMessage({ id: 'location.get_directions' }) +
						'</a></div></div>',
					// @ts-ignore
					position: newMarker.position,
					pixelOffset: new google.maps.Size(0, -25)
				});
			this.infoWindow && this.infoWindow.open(this.map);
		}
	};

	private markerClickHandler = node => {
		//@ts-ignore:
		window.location.hash = '#map-' + node.contentful_id;
	};

	componentDidUpdate(prevProps: Readonly<{ menuData: { [p: string]: ResultItem }; currentLanguage: string; activeMarkerID: string }>): void {
		let darkMode = typeof document !== 'undefined' && document.body.classList.contains('dark-mode');
		if (prevProps.currentLanguage !== this.props.currentLanguage) {
			this.markersAdded = false;
		}
		if (darkMode) {
			window.google && this.setDarkTheme();
		} else {
			window.google && this.setLightTheme();
		}
		this.setPanBy();
		this.setupMarkers();
		this.highlightActiveMarker();
	}

	componentDidMount(): void {
		if ((window as any).GOOGLE_MAPS_LOADED !== true) {
			(window as any).GOOGLE_MAPS_LOADED_CACALLBACK = this.mapsAPILoadedCallback;
		} else {
			this.mapsAPILoadedCallback();
		}

		window.addEventListener('resize', this.resizeHandler);
		this.resizeHandler();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeHandler);
	}

	private resizeHandler = () => {
		this.setPanBy();
	};

	public render() {
		return <div ref={ref => (this.wrapper = ref)} className={`${styles.wrapper} ${this.props.open ? styles.open : ''} ${this.props.className}`} />;
	}
}

// @ts-ignore
export default injectIntl(Map);
