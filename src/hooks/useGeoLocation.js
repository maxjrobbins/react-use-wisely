// Access device location
import { useState, useEffect } from 'react';

/**
 * Hook that provides geolocation data
 * @param {Object} options - Geolocation API options
 * @returns {Object} - Geolocation state and error
 */
const useGeolocation = (options = {}) => {
	const [state, setState] = useState({
		loading: true,
		accuracy: null,
		altitude: null,
		altitudeAccuracy: null,
		heading: null,
		latitude: null,
		longitude: null,
		speed: null,
		timestamp: null,
		error: null
	});

	useEffect(() => {
		if (!navigator.geolocation) {
			setState(prevState => ({
				...prevState,
				loading: false,
				error: new Error('Geolocation is not supported by your browser')
			}));
			return;
		}

		const geoSuccess = (position) => {
			const {
				coords: {
					accuracy,
					altitude,
					altitudeAccuracy,
					heading,
					latitude,
					longitude,
					speed
				},
				timestamp
			} = position;

			setState({
				loading: false,
				accuracy,
				altitude,
				altitudeAccuracy,
				heading,
				latitude,
				longitude,
				speed,
				timestamp,
				error: null
			});
		};

		const geoError = (error) => {
			setState(prevState => ({
				...prevState,
				loading: false,
				error
			}));
		};

		// Start watching position
		const watchId = navigator.geolocation.watchPosition(
			geoSuccess,
			geoError,
			options
		);

		// Clean up
		return () => {
			navigator.geolocation.clearWatch(watchId);
		};
	}, [options]);

	return state;
};

export default useGeolocation;
