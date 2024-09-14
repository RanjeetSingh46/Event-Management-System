import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Box, Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react';
import { auth, db } from "@/src/lib/firebase";

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(true);
    const toast = useToast();

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({
                title: "Signed in successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create a user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                createdAt: new Date(),
                events: []
            });

            toast({
                title: "Account created successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setIsSigningIn(true);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box as="form" onSubmit={isSigningIn ? handleSignIn : handleSignUp}>
            <VStack spacing={4}>
                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                    />
                </FormControl>
                <Button type="submit" colorScheme="blue">
                    {isSigningIn ? 'Sign In' : 'Sign Up'}
                </Button>
                <Button variant="link" onClick={() => setIsSigningIn(!isSigningIn)}>
                    {isSigningIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </Button>
            </VStack>
        </Box>
    );
};

export default Auth;