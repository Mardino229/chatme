import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUserContext } from "@/components/layout/userContext.tsx";

export default function PrivateRoute() {
    const { user } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.email) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    if (!user) return null;

    return <Outlet />;
}
