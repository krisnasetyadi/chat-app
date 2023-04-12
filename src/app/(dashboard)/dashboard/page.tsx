import Button from "@/components/ui/button-component";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { FC } from "react";

interface dashboardProps {}
// : FC<dashboardProps>
const Dashboard = async () => {
    const session = await getServerSession(authOptions)
    
    return (
        <pre>
            {JSON.stringify(session)}
        </pre>
        // <Button>asd</Button>
    )
}

export default Dashboard