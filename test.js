import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import { Line } from 'react-chartjs-2';
import { FaSun, FaMoon } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';
import 'react-simple-typewriter/dist/index.css';
import CountUp from 'react-countup';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Placeholder project data
const projects = [
  {
    id: 1,
    title: 'Project Title 1',
    category: 'Category 1',
    description:
      'Brief description of Project 1. Explain what the project is about in one or two sentences.',
    images: ['/assets/images/project1_1.gif', '/assets/images/project1_2.png'],
    details: `
      <p><strong>Overview:</strong> This project involved building a complex web application.</p>
      <p><em>Key Achievements:</em></p>
      <ul>
        <li><strong>50% faster processing</strong> compared to the previous version.</li>
        <li>Automated deployment and CI/CD pipeline.</li>
      </ul>
    `,
  },
  {
    id: 2,
    title: 'Project Title 2',
    category: 'Category 2',
    description:
      'Brief description of Project 2. Explain what the project is about in one or two sentences.',
    images: ['/assets/images/project2.png'],
    details: `
      <p><strong>Overview:</strong> Created a mobile-responsive platform for managing tasks efficiently.</p>
      <p><em>Key Achievements:</em></p>
      <ul>
        <li>Optimized performance by <strong>30%</strong>.</li>
        <li>Improved user engagement through UX/UI redesign.</li>
      </ul>
    `,
  },
];

// Placeholder statistics
const generalStats = [
  { id: 1, label: 'Statistic Label 1', value: 100 },
  { id: 2, label: 'Statistic Label 2', value: 200 },
  { id: 3, label: 'Statistic Label 3', value: 300 },
  { id: 4, label: 'Statistic Label 4', value: 400 },
];

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '900px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '2rem',
  },
};

Modal.setAppElement('#root');

export default function Portfolio() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const openModal = (project) => {
    setSelectedProject(project);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedProject(null);
  };

  // Chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Projects Completed',
        data: [2, 3, 5, 4, 6, 3, 7],
        fill: false,
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
      },
    ],
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <nav className="bg-white dark:bg-gray-800 shadow fixed w-full z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">My Portfolio</h1>
              <div className="flex items-center">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="text-gray-800 dark:text-white focus:outline-none mr-4"
                >
                  {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <section className="pt-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.h1
              className="text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Welcome to My Portfolio
            </motion.h1>
            <motion.p className="text-xl mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
              <Typewriter words={['Innovator', 'Developer', 'Automator']} loop={false} cursor cursorStyle="_" typeSpeed={70} deleteSpeed={50} delaySpeed={1000} />
            </motion.p>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 bg-gray-100 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Projects</h2>

            {/* Horizontal Project Layout */}
            <div className="space-y-8">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  className="flex flex-col sm:flex-row bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Project Images */}
                  <div className="relative sm:w-1/2">
                    {project.images[0] && (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="p-6 flex flex-col justify-between sm:w-1/2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{project.title}</h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">{project.description}</p>
                    </div>
                    <button
                      onClick={() => openModal(project)}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section id="statistics" className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Statistics & Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {generalStats.map((stat) => (
                <div key={stat.id} className="text-center">
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                    <CountUp end={stat.value} />+
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">Projects Over Time</h3>
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow">
                <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={400} />
              </div>
            </div>
          </div>
        </section>

        {/* Project Modal */}
        {selectedProject && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Project Details"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-100">
                Close
              </button>
            </div>
            <div className="mb-4">
              <strong>Category:</strong> {selectedProject.category}
            </div>
            {/* Insert formatted HTML into modal */}
            <div
              className="text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: selectedProject.details }}
            />
            {/* Render all project images */}
            <div className="mt-6">
              {selectedProject.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${selectedProject.title} ${index + 1}`}
                  className="w-full h-auto mb-4 rounded-lg"
                />
              ))}
            </div>
          </Modal>
        )}

        <footer className="py-6 text-center bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-400">
          &copy; 2024 My Portfolio. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
