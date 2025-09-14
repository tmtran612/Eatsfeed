from fastapi import Body
import os
import requests
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse, RedirectResponse

GOOGLE_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
router = APIRouter()

@router.get("/api/places/nearby")
def nearby_search(lat: float = Query(...), lng: float = Query(...), radius: int = Query(1000)):
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "type": "restaurant",
        "key": GOOGLE_API_KEY,
    }
    resp = requests.get(url, params=params)
    data = resp.json()
    # Return only basic info and place IDs for frontend
    restaurants = []
    for r in data.get("results", []):
        restaurants.append({
            "name": r.get("name"),
            "lat": r.get("geometry", {}).get("location", {}).get("lat"),
            "lng": r.get("geometry", {}).get("location", {}).get("lng"),
            "place_id": r.get("place_id"),
            "rating": r.get("rating"),
            "price_level": r.get("price_level"),
            "vicinity": r.get("vicinity"),
            "types": r.get("types", []),
            "photo_reference": r.get("photos", [{}])[0].get("photo_reference") if r.get("photos") else None
        })
    return JSONResponse(content={"restaurants": restaurants})

@router.post("/api/places/details/batch")
def batch_place_details(place_ids: list = Body(...)):
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    details = []
    for pid in place_ids:
        params = {
            "place_id": pid,
            "key": GOOGLE_API_KEY,
        }
        resp = requests.get(url, params=params)
        data = resp.json()
        if data.get("status") == "OK":
            details.append(data.get("result"))
    return JSONResponse(content={"details": details})
@router.get("/api/places/details")
def place_details(place_id: str = Query(...)):
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    # Request specific fields for detailed restaurant information
    fields = [
        "place_id", "name", "formatted_address", "formatted_phone_number",
        "website", "rating", "price_level", "opening_hours", "reviews",
        "photos", "geometry", "types", "vicinity", "business_status"
    ]
    params = {
        "place_id": place_id,
        "fields": ",".join(fields),
        "key": GOOGLE_API_KEY,
    }
    resp = requests.get(url, params=params)
    data = resp.json()
    
    # Format the response to match our expected structure
    if data.get("status") == "OK" and "result" in data:
        result = data["result"]
        formatted_result = {
            "place_id": result.get("place_id"),
            "name": result.get("name"),
            "formatted_address": result.get("formatted_address"),
            "formatted_phone_number": result.get("formatted_phone_number"),
            "website": result.get("website"),
            "rating": result.get("rating"),
            "price_level": result.get("price_level"),
            "vicinity": result.get("vicinity"),
            "business_status": result.get("business_status"),
            "types": result.get("types", []),
            "geometry": result.get("geometry"),
            "opening_hours": result.get("opening_hours"),
            "reviews": result.get("reviews", [])[:5],  # Limit to first 5 reviews
            "photos": result.get("photos", [])[:3],  # Limit to first 3 photos
        }
        return JSONResponse(content={"result": formatted_result, "status": "OK"})
    
    return JSONResponse(content=data)

@router.get("/api/places/photo")
def place_photo(photo_reference: str = Query(...), maxwidth: int = Query(400)):
    if not GOOGLE_API_KEY:
        return JSONResponse(content={"error": "Google API key not configured"}, status_code=500)

    url = "https://maps.googleapis.com/maps/api/place/photo"
    params = {
        "photoreference": photo_reference,
        "maxwidth": maxwidth,
        "key": GOOGLE_API_KEY,
    }

    try:
        resp = requests.get(url, params=params, allow_redirects=False)

        if resp.status_code == 302 and "Location" in resp.headers:
            return RedirectResponse(resp.headers["Location"])
        elif resp.status_code == 200:
            return RedirectResponse(url=resp.url)
        else:
            return JSONResponse(content={"error": f"Photo not found, status: {resp.status_code}, body: {resp.text}"}, status_code=404)
    except Exception as e:
        return JSONResponse(content={"error": "Failed to fetch photo"}, status_code=500)
