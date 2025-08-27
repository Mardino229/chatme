import {useSocketMessages} from "@/utils/useSocketMessages.ts";
import { useMessages } from "../utils/useMessages";
import { useUserContext } from "@/components/layout/userContext.tsx";
import {type FormEvent, useEffect, useRef, useState} from "react";
import {socket} from "@/utils/socket.ts";
import {useNavigate, useParams} from "react-router-dom";

interface MessagesProps {
    id?: string;
}

export default function Messages({ id }: MessagesProps) {
    const { user } = useUserContext();
    const { data, isLoading, error } = useMessages(id);
    const [message, setMessage] = useState("");
    const { pseudo } = useParams();
    const  navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    // socket.on('Authentication error', (err) => {
    //     console.error('Erreur de connexion :', err.message);
    //     window.location.reload(false);
    // });



    useSocketMessages({ currentUserId: user?.email, selectedUserId: user?.receiver, selectUser: id });

    const handleSend = (e: FormEvent) => {
        e.preventDefault();

        if (!message.trim()|| !id) return;
        const newMsg = {
            content: message,
            senderId: user?.email,
            receiverId: id,
        };

        // envoie au serveur
        socket.emit('sendMessage', newMsg);
        setMessage("")
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }, [data]);

    return (
        <div className="flex-grow h-full flex flex-col">
            {/* Header */}
            <div className="w-full bg-gray-100 p-1 dark:bg-gray-800 shadow-md rounded-xl rounded-bl-none rounded-br-none">
                <div className="flex p-2 align-middle items-center">
                    <div className="p-2 md:hidden rounded-full mr-1 text-gray-900">
                        <button
                            type="button"
                            onClick={()=>navigate('/')}
                            className="inline-flex items-center p-2 text-sm rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <svg
                                className="w-6 h-6"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    clipRule="evenodd"
                                    fillRule="evenodd"
                                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <div className="border rounded-full border-white p-1/2">
                        <img className="w-14 h-14 rounded-full" src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png" alt="avatar"/>
                    </div>
                    <div className="flex-grow p-2">
                        <div className="text-md font-semibold">{pseudo}</div>
                        {/*<div className="flex items-center">*/}
                        {/*    <div className="w-2 h-2 bg-green-300 rounded-full"></div>*/}
                        {/*    <div className="text-xs text-gray-50 ml-1">Online</div>*/}
                        {/*</div>*/}
                    </div>
                    <div className="p-2 text-white cursor-pointer rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </div>
                </div>
            </div>
            {/* Messages */}
            <div className="w-full mx-auto flex-grow bg-gray-100 dark:bg-gray-900 my-2 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {isLoading && <div className="text-center bg-white h-full flex justify-between items-center"><p>Chargement des messages....</p></div>}
                    {error && <div className="text-center bg-white h-full flex justify-between items-center"><p>Erreur lors du chargement des messages</p></div>}
                    {data && Array.isArray(data.messages) && data.messages.length > 0 ? (
                        data.messages.map((msg: {senderId: string, id: number, content: string, timestamp: string}) => {
                            const isMine = user?.email === msg.senderId;
                            return (
                                <div key={msg.id} className={`flex items-end ${isMine ? 'justify-end' : 'w-3/4'}`}>
                                    {!isMine && (
                                        <img className="w-8 h-8 m-3 rounded-full" src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png" alt="avatar" />
                                    )}
                                    <div className={`p-3 ${isMine ? ' bg-gray-800 ' : 'bg-gray-400'} mx-3 my-1 rounded-2xl ${isMine ? 'rounded-br-none' : 'rounded-bl-none'} `}>
                                        <div className={`text-white font-semibold  pb-2 dark:text-gray-200`}>
                                            {msg.content}
                                        </div>
                                        <div className="text-xs text-white">
                                            {new Date(msg.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center h-full bg-white flex justify-between items-center"></div>
                    )}
                </div>
                <div ref={messagesEndRef}/>
            </div>
            {/* Footer */}
             <form className="p-3 rounded-xl rounded-tr-none rounded-tl-none bg-gray-100 dark:bg-gray-800" onSubmit={handleSend}>
                <div className="flex items-center">
                    <div className="p-2 text-gray-600 dark:text-gray-200 ">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="search-chat flex flex-grow p-2">
                        <input
                            className="input text-gray-700 dark:text-gray-200 text-base p-1 focus:outline-none bg-gray-100 dark:bg-gray-800 flex-grow rounded-l-md"
                            type="text"
                            placeholder="Type your message ..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-500 cursor-pointer dark:bg-gray-800 dark:text-gray-200 flex justify-center items-center p-3 text-white rounded-r-md" disabled={!message.trim()}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}



