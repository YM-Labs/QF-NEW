const API_KEY = 'AIzaSyDcaRAmXxf0YNrhHPuf56dzjHiBvysQB_M';

export default class MapLoader {
	private static promise;
	map: google.maps.Map;

	public static load() {
		if (!MapLoader.promise) {
			// load once
			MapLoader.promise = new Promise(resolve => {
				window['__onGapiLoaded'] = () => {
					//console.log('gapi loaded');
					//@ts-ignore:
					resolve(window.gapi);
				};
				// console.log('loading..');
				const node = document.createElement('script');
				node.src = 'https://maps.googleapis.com/maps/api/js?key=' + API_KEY + '&callback=__onGapiLoaded';
				node.type = 'text/javascript';
				document.getElementsByTagName('body')[0].appendChild(node);
			});
		}

		return MapLoader.promise;
	}

	public initMap = () => {
		return MapLoader.load().then(() => {
			//@ts-ignore:
			window.GOOGLE_MAPS_LOADED = true;
			//@ts-ignore:
			if (window.GOOGLE_MAPS_LOADED_CACALLBACK) {
				//@ts-ignore:
				window.GOOGLE_MAPS_LOADED_CACALLBACK();
			}
		});
	};
}
