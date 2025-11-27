import React from "react";
import { Link } from "react-router-dom";


const Home: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            <p>This is a simple home page for your application.</p>

            <Link to="/product" className="underline text-red-600">Go to Product Page</Link>
        </div>
    );
};

export default Home;
