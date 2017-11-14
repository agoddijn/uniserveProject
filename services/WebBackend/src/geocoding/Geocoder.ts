import { Site } from 'uniserve.m8s.types';
import { Log } from 'uniserve.m8s.utils';
import { createClient as createMapClient } from '@google/maps';

export interface Coordinates {
    lat: string,
    long: string
}

export class Geocoder {
    private static instance: Geocoder;
    private mapsClient: any;
    public static readonly FAIL_CODE = "GEOCODEFAIL";

    constructor() {

        if (Geocoder.instance) {
            return Geocoder.instance;
        } else {
            this.mapsClient = createMapClient({
                key: process.env.MAPS_KEY,
                Promise: Promise
            });
            Geocoder.instance = this;
        }

    }

    async geocode(site: Site): Promise<Coordinates> {
        let toReturn = { lat: "", long: "" }

        try {

            let response = await this.mapsClient.geocode({
                address: `${site.address1}, ${site.city}, ${site.province}, ${site.postal_code}`
            }).asPromise();

            response = response.json;

            switch(response.status) {
                case "OK":
                    toReturn.lat    = response.results[0].geometry.location.lat.toString();
                    toReturn.long   = response.results[0].geometry.location.lng.toString();
                    break;
                case "ZERO_RESULTS":
                    toReturn.lat    = Geocoder.FAIL_CODE;
                    toReturn.long   = Geocoder.FAIL_CODE;
                    break;
            }

        } catch (e) {
            Log.error("Geocoder::geocode ERROR: " + JSON.stringify(e));
        } finally {
            return toReturn;
        }

    }


}