import {createContext, type Dispatch, type SetStateAction} from "react";

type UserContextProps = {
    user?: {
        name?: string;
        email?: string;
        receiver?: string;
    };
    setUser: Dispatch<SetStateAction<{ name?: string; email?: string; receiver?: string }>>;
};

export const UserContext = createContext<UserContextProps>({setUser: ()=>{}});
