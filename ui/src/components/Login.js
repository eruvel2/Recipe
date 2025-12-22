import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { LogIn } from 'lucide-react';

function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Get the Firebase ID token
            const idToken = await user.getIdToken();

            // Verify the user with our backend
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/verify-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to verify user');
            }

            // Store user data in local storage
            localStorage.setItem('user', JSON.stringify({
                email: user.email,
                name: user.displayName,
                canUpdate: data.user?.canUpdate || false
            }));

            // Redirect to home page
            window.location.href = '/';

        } catch (err) {
            // Sign out from Firebase if there's an error
            if (auth.currentUser) {
                await auth.signOut();
            }
            setError(err.message || 'Failed to sign in with Google. Please try again.');
            console.error('Google sign-in error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-blue-100 rounded-full mb-4 text-blue-600">
                        <LogIn size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Sign in to manage your recipes</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}

                <div className="mt-6">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google logo"
                            className="w-5 h-5"
                        />
                        {isLoading ? 'Signing in...' : 'Sign in with Google'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;