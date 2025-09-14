import React from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { GooglePlacesService } from "@/lib/google-places";

const containerStyle = {
	width: "100%",
	height: "600px",
};


const defaultCenter = {
	lat: 37.7749,
	lng: -122.4194,
};


const GoogleMapComponent: React.FC = () => {
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: apiKey,
	});

	const [center, setCenter] = React.useState(defaultCenter);
	const [selectedRestaurant, setSelectedRestaurant] = React.useState<number | null>(null);
	const [restaurants, setRestaurants] = React.useState<any[]>([]);

	React.useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setCenter({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
				},
				() => {
					// If user denies location, keep default center
				}
			);
		}
	}, []);

	React.useEffect(() => {
		async function fetchRestaurants() {
			const service = new GooglePlacesService("");
			const data = await service.searchNearbyRestaurants({ location: center, radius: 1000, type: "restaurant" });
			// Map Google Places results to marker format
			setRestaurants(
				(data || []).map((place: any) => ({
					id: place.place_id,
					name: place.name,
					position: { lat: place.lat, lng: place.lng },
				}))
			);
		}
		fetchRestaurants();
	}, [center]);

	if (loadError) {
		return <div>Error loading Google Maps</div>;
	}
	if (!isLoaded) {
		return <div>Loading Map...</div>;
	}

	// Hide default POI/landmarks
	const mapOptions = {
		styles: [
			{
				featureType: "poi",
				elementType: "all",
				stylers: [{ visibility: "off" }],
			},
			{
				featureType: "transit.station",
				elementType: "all",
				stylers: [{ visibility: "off" }],
			},
		],
	};


				return (
					<GoogleMap
						mapContainerStyle={containerStyle}
						center={center}
						zoom={14}
						options={mapOptions}
					>
						{/* User location marker */}
						<Marker
							position={center}
							icon={{
								path: google.maps.SymbolPath.CIRCLE,
								scale: 8,
								fillColor: '#4285F4',
								fillOpacity: 1,
								strokeWeight: 2,
								strokeColor: 'white',
							}}
						/>
						{/* Live restaurant markers */}
						{restaurants.map((r) => (
							<Marker
								key={r.id}
								position={r.position}
								icon={{
									url: "data:image/svg+xml;utf8,<svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='16' cy='16' r='14' fill='%23FF7043' stroke='white' stroke-width='3'/><text x='16' y='21' text-anchor='middle' font-size='14' fill='white' font-family='Arial' font-weight='bold'>🍽️</text></svg>",
									scaledSize: new google.maps.Size(32, 32),
								}}
								onClick={() => setSelectedRestaurant(r.id)}
							/>
						))}
										{selectedRestaurant !== null && (
											<InfoWindow
												position={restaurants.find(r => r.id === selectedRestaurant)?.position}
												onCloseClick={() => setSelectedRestaurant(null)}
											>
												<div style={{ minWidth: 100, fontWeight: 600 }}>
													{restaurants.find(r => r.id === selectedRestaurant)?.name}
												</div>
											</InfoWindow>
										)}
					</GoogleMap>
				);
};

export default GoogleMapComponent;
