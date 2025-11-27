import React, { useState } from "react";
import type { ProductForm } from "../types/Product";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AddProduct: React.FC = () => {
    const [product, setProduct] = useState<ProductForm>({
        name: "",
        price: "",
        quantity: "",
        description: ""
    });

    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const onSave = async () => {
        try {
            await axios.post(`${apiUrl}/api/products/`, product);
            alert("Product saved successfully!");
            navigate("/product");
        } catch (err: any) {
            alert("Error saving product: " + err.message);
        }
    }

    return(
        <>
            <h1 className="text-3xl">Add New Product</h1>
            <form 
                onSubmit={e => {
                    e.preventDefault();
                    onSave();
                }}
            >
                <div>
                    <p className="inline-block">
                        Name: 
                    </p>
                    <input 
                        required
                        className="border-2 ml-3 rounded-md p-1"
                        type="text" 
                        value={product.name} 
                        onChange={e => setProduct({ ...product, name: e.target.value })}
                    />
                </div>
                <div className="my-2">
                    <p className="inline-block">
                        Price: 

                    </p>
                    <input 
                        required
                        className="border-2 ml-3 rounded-md p-1"
                        type="number" 
                        value={product.price} 
                        onChange={e => setProduct({ ...product, price: Number(e.target.value) })}
                    />
                </div>
                <div className="my-2">   
                    <p className="inline-block">
                        Quantity: 
                    </p>
                    <input 
                        required
                        className="border-2 ml-3 rounded-md p-1"
                        type="number" 
                        value={product.quantity} 
                        onChange={e => setProduct({ ...product, quantity: Number(e.target.value) })}
                    />
                </div>
                <div className="my-2">
                    <p className="inline-block">
                        Description: 
                    </p>
                    <input 
                        required
                        className="border-2 ml-3 rounded-md p-1"
                        type="text" 
                        value={product.description} 
                        onChange={e => setProduct({ ...product, description: e.target.value })}
                    />
                </div>
                <button 
                    className="bg-red-600 text-amber-50 rounded-2xl w-28 p-2"
                    type="submit"
                >
                    Add
                </button>
            </form>
        </>
    )
}

export default AddProduct;