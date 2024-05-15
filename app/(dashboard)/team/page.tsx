import { getTotalUsers, getUsers } from "@/actions/user-actions";
import TeamGrid from "@/components/team-grid";

export default async function TeamPage(){
    const users = await getUsers();
    const totalUsers = await getTotalUsers();
    return <TeamGrid data={users} total={totalUsers as number}/>
}