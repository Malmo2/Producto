import { useState, useEffect } from 'react'

function getGreeting() {
    const h = new Date().getHours();
    return h < 10 ? "Good Morning" : h < 18 ? "Good afternoon" : "Good evening";
};

function Greeting({ children }) {
    const [greeting, setGreeting] = useState('');


    useEffect(() => {
        setGreeting(getGreeting());


        const id = setInterval(() => {
            setGreeting(getGreeting());
        }, 60 * 1000);

        return () => clearInterval(id)


    }, [])

    return (
        <h2>
            {greeting}
            {children}
        </h2>
    );
}

export default Greeting;


