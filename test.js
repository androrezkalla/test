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


<section id="projects" className="py-20 bg-gray-100 dark:bg-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Projects</h2>
    <div className="masonry sm:masonry-sm md:masonry-md lg:masonry-lg space-y-4">
      {projects.map((project) => (
        <motion.div
          key={project.id}
          className="masonry-item bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <img src={project.images[0]} alt={project.title} className="w-full h-auto" />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{project.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
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

<style>
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
</style>






import Slider from "react-slick"; // Import a library like react-slick

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

<section id="projects" className="py-20 bg-gray-100 dark:bg-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Projects</h2>
    <Slider {...settings}>
      {projects.map((project) => (
        <motion.div
          key={project.id}
          className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <img src={project.images[0]} alt={project.title} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{project.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
            <button
              onClick={() => openModal(project)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              View Details
            </button>
          </div>
        </motion.div>
      ))}
    </Slider>
  </div>
</section>








<section id="projects" className="py-20 bg-gray-100 dark:bg-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Projects</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <motion.div
          key={project.id}
          className="relative group bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden"
          whileHover={{ scale: 1.05 }}
        >
          <img src={project.images[0]} alt={project.title} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-center text-white">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p>{project.description}</p>
              <button
                onClick={() => openModal(project)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>


