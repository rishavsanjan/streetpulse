
export interface CreatePost {
    caption: string,
    image: string[],
    category: "General" |
    "Nature" |
    "Food" |
    "Traffic" |
    "Alert" |
    "LostFound",
    placeName: string,
    latitude: number
    longitude: number
    address : string
}