import Navbar from '@/components/Navbar'
import Welcome from '@public/markdown/createAlbum.mdx'
import "@public/CSS/about-page.css";
import { overrideComponents } from '@/components/overrideComponents';
import { ScrollProgress } from '@/components/magicui/scroll-progress';

export default function Page() {
    return (
        <>
            <div className='m-4 md:md-8 mt-0 pt-4 items-center flex flex-col justify-center'>
                <ScrollProgress className="top-0" />
                <div className='w-full'>
                    <Navbar />
                </div>
                <div className='max-w-3xl lg:mx-auto'>
                    <Welcome components={overrideComponents} />
                </div>
            </div>
        </>
    )
}