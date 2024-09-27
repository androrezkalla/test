<section id="projects" className="py-20 bg-gray-100 dark:bg-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Projects</h2>
    <div className="relative border-l border-gray-200 dark:border-gray-600">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          className="mb-10 ml-4 flex flex-col sm:flex-row items-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="absolute w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full -left-1.5 border border-white dark:border-gray-900" />
          <div className="ml-10 w-full sm:w-auto">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{project.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
            <button
              onClick={() => openModal(project)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              View Details
            </button>
          </div>
          {project.images[0] && (
            <img
              src={project.images[0]}
              alt={project.title}
              className="w-32 h-32 object-cover rounded-full ml-6"
              loading="lazy"
            />
          )}
        </motion.div>
      ))}
    </div>
  </div>
</section>
