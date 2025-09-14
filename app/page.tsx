import HomePage from "@/components/homePage";
import { fetchHomeInfo } from "@/lib/server-fetching";

export default async function Page() {
    const data = await fetchHomeInfo();

    return (
        <HomePage data={data} />
    )
}