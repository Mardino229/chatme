import { UserContext } from "@/constant";
import { type ReactNode, useState} from "react";


export function UserContextProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<{ name?: string; email?: string }>({});

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}