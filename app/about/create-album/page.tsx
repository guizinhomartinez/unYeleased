import Navbar from '@/components/Navbar'
import Welcome from '@public/markdown/createAlbum.mdx'
import "@public/CSS/about-page.css";
import { overrideComponents } from '@/components/overrideComponents';

export default function Page() {
    return (
        <>
            <div className='m-8 mt-0 pt-8 items-center flex flex-col justify-center'>
                <div className='w-full'>
                    <Navbar activeItem={2} />
                </div>
                <div className='max-w-3xl mx-4 lg:mx-auto'>
                    <Welcome components={overrideComponents} />
                </div>
            </div>
        </>
    )
}