import Navbar from '@/components/Navbar'
import Welcome from '@public/markdown/about.mdx'
import "@public/CSS/about-page.css";
import { overrideComponents } from '@/components/overrideComponents';

export default function Page() {
    return (
        <>
            <div className='m-8 mt-0 pt-8 items-center flex flex-col justify-center'>
                <div className='w-full'>
                    <Navbar />
                </div>
                <div className='max-w-3xl mt-0 lg:mx-auto'>
                    <Welcome components={overrideComponents} />
                </div>
            </div>
        </>
    )
}