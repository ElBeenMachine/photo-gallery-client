import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import axios, { AxiosError } from "axios";

export default NextAuth({
    // Here I add login providers
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },

            // Authorize callback is ran upon calling the signin function
            authorize: async(credentials) => {
                let user;
                try {
                    user = await axios.post(`${process.env.API_URL}/auth/signin`, {
                        email: credentials.email,
                        password: credentials.password
                    }, {
                        headers: {
                            "Accept": "*/*",
                            "Content-Type": "application/json"
                        }
                    });
                } catch (error) {
                    if(error instanceof AxiosError) {
                        if(error.response) {
                            throw new Error(error.response.data.message);
                        }
                    }
                }
                return user.data;
            }
        })
    ],
    // Make user information accessible for the token/session
    callbacks: {
        // We can pass in additional information from the user document MongoDB returns
        // Avatars, role, display name, etc...
        async jwt({ token, user }) {
            if(user) {
                token.accessToken = user.accessToken;
                token.user = {
                    _id: user.user._id,
                    role: user.user.role,
                    username: user.user.username,
                    fname: user.user.fname,
                    avatar: user.user.avatar || null
                };
            }
            return token;
        },

        // If we want to access extra user information from sessions we have to pass the token here to get them in sync:
        session: async({ session, token }) => {
            if(token) {
                session.user = token.user;
                session.accessToken = token.accessToken;
            }
            return session;
        }
    }
});