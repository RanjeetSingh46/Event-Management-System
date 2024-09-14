import { auth } from "@/src/lib/firebase";

export const isAuthenticated = () => {
    return auth.currentUser !== null;
};


export const getCurrentUserId = () => {
    return auth.currentUser ? auth.currentUser.uid : null;
};

export const withAuth = (handler) => {
    return async (req, res) => {
        const authHeader = req.headers.authorization;


        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }


        const token = authHeader.split(' ')[1];

        try {

            const decodedToken = await auth.verifyIdToken(token);
            req.userId = decodedToken.uid;
            return handler(req, res);
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ error: 'Invalid token' });
        }
    };
};
