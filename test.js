// src/components/Portfolio.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import { Line } from 'react-chartjs-2';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
    category: 'Web Development',
    description:
      'Brief description of Project 1. Explain what the project is about in one or two sentences.',
    image: '/assets/images/project1.gif',
    video: '/assets/videos/project1.mp4',
    details:
      'Detailed description of Project 1. Highlight your achievements, technologies used, and the impact of the project.',
  },
  {
    id: 2,
    title: 'Project Title 2',
    category: 'Full Stack Development',
    description:
      'Brief description of Project 2. Explain what the project is about in one or two sentences.',
    image: '/assets/images/project2.png',
    video: null,
    details:
      'Detailed description of Project 2. Highlight your achievements, technologies used, and the impact of the project.',
  },
  // Add more projects as needed
];

// Placeholder general statistics data
const generalStats = [
  { id: 1, label: 'Statistic Label 1', value: 100 },
  { id: 2, label: 'Statistic Label 2', value: 200 },
  { id: 3, label: 'Statistic Label 3', value: 300 },
  { id: 4, label: 'Statistic Label 4', value: 400 },
];

// Modal Styles
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '800px',
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
  const [activeFilter, setActiveFilter] = useState('All');

  const openModal = (project) => {
    setSelectedProject(project);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedProject(null);
  };

  // Placeholder chart data
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
        {/* Navigation Bar */}
        <nav className="bg-white dark:bg-gray-800 shadow fixed w-full z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-800 dark:text-white">My Portfolio</h1>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="text-gray-800 dark:text-white focus:outline-none mr-4"
                >
                  {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
                </button>
                <a
                  href="#projects"
                  className="text-gray-800 dark:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Projects
                </a>
                <a
                  href="#statistics"
                  className="text-gray-800 dark:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Statistics
                </a>
                <a
                  href="#contact"
                  className="text-gray-800 dark:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
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
            <motion.p
              className="text-xl mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <Typewriter
                words={['Innovator', 'Developer', 'Automator']}
                loop={false}
                cursor
                cursorStyle="_"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </motion.p>
            <motion.a
              href="#projects"
              className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              Explore My Work
            </motion.a>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 bg-gray-100 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Projects</h2>

            {/* Filter Buttons */}
            <div className="flex justify-center mb-8">
              {['All', 'Web Development', 'Automation', 'Full Stack Development'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`mx-2 px-4 py-2 rounded ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                  } hover:bg-blue-700 transition`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects
                .filter((project) => activeFilter === 'All' || project.category === activeFilter)
                .map((project) => (
                  <motion.div
                    key={project.id}
                    className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative h-48">
                      {project.image && (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      {project.video && (
                        <video
                          className="w-full h-full object-cover"
                          controls
                          src={project.video}
                          alt={project.title}
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{project.title}</h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">{project.description}</p>
                      <button
                        onClick={() => openModal(project)}
                        className="mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
                      >
                        Learn More
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section id="statistics" className="py-20 bg-gray-200 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {generalStats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 text-center"
                >
                  <CountUp start={0} end={stat.value} duration={2} delay={0} className="text-3xl font-bold text-blue-600 dark:text-blue-400" />
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chart Section */}
        <section className="py-20 bg-gray-100 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Projects Over Time</h2>
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-200 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Contact Me</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-4">Feel free to reach out to me!</p>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-4">Email: androrezkalla@gmail.com</p>
          </div>
        </section>

        {/* Modal for Project Details */}
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{selectedProject?.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedProject?.details}</p>
          <button onClick={closeModal} className="mt-4 inline-block bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition">
            Close
          </button>
        </Modal>
      </div>
    </div>
  );
}
