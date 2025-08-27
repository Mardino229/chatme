import Conversation from "./conversation.tsx";
import Logout from "../assets/logout.svg";
import Messages from "./messages.tsx";
import { useUserContext } from "@/components/layout/userContext.tsx";
import { useParams, useNavigate } from "react-router-dom";
import { useLogout } from "../utils/useLogout";
// import {useState} from "react"; // supprimé, plus utilisé

const Chat = () => {
    const { user, setUser } = useUserContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const { mutate: logout, isPending } = useLogout();
    // Suppression de isOpen/setIsOpen inutilisés

    // Suppression de handleToggle, plus utilisé

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                setUser({});
                navigate('/login');
            }
        });
    };

    return (
        <div className="h-dvh">
            <div className="flex bg-white dark:bg-gray-900">
                {/* Liste des conversations (toujours visible en md+, conditionnelle en mobile) */}
                <div className={`lg:w-100 md:w-80 w-screen h-screen dark:bg-gray-800 bg-gray-100 p-2 ${id ? 'hidden md:block' : ''}`}>
                    <div className="h-full overflow-y-auto">
                        <div className="flex items-center justify-between p-3">
                            <div className="text-xl font-extrabold text-gray-600 dark:text-gray-200">Bienvenue {user?.name}</div>
                            <button
                                className="ml-4 px-4 py-2 cursor-pointer"
                                onClick={handleLogout}
                                disabled={isPending}
                            >
                                <img className="w-8" src={Logout} alt="Déconnexion"/>
                            </button>
                        </div>
                        <div className="search-chat flex p-3">
                            <input
                                className="input text-gray-700 dark:text-gray-200 text-sm p-3 focus:outline-none bg-gray-200 dark:bg-gray-700  w-full rounded-l-md"
                                type="text" placeholder="Search Messages"/>
                            <div
                                className="bg-gray-200 dark:bg-gray-700 flex justify-center items-center pr-3 text-gray-400 rounded-r-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-5" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </div>
                        </div>
                        <div className="text-lg font-semibol text-gray-600 dark:text-gray-200 p-3">Recent</div>
                        <Conversation/>
                    </div>
                </div>
                {/* Affichage des messages, responsive */}
                <div className={`flex-grow h-screen p-2 rounded-md items-center ${id ? 'flex' : 'hidden'} md:flex justify-center`}>
                    {id === undefined ? (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m2-4h4a2 2 0 012 2v4H7V6a2 2 0 012-2z" />
                            </svg>
                            <span className="mt-4 text-gray-500 dark:text-gray-400">Sélectionnez une conversation</span>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col">
                            <Messages id={id} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
