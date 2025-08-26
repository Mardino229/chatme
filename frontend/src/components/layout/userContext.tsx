import {useContext} from "react";
import {UserContext} from "@/constant.ts";


export function useUserContext() {
    return useContext(UserContext);
}