drop database if exists nostrovia_enrolment; 
create database nostrovia_enrolment;

use nostrovia_enrolment;
-- phpMyAdmin SQL Dump
-- version 
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 22, 2015 at 08:38 PM
-- Server version: 5.6.27-percona-sure2-log
-- PHP Version: 5.5.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nostrovia_enrollmenttest`
--

-- --------------------------------------------------------

--
-- Table structure for table `input_feedback`
--

CREATE TABLE `input_feedback` (
  `id` int(11) NOT NULL,
  `q1` varchar(255) CHARACTER SET utf8 NOT NULL,
  `q2` varchar(255) CHARACTER SET utf8 NOT NULL,
  `q3` varchar(255) CHARACTER SET utf8 NOT NULL,
  `q4` varchar(255) CHARACTER SET utf8 NOT NULL,
  `q5` varchar(255) CHARACTER SET utf8 NOT NULL,
  `q6` varchar(255) CHARACTER SET utf8 NOT NULL,
  `q7` varchar(255) CHARACTER SET utf8 NOT NULL,
  `q8` varchar(255) CHARACTER SET utf8 NOT NULL,
  `q9` varchar(255) CHARACTER SET utf8 NOT NULL,
  `q10` varchar(255) CHARACTER SET utf8 NOT NULL,
  `client_ip` varchar(255) CHARACTER SET utf8 NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `code` varchar(255) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `input_feedback`
--

INSERT INTO `input_feedback` (`id`, `q1`, `q2`, `q3`, `q4`, `q5`, `q6`, `q7`, `q8`, `q9`, `q10`, `client_ip`, `date_time`, `code`) VALUES
(3, 'Agree', 'Strongly Disagree', 'Strongly Agree', 'Strongly Disagree', 'Disagree', 'What Are Psoriatic Arthritis and Plaque Psoriasis?', '', '', '', '', '182.72.201.145', '2015-03-18 10:41:59', 'Otezla'),
(4, 'Agree', 'Neutral', 'Neutral', 'Neutral', 'Neutral', 'What Are Psoriatic Arthritis and Plaque Psoriasis?', '', '', '', '', '182.72.201.145', '2015-03-18 10:42:27', 'Otezla'),
(5, 'Strongly Agree', 'Strongly Agree', 'Strongly Agree', 'Strongly Agree', 'Strongly Agree', 'What Are Psoriatic Arthritis and Plaque Psoriasis?', '', '', '', '', '72.74.252.74', '2015-03-18 18:53:33', 'Otezla'),
(6, 'Neutral', 'Agree', 'Neutral', 'Agree', 'Strongly Agree', 'What Are Psoriatic Arthritis and Plaque Psoriasis?', '', '', '', '', '72.74.252.74', '2015-03-19 19:57:47', 'Otezla'),
(7, 'Strongly Agree', 'Strongly Agree', 'Strongly Agree', 'Strongly Agree', 'Strongly Agree', 'Taking Otezla', '', '', '', '', '72.74.252.74', '2015-03-23 19:37:36', 'Otezla'),
(8, 'Agree', 'Neutral', 'Agree', 'Neutral', 'Agree', 'What Are Psoriatic Arthritis and Plaque Psoriasis?,Healthy Living Tips', '', '', '', '', '182.72.201.145', '2015-03-24 13:21:26', 'Otezla'),
(9, 'Agree', 'Agree', 'Strongly Agree', 'Strongly Agree', 'Neutral', 'Taking Otezla,Healthy Living Tips', '', '', '', '', '72.74.252.74', '2015-03-25 19:40:19', 'Otezla'),
(10, 'Agree', 'Strongly Agree', 'Strongly Agree', 'Agree', 'Strongly Agree', 'Healthy Living Tips', '', '', '', '', '72.74.252.74', '2015-03-25 19:40:40', 'Otezla'),
(11, 'Agree', 'Strongly Agree', 'Strongly Agree', 'Agree', 'Strongly Agree', 'Healthy Living Tips', '', '', '', '', '72.74.252.74', '2015-03-25 19:40:41', 'Otezla');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `input_feedback`
--
ALTER TABLE `input_feedback`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `input_feedback`
--
ALTER TABLE `input_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
