import React from 'react';

const serverURL = `http://localhost:3001/api/`
const Test = () => {
    const [message, setMessage] = React.useState("");

    const serverFetch = async () => {
        const response = await fetch(serverURL);
        console.log(response);
        const jsonData = await response.json();
        setMessage(jsonData.message);
    };

    React.useEffect(() => {
        serverFetch();
    }, []);
    return (
        <div>
        <h1>Test App</h1>
        <h2>{message}</h2>
        </div>
    )
}

export default Test
