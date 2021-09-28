import React, {useEffect} from 'react';

const Home = () => {
    useEffect(() => {
        document.title = 'Home / Hidden Room';
    }, []);

    return <div></div>;
};

export default Home;
