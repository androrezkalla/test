{/* Projects Section */}
<section id="projects" className="py-40 bg-gray-100 dark:bg-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">Projects</h2>

    {/* Filter Buttons */}
    <div className="flex justify-center mb-8">
      {['All', 'Web Development', 'Automation', 'Full Stack Development'].map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`mx-2 px-6 py-3 rounded ${
            activeFilter === filter
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
          } hover:bg-blue-700 transition text-lg`}
        >
          {filter}
        </button>
      ))}
    </div>

    {/* Project Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {projects
        .filter((project) => activeFilter === 'All' || project.category === activeFilter)
        .map((project) => (
          <motion.div
            key={project.id}
            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative h-64">
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
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">{project.title}</h3>
              <p className="mt-3 text-gray-600 dark:text-gray-300 text-lg">{project.description}</p>
              <button
                onClick={() => openModal(project)}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
    </div>
  </div>
</section>
