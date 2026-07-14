import https from "https";
import { Community } from "../models/community.model.js";

export const getCityFromCoordinates = (latitude, longitude) => {
    return new Promise((resolve) => {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;

        const options = {
            headers: {
                "User-Agent": "GreenTrack-App/1.0"
            }
        };

        https.get(url, options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed && parsed.address) {
                        const cityName = (
                            parsed.address.city ||
                            parsed.address.town ||
                            parsed.address.village ||
                            parsed.address.municipality ||
                            parsed.address.suburb ||
                            parsed.address.county ||
                            "GreenTrack Hub"
                        );
                        resolve(cityName);
                    } else {
                        resolve("GreenTrack Hub");
                    }
                } catch (e) {
                    console.error("Failed to parse Nominatim response:", e);
                    resolve("GreenTrack Hub");
                }
            });
        }).on("error", (err) => {
            console.error("Nominatim request error:", err);
            resolve("GreenTrack Hub");
        });
    });
};
export const getOrCreateCommunityByCoordinates = async (latitude, longitude) => {
    const lat = Number(latitude);
    const lon = Number(longitude);
    let community = await Community.findOne({
        boundary: {
            $geoIntersects: {
                $geometry: {
                    type: "Point",
                    coordinates: [lon, lat],
                },
            },
        },
    });

    if (community) {
        return community;
    }
    const cityName = await getCityFromCoordinates(lat, lon);
    community = await Community.findOne({ name: cityName });
    if (community) {
        return community;
    }
    community = await Community.create({
        name: cityName,
        boundary: {
            type: "Polygon",
            coordinates: [
                [
                    [lon - 0.2, lat - 0.2],
                    [lon + 0.2, lat - 0.2],
                    [lon + 0.2, lat + 0.2],
                    [lon - 0.2, lat + 0.2],
                    [lon - 0.2, lat - 0.2],
                ],
            ],
        },
    });

    console.log(`Dynamically created new community: '${cityName}'`);
    return community;
};
