
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
  address: string
}

export interface Post {
  id: string;
  caption: string | null;
  category: "General" | "Nature" | "Food" | "Traffic" | "Alert" | "LostFound";

  placeName: string | null;
  latitude: number;
  longitude: number;
  address: string;

  userId: string;
  user: User;

  images: Image[];
  votes: Vote[]
  comments: Comment[]


  createdAt: string;
  updatedAt: string;

  _count: {
    comments: number;
    votes: number;
  };


}

interface Vote {
  id: string,
  userId: string,
  postId: string,
  reaction: 'Like' | 'Love' | 'Fire'
}

interface Image {
  id: string;
  url: string;
  postId: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  profile: null;
}

export interface Comment {
  id: string,
  text: string,
  parentId: string | null
  postId: string;
  userId: string,
  user: User
  replies: Comment[]
  _count: {
    replies: number
  }
}