import { Outlet } from 'react-router-dom';
import NeuralBackground from '../components/NeuralBackground';

const AuthenticatedLayout: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-transparent overflow-hidden">
            {/* Neural Network Background - Fixed Layer */}
            <NeuralBackground />

            {/* Main Content (navbar + pages) */}
            <div className="relative z-10 w-full min-h-screen bg-transparent">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthenticatedLayout;
