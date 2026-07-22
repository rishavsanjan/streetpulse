import api from "@/lib/axios";
import { User } from "@/types/auth";
import { LoginInput, RegisterInput } from "@/validators/auth";

export interface RegisterResponse {
    id: string,
    name: string
    email: string
}

export interface LoginResponse {
    token: string,
    user: User
}



export const register = async (data: RegisterInput): Promise<RegisterResponse> => {

    const user = await api.post("/auth/register", data);

    return user.data;


}

export const login = async (data: LoginInput): Promise<LoginResponse> => {
    const user = await api.post("/auth/login", data);
    return user.data.data;
}

export const getCurrentUser = async (): Promise<User> => {
    console.log(" i m running")
    const user = await api.get("/profile/me");

    return user.data.user.user;
}
