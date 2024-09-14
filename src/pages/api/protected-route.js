
import {withAuth} from "@/src/lib/security";

const handler = (req, res) => {
    if (req.method === 'GET') {

        res.status(200).json({ message: 'Protected data' });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default withAuth(handler);
