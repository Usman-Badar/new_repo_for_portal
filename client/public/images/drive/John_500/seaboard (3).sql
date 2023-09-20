-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 14, 2022 at 05:06 AM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `seaboard`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_item_requests`
--

CREATE TABLE `tbl_item_requests` (
  `id` int(11) NOT NULL,
  `location_code` int(11) NOT NULL,
  `company_code` int(11) NOT NULL,
  `request_by` int(11) NOT NULL,
  `request_date` date NOT NULL,
  `request_time` time NOT NULL,
  `received_by` int(11) DEFAULT NULL,
  `received_date` date DEFAULT NULL,
  `received_time` time DEFAULT NULL,
  `acted_by` int(11) DEFAULT NULL,
  `acted_date` date DEFAULT NULL,
  `acted_time` time DEFAULT NULL,
  `status` varchar(45) NOT NULL DEFAULT 'sent',
  `remarks` mediumtext DEFAULT NULL,
  `pr_request_generate_date` date DEFAULT NULL,
  `pr_request_generate_time` time DEFAULT NULL,
  `pr_request_generate_by` int(11) DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `delivery_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_item_requests_specifications`
--

CREATE TABLE `tbl_item_requests_specifications` (
  `id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `reason` mediumtext NOT NULL,
  `required_quantity` int(11) NOT NULL,
  `edited` int(11) DEFAULT 0,
  `new_added` int(11) DEFAULT 0,
  `availability` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_item_request_comments`
--

CREATE TABLE `tbl_item_request_comments` (
  `id` int(11) NOT NULL,
  `item_request_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `send_date` date NOT NULL,
  `send_time` time NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_item_requests`
--
ALTER TABLE `tbl_item_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `acted_by` (`acted_by`),
  ADD KEY `company_code` (`company_code`),
  ADD KEY `location_code` (`location_code`),
  ADD KEY `received_by` (`received_by`),
  ADD KEY `request_by` (`request_by`),
  ADD KEY `pr_request_generate_by` (`pr_request_generate_by`);

--
-- Indexes for table `tbl_item_requests_specifications`
--
ALTER TABLE `tbl_item_requests_specifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `tbl_item_request_comments`
--
ALTER TABLE `tbl_item_request_comments`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_item_requests`
--
ALTER TABLE `tbl_item_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_item_requests_specifications`
--
ALTER TABLE `tbl_item_requests_specifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_item_request_comments`
--
ALTER TABLE `tbl_item_request_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_item_requests`
--
ALTER TABLE `tbl_item_requests`
  ADD CONSTRAINT `tbl_item_requests_ibfk_1` FOREIGN KEY (`acted_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_item_requests_ibfk_2` FOREIGN KEY (`company_code`) REFERENCES `companies` (`company_code`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_item_requests_ibfk_3` FOREIGN KEY (`location_code`) REFERENCES `locations` (`location_code`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_item_requests_ibfk_4` FOREIGN KEY (`received_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_item_requests_ibfk_5` FOREIGN KEY (`request_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_item_requests_ibfk_6` FOREIGN KEY (`pr_request_generate_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE;

--
-- Constraints for table `tbl_item_requests_specifications`
--
ALTER TABLE `tbl_item_requests_specifications`
  ADD CONSTRAINT `tbl_item_requests_specifications_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `tbl_item_requests` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_item_requests_specifications_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `tbl_inventory_sub_categories` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
