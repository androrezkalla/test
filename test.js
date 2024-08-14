set(SESSION_AGG_JAR
  ${CMAKE_CURRENT_SOURCE_DIR}/A.jar)

#file(GLOB_RECURSE SOURCES "*.scala")

message(STATUS "Creating jar ... ${CMAKE_CURRENT_BINARY_DIR} ${CMAKE_CURRENT_SOURCE_DIR} ${SOURCES}")

#mvn clean install scoverage:report
add_custom_command(OUTPUT ${A_JAR}
  COMMAND ant clean compile jar
  -Dcmake.current.binary.dir=${CMAKE_CURRENT_BINARY_DIR}
  -Dproject.version=${PROJECT_VERSION}
  DEPENDS ${SOURCES}
  WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})

add_custom_target(a_target ALL DEPENDS ${A_JAR})

add_custom_target(rpm WORKING_DIRECTORY ${CMAKE_SOURCE_DIR})

add_custom_target(main_a WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/a)

add_custom_target(a_rpm WORKING_DIRECTORY 
  ${CMAKE_CURRENT_SOURCE_DIR} COMMAND make-rpm.sh
  -s ${CMAKE_SOURCE_DIR}/spec/a.spec
  -r ${CMAKE_INSTALL_PREFIX}
  -o ${CMAKE_RELEASE_DIR}
  --version ${PROJECT_VERSION}
  --release ${PROJECT_RELEASE}
  VERBATIM)

add_dependencies(rpm a_rpm)

install(FILES ${A_JAR} DESTINATION
  ${CMAKE_INSTALL_PREFIX}/opt/lib)