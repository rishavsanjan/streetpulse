"use client"
import UpdateProfileModel from '@/components/UpdateProfileModel';
import api from '@/lib/axios';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const Profile = () => {

    const [profileUpdateModel, setProfileUpdateModel] = useState(false);
    const userData = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await api.get("/profile/me");
            console.log(res.data)
            return res.data.user.user;
        }
    })

    const user: User = userData.data ?? {};


    if (!user || userData.isPending) {
        return (
            <div>
                loading...
            </div>
        )
    }


    return (
        <div className='flex relative'>
            <div className='flex flex-col'>
                <div className='flex flex-row'>
                    {
                        user.profile === null || user.profile?.avatar?.length === 0 ?
                            <img
                                alt='profile-null'
                                src={"https://img.icons8.com/?size=100&id=7820&format=png&color=000000"}
                            />
                            :
                            <img
                                alt='profile-image'
                                src={user.profile?.avatar ?? ""}
                            />


                    }

                    <span>{user.name}</span>
                </div>

                <div className='flex flex-row'>
                    <div className='flex flex-col'>
                        <span>Followers</span>
                        <span>{user._count.followers}</span>
                    </div>
                    <div className='flex flex-col'>
                        <span>Following</span>
                        <span>{user._count.following}</span>
                    </div>
                </div>
                <div>
                    {
                        user.profile === null ?
                            <button
                                onClick={() => {
                                    setProfileUpdateModel(true)
                                }}
                            >
                                Set up your profile
                            </button>
                            :
                            <button
                                onClick={() => {
                                    setProfileUpdateModel(true)
                                }}
                            >
                                Update your profile
                            </button>
                    }


                </div>
            </div>
            {
                profileUpdateModel &&
                <div className='absolute w-full '>
                    
                    <UpdateProfileModel
                        user={user}
                        setCloseModel={setProfileUpdateModel}
                    />
                </div>
            }




        </div>
    )
}

export default Profile