cmake_minimum_required(VERSION 2.8)

project (esCalculator C CXX)

add_library(esCalculator SHARED
  esCalculator_initialize.c
  esCalculator_terminate.c
  esCalculator.c
  rt_nonfinite.c
  rtGetNaN.c
  rtGetInf.c
)

