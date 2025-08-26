
import ConversationItem from "./conversationItem.tsx";
import { useConversations } from "../utils/useConversations";
import { useNavigate } from "react-router-dom";
import {UserContext} from "@/constant.ts";
import {useContext} from "react";

const formatTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    if (diffHour < 24) {
        if (diffHour >= 1) return `il y a ${diffHour} heure${diffHour > 1 ? 's' : ''}`;
        if (diffMin >= 1) return `il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
        return "il y a quelques secondes";
    }
    if(timestamp === "") {
        return ""
    }
    return date.toLocaleDateString();
};

const Conversation = () => {
    const { data, isLoading, error } = useConversations();
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext);

    if (isLoading) return <div>Chargement...</div>;
    if (error) return <div>Erreur lors du chargement des conversations</div>;

    return (
        <div className="p-1">
            {Array.isArray(data) && data.length > 0 ? (
                data.map((conv, index) => (
                    <div key={index} onClick={() => {
                        setUser({...user, receiver: conv.user.email})
                        navigate(`/${conv.user.id}/${conv.user.name}`)
                    }} className="cursor-pointer">
                        <ConversationItem
                            name={conv.user.name}
                            message={conv.lastMessage.content}
                            time={formatTime(conv.lastMessage.timestamp)}
                            active={false}
                        />
                    </div>
                ))
            ) : (
                <div>Aucune conversation trouvée</div>
            )}
        </div>
    );
};

export default Conversation;
