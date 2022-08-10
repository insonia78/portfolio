cmake_minimum_required(VERSION 2.8)

project (esCalculator C CXX)

include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include)
link_directories(${CMAKE_CURRENT_SOURCE_DIR}/src)
link_directories(${CMAKE_BINARY_DIR}/src)

message(STATUS ${CMAKE_BINARY_DIR}/src)

add_subdirectory(src)
#add_subdirectory(examples)

