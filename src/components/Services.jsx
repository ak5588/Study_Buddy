import { useNavigate } from 'react-router-dom';
import { FileText, BrainCircuit, ScrollText } from 'lucide-react';

export function Services() {
    const navigate = useNavigate();

    const handleServiceClick = (service) => {
        // Navigate to ChatPage with the selected service
        navigate(`/chat/${service}`);
    };

    return (
        <div className="py-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">Available Services</h2>
            <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
                <ServiceCard
                    icon={<FileText className="w-8 h-8" />}
                    title="AI-Powered Summary Generation"
                    description="Condenses lengthy materials into key points."
                    onClick={() => handleServiceClick('summary')}
                />
                <ServiceCard
                    icon={<ScrollText className="w-8 h-8" />}
                    title="AI-Powered Quiz Creation"
                    description="Automatically generates self-assessment quizzes."
                    onClick={() => navigate('/quiz')}
                />
                <ServiceCard
                    icon={<BrainCircuit className="w-8 h-8" />}
                    title="AI-Powered Question Generation"
                    description="Generate questions from your study materials."
                    onClick={() => navigate('/questions')}
                />
            </div>
        </div>
    );
}

import PropTypes from 'prop-types';

function ServiceCard({ icon, title, description, onClick }) {
    return (
        <div 
            className="border rounded-lg p-6 text-center hover:shadow-lg transition-all cursor-pointer hover:scale-105"
            onClick={onClick}
        >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}

ServiceCard.propTypes = {
    icon: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default Services;
