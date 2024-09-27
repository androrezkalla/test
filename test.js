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
    category: 'Category 1', // e.g., Web Development, Automation, Full Stack Development
    description:
      'Brief description of Project 1. Explain what the project is about in one or two sentences.',
    image: '/assets/images/project1.gif', // Replace with your project image or GIF path
    video: '/assets/videos/project1.mp4', // Replace with your project video path (optional)
    details:
      'Detailed description of Project 1. Highlight your achievements, technologies used, and the impact of the project.',
  },
  {
    id: 2,
    title: 'Project Title 2',
    category: 'Category 2',
    description:
      'Brief description of Project 2. Explain what the project is about in one or two sentences.',
    image: '/assets/images/project2.png',
    video: null, // If no video, set to null
    details:
      'Detailed description of Project 2. Highlight your achievements, technologies used, and the impact of the project.',
  },
  // Add more projects as needed
];

// Placeholder general statistics data
const generalStats = [
  { id: 1, label: 'Statistic Label 1', value: 100 }, // e.g., End User Onboarding
  { id: 2, label: 'Statistic Label 2', value: 200 }, // e.g., Mobile Device Enrollments
  { id: 3, label: 'Statistic Label 3', value: 300 }, // e.g., Crowdstrike Remediation
  { id: 4, label: 'Statistic Label 4', value: 400 }, // e.g., Incidents and Tasks Resolved
];

// Placeholder project-specific statistics
const projectHighlights = [
  {
    id: 1,
    title: 'Project Highlight 1',
    description:
      'Summary of achievements and impact for Project 1. Include percentages, cost savings, or other measurable results.',
  },
  {
    id: 2,
    title: 'Project Highlight 2',
    description:
      'Summary of achievements and impact for Project 2. Include percentages, cost savings, or other measurable results.',
  },
  // Add more project highlights as needed
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
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Replace with your own labels
    datasets: [
      {
        label: 'Projects Completed',
        data: [2, 3, 5, 4, 6, 3, 7], // Replace with your own data
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

            {/* General Statistics */}
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

            {/* Project-Specific Statistics */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Project Highlights</h3>
              <div className="space-y-6">
                {/* Project Highlight 1 */}
                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white">Project Highlight 1</h4>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Summary of achievements and impact for Project 1. Include percentages, cost savings, or other measurable results.
                  </p>
                </div>

                {/* Project Highlight 2 */}
                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white">Project Highlight 2</h4>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Summary of achievements and impact for Project 2. Include percentages, cost savings, or other measurable results.
                  </p>
                </div>

                {/* Add more project highlights as needed */}
              </div>
            </div>

            {/* Interactive Chart */}
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">Projects Over Time</h3>
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow">
                <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={400} />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-100 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Contact Me</h2>
            <div className="flex justify-center">
              <form className="w-full max-w-lg">
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs font-bold mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-600"
                      id="name"
                      type="text"
                      placeholder="Your Name"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-600"
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs font-bold mb-2" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      className="appearance-none block w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-600"
                      id="message"
                      rows="5"
                      placeholder="Your message..."
                    ></textarea>
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3">
                  <div className="w-full px-3">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition"
                      type="button"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
          </div>
        </footer>

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
              <button onClick={closeModal} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-2xl">
                &times;
              </button>
            </div>
            <div className="mb-4">
              {selectedProject.image && (
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-auto mb-4" />
              )}
              {selectedProject.video && (
                <video className="w-full h-auto mb-4" controls src={selectedProject.video} alt={selectedProject.title} />
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedProject.details}</p>
            {/* If you have code snippets or additional information, you can add them here */}
          </Modal>
        )}
      </div>
    </div>
  );
}
