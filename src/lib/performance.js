import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import {db} from "@/src/lib/firebase";

export const logPerformanceMetric = async (metricName, value) => {
    try {
        await setDoc(doc(db, 'performance_metrics', `${metricName}_${Date.now()}`), {
            name: metricName,
            value: value,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error logging performance metric:', error);
        throw new Error('Failed to log performance metric');
    }
};

export const measurePageLoadTime = (pageName) => {
    if (typeof window !== 'undefined') {  // Check if we're in the browser
        const startTime = performance.now();
        window.addEventListener('load', async () => {
            const endTime = performance.now();
            const loadTime = endTime - startTime;

            try {
                await logPerformanceMetric(`${pageName}_load_time`, loadTime);
            } catch (error) {
                console.error('Error measuring page load time:', error);
            }
        });
    }
};
