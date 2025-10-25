import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
    return (
        <div className='flex items-center justify-center min-h-screen  text-gray-900'>
            <div className='text-center rounded-xl flex gap-4'>
                <div className='size-36'>
                    <img src='/illustration.png' className='w-full' />
                </div>
                <div>
                    <h1 className='text-6xl font-bold text-primary'>401</h1>
                    <p className='text-gray mt-2 text-lg'>Page Unauthorized</p>
                    <Link to='/' className='mt-4 inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition'>
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
