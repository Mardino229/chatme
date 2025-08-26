

import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import {socket} from "@/utils/socket.ts";
type Message = {
    senderId: string, content: string, id: number, receiverId: string, timestamp: string
}
export function useSocketMessages({currentUserId, selectedUserId, selectUser}: {currentUserId?: string; selectedUserId?: string; selectUser?: string}) {
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleMessage = async (msg: {senderId: string, content: string, id:number, receiverId: string, timestamp: string}) => {
            const { senderId, receiverId } = msg;
            console.log('Received message', currentUserId, selectedUserId, senderId, receiverId);
            console.log("ok")

            const isRelevant =
                (senderId === currentUserId && receiverId === selectedUserId) ||
                (receiverId === currentUserId && senderId === selectedUserId);

            if (isRelevant) {
                console.log("ca doit marcher");

                queryClient.setQueryData<{ messages: Message[] }>(
                    ['messages', selectUser],
                    (old = { messages: [] }) => {
                        const safeMessages = Array.isArray(old.messages) ? old.messages : [];
                        return {
                            messages: [...safeMessages, msg],
                        };
                    }
                );
            }
            await queryClient.invalidateQueries({queryKey: ['conversations']})
        };

        socket.on('receiveMessage', handleMessage);

        return () => {
            socket.off('receiveMessage', handleMessage);
        };
    }, [currentUserId, selectUser, queryClient, selectedUserId]);
}
