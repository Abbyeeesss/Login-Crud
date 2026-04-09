import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPages() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signin, errors: signinErrors, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const onSubmit = handleSubmit(data => {
        signin(data);
    });

    useEffect(() => {
        if (isAuthenticated) navigate("/tasks");
    }, [isAuthenticated]);

    return (
        <div className="center-container">
             <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
                {
                    signinErrors.map((error, i) => (
                        <div className="bg-red-500 p-2 text-white my-2" key={i}>{error}</div>
                ))}
                <h1 className="text-2xl font-light tracking-wide my-2">Login</h1>
                <form
                onSubmit={onSubmit}>
                
                <input type="email" {...register("email", { required: true })}
                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                    placeholder="Email" />
                      {
                        errors.email && <p className="text-red-500">Email is required</p>
                    }

                <input type="password"{...register("password", { required: true })}
                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                    placeholder="Password" />
                      {
                        errors.password && (<p className="text-red-500">Password is required</p>
                    )}

                <button type="submit" className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-md my-2 text-white">Login</button>
            </form>

            <p className="flex gap-x-2 justify-between mt-4">
                Don&apos;t have an account? <Link to="/register" className="text-sky-500">Sign up</Link>
            </p>
             </div>
        </div>
    );
}
export default LoginPages;