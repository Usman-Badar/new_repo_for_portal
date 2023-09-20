-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: remotemysql.com
-- Generation Time: Dec 06, 2021 at 09:45 AM
-- Server version: 8.0.13-4
-- PHP Version: 7.2.24-0ubuntu0.18.04.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `HVCcBMfMED`
--

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `student_name` varchar(50) NOT NULL,
  `father_name` varchar(50) NOT NULL,
  `father_cnic` varchar(20) NOT NULL,
  `mother_tongue` varchar(20) NOT NULL,
  `father_occupation` varchar(30) NOT NULL,
  `monthly_income` float NOT NULL,
  `student_surname` varchar(30) NOT NULL,
  `religion` varchar(30) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `date_of_birth` date NOT NULL,
  `place_of_birth` varchar(30) NOT NULL,
  `previous_school` varchar(30) NOT NULL,
  `office_telephone` varchar(20) NOT NULL,
  `residence_telephone` varchar(20) NOT NULL,
  `province` varchar(20) NOT NULL,
  `residential_address` mediumtext NOT NULL,
  `recording_date` date NOT NULL,
  `recording_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
