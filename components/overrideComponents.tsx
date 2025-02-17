function CustomH1({ children }: { children: React.ReactNode }) {
    return (
        <h1 className='text-5xl py-4 font-bold mt-10'>{children}</h1>
    )
}

function CustomH2({ children }: { children: React.ReactNode }) {
    return (
        <h2 className='text-3xl py-4 pb-0 font-semibold'>{children}</h2>
    )
}

function CustomH3({ children }: { children: React.ReactNode }) {
    return (
        <h3 className='text-2xl py-4 pb-0 font-semibold'>{children}</h3>
    )
}

function CustomP({ children }: { children: React.ReactNode }) {
    return (
        <p className='text-xl py-4'>{children}</p>
    )
}

export const overrideComponents = {
    h1: CustomH1,
    h2: CustomH2,
    h3: CustomH3,
    p: CustomP
};