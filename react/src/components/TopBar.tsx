import React from "react";
import { Link } from "react-router-dom";

const TopBar: React.FC = () => {
    return (
        <nav className="bg-gray-800 p-1.5 px-6">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-lg font-bold">
                    <img src="ume.png" alt="" className="size-11 mx-2"/>
                </Link>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/product" className="text-gray-300 hover:text-white">Products</Link>
                    </li>
                    <li>
                        <Link to="/add_new_product" className="text-gray-300 hover:text-white">Add</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default TopBar;
