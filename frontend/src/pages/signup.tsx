import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {useRegister} from "@/utils/api.ts";
import {RotatingLines} from "react-loader-spinner";

const schema = z.object({
    pseudo: z.string().min(3, { message: "Pseudo trop court" }).nonempty({ message: "Pseudo requis" }),
    email: z.email({ message: "Email invalide" }).nonempty({ message: "Email requis" }),
    password: z.string().min(6, { message: "Mot de passe trop court" }).nonempty({ message: "Mot de passe requis" }),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const signup = useRegister();

    const onSubmit = (data: FormData) => {
        console.log('Form soumis', data);
        signup.mutate({
            name: data.pseudo,
            email: data.email,
            password: data.password
        })
    };

    return (
        <div className="min-h-dvh flex justify-center items-center dark:bg-gray-900">
            <div className="grid gap-8">
                <div
                    id="back-div"
                    className="bg-gray-200 rounded-[26px] m-4"
                >
                    <div
                        className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2"
                    >
                        <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-5xl text-center cursor-default">
                            Inscription
                        </h1>
                        <form onSubmit={handleSubmit(onSubmit)} method="post" className="space-y-4">
                            <div>
                                <label htmlFor="pseudo" className="mb-2 dark:text-gray-400 text-lg">Pseudo</label>
                                <input
                                    {...register('pseudo')}
                                    className="border p-3 dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                                    type="text"
                                    placeholder="Pseudo"
                                />
                                {errors.pseudo && <p className="text-red-600">{errors.pseudo.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="mb-2  dark:text-gray-400 text-lg">Email</label>
                                <input
                                    {...register('email')}
                                    className="border p-3 dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                                    type="email"
                                    placeholder="Email"
                                />
                                {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="mb-2 dark:text-gray-400 text-lg">Password</label>
                                <input
                                    {...register('password')}
                                    className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                                    type="password"
                                    placeholder="Password"
                                />
                                {errors.password && <p className="text-red-600">{errors.password.message}</p>}
                            </div>
                            <button
                                className={`${signup.isPending? "bg-white p-2 border flex justify-center": "bg-gray-400 hover:scale-105 transition duration-300 ease-in-out dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-6 p-2" }  cursor-pointer text-white rounded-lg w-full  `}
                                type="submit"
                                disabled={signup.isPending}
                            >
                                {signup.isPending? <RotatingLines
                                    visible={true}
                                    width="30"
                                    strokeColor="black"
                                    strokeWidth="5"
                                    animationDuration="0.75"
                                    ariaLabel="rotating-lines-loading"
                                /> : "Inscription"}
                            </button>
                        </form>
                        <div className="flex flex-col mt-4 items-center justify-center text-sm">
                            <h3 className="dark:text-gray-300">
                                Déjà un compte? {' '}
                                <Link
                                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                                    to="/login"
                                >
                                    <span
                                        className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                                    >
                                      Connectez-vous!
                                    </span>
                                </Link>
                            </h3>
                        </div>

                        {/*<div*/}
                        {/*    id="third-party-auth"*/}
                        {/*    className="flex items-center justify-center mt-5 flex-wrap"*/}
                        {/*>*/}
                        {/*    <a*/}
                        {/*        href="#"*/}
                        {/*        className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"*/}
                        {/*    >*/}
                        {/*        <img*/}
                        {/*            className="max-w-[25px]"*/}
                        {/*            src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"*/}
                        {/*            alt="Google"*/}
                        {/*        />*/}
                        {/*    </a>*/}
                        {/*    <a*/}
                        {/*        href="#"*/}
                        {/*        className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"*/}
                        {/*    >*/}
                        {/*        <img*/}
                        {/*            className="max-w-[25px]"*/}
                        {/*            src="https://ucarecdn.com/95eebb9c-85cf-4d12-942f-3c40d7044dc6/"*/}
                        {/*            alt="Linkedin"*/}
                        {/*        />*/}
                        {/*    </a>*/}
                        {/*    <a*/}
                        {/*        href="#"*/}
                        {/*        className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"*/}
                        {/*    >*/}
                        {/*        <img*/}
                        {/*            className="max-w-[25px] filter dark:invert"*/}
                        {/*            src="https://ucarecdn.com/be5b0ffd-85e8-4639-83a6-5162dfa15a16/"*/}
                        {/*            alt="Github"*/}
                        {/*        />*/}
                        {/*    </a>*/}
                        {/*    <a*/}
                        {/*        href="#"*/}
                        {/*        className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"*/}
                        {/*    >*/}
                        {/*        <img*/}
                        {/*            className="max-w-[25px]"*/}
                        {/*            src="https://ucarecdn.com/6f56c0f1-c9c0-4d72-b44d-51a79ff38ea9/"*/}
                        {/*            alt="Facebook"*/}
                        {/*        />*/}
                        {/*    </a>*/}
                        {/*    <a*/}
                        {/*        href="#"*/}
                        {/*        className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"*/}
                        {/*    >*/}
                        {/*        <img*/}
                        {/*            className="max-w-[25px] dark:gray-100"*/}
                        {/*            src="https://ucarecdn.com/82d7ca0a-c380-44c4-ba24-658723e2ab07/"*/}
                        {/*            alt="twitter"*/}
                        {/*        />*/}
                        {/*    </a>*/}

                        {/*    <a*/}
                        {/*        href="#"*/}
                        {/*        className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"*/}
                        {/*    >*/}
                        {/*        <img*/}
                        {/*            className="max-w-[25px]"*/}
                        {/*            src="https://ucarecdn.com/3277d952-8e21-4aad-a2b7-d484dad531fb/"*/}
                        {/*            alt="apple"*/}
                        {/*        />*/}
                        {/*    </a>*/}
                        {/*</div>*/}

                        {/*<div*/}
                        {/*    className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm"*/}
                        {/*>*/}
                        {/*    <p className="cursor-default">*/}
                        {/*        By signing in, you agree to our*/}
                        {/*        <a*/}
                        {/*            className="group text-blue-400 transition-all duration-100 ease-in-out"*/}
                        {/*            href="#"*/}
                        {/*        >*/}
                        {/*            <span*/}
                        {/*                className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"*/}
                        {/*            >*/}
                        {/*              Terms*/}
                        {/*            </span>*/}
                        {/*        </a>*/}
                        {/*        and*/}
                        {/*        <a*/}
                        {/*            className="group text-blue-400 transition-all duration-100 ease-in-out"*/}
                        {/*            href="#"*/}
                        {/*        >*/}
                        {/*            <span*/}
                        {/*                className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"*/}
                        {/*            >*/}
                        {/*              Privacy Policy*/}
                        {/*            </span>*/}
                        {/*        </a>*/}
                        {/*    </p>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}