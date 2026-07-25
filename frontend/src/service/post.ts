import api from "@/lib/axios";
import { CreatePost } from "@/types/post";

export const handleCreatePost =  async(data : CreatePost) => {
    const res = await api.post("/post", data);

    return res.data;
} 