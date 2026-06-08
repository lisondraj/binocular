export type LocationLabel = {
  city: string;
  region: string;
};

export function formatLocationLabel({ city, region }: LocationLabel): string {
  if (city && region) return `${city}, ${region}`;
  return city || region;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<LocationLabel | null> {
  const url = new URL(
    "https://api.bigdatacloud.net/data/reverse-geocode-client",
  );
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("localityLanguage", "en");

  const response = await fetch(url.toString());
  if (!response.ok) return null;

  const data = (await response.json()) as {
    city?: string;
    locality?: string;
    principalSubdivision?: string;
  };

  const city = data.city || data.locality || "";
  const region = data.principalSubdivision || "";

  if (!city && !region) return null;

  return { city, region };
}
