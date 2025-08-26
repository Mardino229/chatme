import { useMutation } from '@tanstack/react-query';
import {axiosClient} from "./axios.ts";
import {toast} from "sonner";
import { useNavigate } from "react-router-dom";
import {useUserContext} from "@/components/layout/userContext.tsx";

const useLogin = () => {
    const navigate = useNavigate();
    const {setUser} = useUserContext();
    const {mutate, isPending} = useMutation({
        mutationFn: async (data: { email: string; password: string }) =>{
            const response = await axiosClient.post('auth/login', data)
            console.log(response.data.user)
            setUser(response.data.user)
            return {
                success: true,
                user: response.data.user,
            };
        },
        onSuccess: () => {
            // Par exemple, sauvegarder token, invalider queries etc
            toast('Connexion réussie');
            navigate(`/`);
        },
        onError: (error) => {
            console.error(error);
            const err = error as unknown as {
                response: {
                    data: {
                        error: string
                    }
                };
            }
            toast("Connexion échoué", {
                description: err.response.data.error,
            });
            return {
                success: false,
                message: error.message,
            };
        },
    })
    return { mutate, isPending };
}

const useRegister = () => {

    const navigate = useNavigate();

    return useMutation({
            mutationFn: async (data: { name: string; email: string; password: string }) =>{
                const response = await axiosClient.post('/auth/register', data)
                toast(response.data.message, {
                    description: "Vous pouvez vous connectez",
                })
            },
            onSuccess: () => {
                // Par exemple, sauvegarder token, invalider queries etc.
                navigate(`/login`);
            },
            onError: (error) => {
                console.error(error);
                const err = error as unknown as {
                    response: {
                        data: {
                            error: string
                        }
                    };
                }
                toast("Inscription échoué", {
                    description: err.response.data.error,
                })
            },
        }
    );
}

export { useLogin, useRegister };
