import React from 'react';
import { Link } from 'react-router-dom';
import './StartupGuide.css';

const StartupGuide = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--title-blue)]">
            {/* Hero Section */}
            <div className="hero pt-10 bg-[var(--bg-main)]">
                <div className="hero-content text-center">
                    <div className="max-w-lg">
                        <h1 className="text-5xl font-bold text-[var(--title-blue)]">
                            Build Your Startup at Damanhour University
                        </h1>
                        {/* <p className="py-6 text-[var(--dark-grey)]">
                            A comprehensive guide to help you launch and grow your startup, tailored to Egyptian laws and local opportunities, with practical steps and resources.
                        </p> */}
                        {/* <a
                            href="#get-started"
                            className="btn btn-primary bg-[var(--dark-blue)] text-[var(--white)] border-none hover:bg-[var(--main-blue)]"
                        >
                            Get Started
                        </a> */}
                    </div>
                </div>
            </div>

            {/* Idea Identification Section */}
            <div id="get-started" className="max-w-4xl mx-auto py-10">
                <h2 className="text-3xl font-bold text-[var(--main-blue)] text-center mb-4">
                    Step 1: Identify Your Startup Idea
                </h2>
                <p className="text-[var(--dark-grey)] text-center mb-6">
                    A great startup begins with a strong idea that solves real problems. Here are ways to find and validate your concept.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">Solve Local Problems</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Look for challenges in your community, like transportation (e.g., Swvl) or payment delays (e.g., Fawry). Brainstorm solutions that fit local needs.
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">Follow Egyptian Trends</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Focus on growing sectors like FinTech, e-commerce, or agritech, driven by Egypt’s young population and 60%+ internet penetration.
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">Conduct Market Research</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Survey students at Damanhour University or local markets to understand demand. Use free tools like Google Forms to gather insights.
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">Leverage Incubators</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Connect with local incubators like ITIDA’s Technology Innovation Centers or Flat6Labs Cairo for mentorship and idea validation.
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">Use University Resources</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Engage with Damanhour University’s Faculty of Commerce or Institute of Environmental Research for expert guidance and workshops.
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">Test with a Prototype</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Build a simple prototype (e.g., a mockup app or product sample) and test it with peers to refine your idea before investing heavily.
                        </p>
                    </div>
                </div>
            </div>

            {/* Business Model Guide Section */}
            <div className="max-w-4xl mx-auto p-10 rounded-xl bg-[var(--bg-second)]">
                <h2 className="text-3xl font-bold text-[var(--main-blue)] text-center mb-4">
                    Step 2: Build Your Business Model
                </h2>
                <p className="text-[var(--dark-grey)] text-center mb-6">
                    Transform your idea into a sustainable business with these steps, compliant with Egyptian regulations.
                </p>
                <div className="space-y-6">
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">1. Define Your Value Proposition</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Clarify what makes your product unique. For example, Fawry offers fast bill payments, addressing a common Egyptian pain point.
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">2. Build a Team</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Recruit classmates with complementary skills (e.g., tech, marketing). Use Damanhour University’s student clubs to find co-founders.
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">3. Register Your Business</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Register as an SME under Law 152/2020 for tax incentives and MSMEDA funding. Visit GAFI’s one-stop shop for streamlined registration.
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">4. Develop a Financial Plan</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Budget for licensing, operations, and marketing. Seek funding from AUC Venture Lab, Banque Misr, or ITIDA’s startup grants.
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">5. Create a Prototype</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Develop a minimum viable product (MVP) to test your concept. Use free tools like Figma for design or Bubble for no-code apps.
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">6. Comply with Regulations</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Follow Egyptian labor laws and consumer protection rules. Consult Damanhour University’s Faculty of Law for free legal advice.
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">7. Pitch to Investors</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Prepare a pitch deck and present at events like RiseUp Summit or Flat6Labs’ Demo Day to attract investors.
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">8. Market and Scale</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Use social media (e.g., Instagram, TikTok) to reach Egypt’s youth. Join GDG Damanhour or Startup Weekend for networking.
                        </p>
                    </div>
                </div>
            </div>

            {/* Resources Section */}
            <div className="max-w-4xl mx-auto py-10">
                <h2 className="text-3xl font-bold text-[var(--main-blue)] text-center mb-4">
                    Step 3: Learn with Free Resources
                </h2>
                <p className="text-[var(--dark-grey)] text-center mb-6">
                    Enhance your entrepreneurial skills with these free tools, videos, and local programs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">EgyptInnovate Courses</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Free online courses on business strategy. Enroll in “Diploma in Business Management & Entrepreneurship.”{' '}
                            <a href="https://egyptinnovate.com" className="underline text-[var(--main-blue)]" target="_blank" rel="noopener noreferrer">
                                Visit EgyptInnovate
                            </a>
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">AUC Venture Lab Videos</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Watch FinTech Accelerator videos on funding and scaling.{' '}
                            <a href="https://business.aucegypt.edu" className="underline text-[var(--main-blue)]" target="_blank" rel="noopener noreferrer">
                                Explore AUC V-Lab
                            </a>
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">Edraak Platform</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Free Arabic-language courses on entrepreneurship and marketing.{' '}
                            <a href="https://www.edraak.org" className="underline text-[var(--main-blue)]" target="_blank" rel="noopener noreferrer">
                                Visit Edraak
                            </a>
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">Coursera Free Courses</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Audit courses like “Entrepreneurship 1: Developing the Opportunity” from Wharton for free.{' '}
                            <a href="https://www.coursera.org" className="underline text-[var(--main-blue)]" target="_blank" rel="noopener noreferrer">
                                Visit Coursera
                            </a>
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">Damanhour University Programs</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Join Faculty of Commerce workshops or check the university portal for entrepreneurship events.{' '}
                            <a href="https://damanhour.edu.eg" className="underline text-[var(--main-blue)]" target="_blank" rel="noopener noreferrer">
                                Visit University Portal
                            </a>
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">YouTube Tutorials</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Search “Egyptian startup guide” for free videos on business planning and compliance by local experts.
                        </p>
                    </div>
                </div>
            </div>

            {/* Networking and Support Section */}
            <div className="max-w-4xl mx-auto p-10 rounded-xl bg-[var(--bg-second)]">
                <h2 className="text-3xl font-bold text-[var(--main-blue)] text-center mb-4">
                    Step 4: Connect and Grow
                </h2>
                <p className="text-[var(--dark-grey)] text-center mb-6">
                    Build your network and access support to take your startup to the next level.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">Join Local Events</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Attend Startup Weekend Alexandria or GDG Damanhour meetups to connect with entrepreneurs and mentors.
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">Engage with Accelerators</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Apply to accelerators like Flat6Labs or Injaz Egypt for funding, training, and mentorship.{' '}
                            <a href="https://flat6labs.com" className="underline text-[var(--main-blue)]" target="_blank" rel="noopener noreferrer">
                                Visit Flat6Labs
                            </a>
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">Network Online</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Join Egyptian startup communities on LinkedIn or Misrify’s social media for tips and connections.
                        </p>
                    </div>
                    <div className="card bg-[var(--white)] shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-[var(--main-blue)] mb-2">Seek Government Support</h3>
                        <p className="text-[var(--dark-grey)] text-sm">
                            Explore MSMEDA’s programs for training and loans under Law 152/2020. Visit{' '}
                            <a href="https://www.msmeda.org.eg" className="underline text-[var(--main-blue)]" target="_blank" rel="noopener noreferrer">
                                MSMEDA
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Call to Action Button */}
            <div className="max-w-4xl mx-auto py-10 text-center">
                <h3 className="text-2xl font-semibold text-[var(--main-blue)] mb-4">
                    Need Personalized Advice?
                </h3>
                <p className="text-[var(--dark-grey)] mb-6">
                    Connect with the Misrify team to get tailored guidance for your startup journey.
                </p>
                <Link
                    to="/contact"
                    className="btn btn-primary bg-[var(--main-blue)] text-[var(--white)] border-none hover:bg-[var(--dark-blue)]"
                >
                    Get Advice
                </Link>
            </div>

            {/* Footer */}
            <footer className="footer footer-center p-4 bg-[var(--bg-footer)] text-[var(--white)]">
                <p>© 2025 Damanhour University Startup Hub. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default StartupGuide;