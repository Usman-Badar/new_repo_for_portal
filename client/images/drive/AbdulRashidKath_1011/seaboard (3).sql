-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 16, 2021 at 08:26 AM
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
-- Table structure for table `invtry_purchase_requests`
--

CREATE TABLE `invtry_purchase_requests` (
  `pr_id` int(11) NOT NULL,
  `location_code` int(11) NOT NULL,
  `company_code` int(11) NOT NULL,
  `request_by` int(11) NOT NULL,
  `request_for` int(11) DEFAULT NULL,
  `request_date` date NOT NULL,
  `request_time` time NOT NULL,
  `handle_by` int(11) DEFAULT NULL,
  `view_date` date DEFAULT NULL,
  `view_time` time DEFAULT NULL,
  `forward_by` int(11) DEFAULT NULL,
  `forward_date` date DEFAULT NULL,
  `forward_time` time DEFAULT NULL,
  `discard_date` date DEFAULT NULL,
  `discard_time` time DEFAULT NULL,
  `discard_by` int(11) DEFAULT NULL,
  `approve_by` int(11) DEFAULT NULL,
  `approve_date` date DEFAULT NULL,
  `approve_time` time DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `delivery_time` time DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `total` float DEFAULT NULL,
  `remarks` mediumtext DEFAULT NULL,
  `emp_remarks` mediumtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `invtry_purchase_request_quotations`
--

CREATE TABLE `invtry_purchase_request_quotations` (
  `quotation_id` int(11) NOT NULL,
  `pr_id` int(11) NOT NULL,
  `image` mediumtext NOT NULL,
  `image_type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `invtry_purchase_request_specifications`
--

CREATE TABLE `invtry_purchase_request_specifications` (
  `id` int(11) NOT NULL,
  `pr_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `reason` mediumtext NOT NULL,
  `price` float DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `amount` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `invtry_purchase_requests`
--
ALTER TABLE `invtry_purchase_requests`
  ADD PRIMARY KEY (`pr_id`),
  ADD KEY `location_code` (`location_code`),
  ADD KEY `request_by` (`request_by`),
  ADD KEY `handle_by` (`handle_by`),
  ADD KEY `approve_by` (`approve_by`),
  ADD KEY `request_for` (`request_for`),
  ADD KEY `forward_by` (`forward_by`),
  ADD KEY `company_code` (`company_code`),
  ADD KEY `discard_by` (`discard_by`);

--
-- Indexes for table `invtry_purchase_request_quotations`
--
ALTER TABLE `invtry_purchase_request_quotations`
  ADD PRIMARY KEY (`quotation_id`),
  ADD KEY `pr_id` (`pr_id`);

--
-- Indexes for table `invtry_purchase_request_specifications`
--
ALTER TABLE `invtry_purchase_request_specifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pr_id` (`pr_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `invtry_purchase_requests`
--
ALTER TABLE `invtry_purchase_requests`
  MODIFY `pr_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invtry_purchase_request_quotations`
--
ALTER TABLE `invtry_purchase_request_quotations`
  MODIFY `quotation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invtry_purchase_request_specifications`
--
ALTER TABLE `invtry_purchase_request_specifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `invtry_purchase_requests`
--
ALTER TABLE `invtry_purchase_requests`
  ADD CONSTRAINT `invtry_purchase_requests_ibfk_1` FOREIGN KEY (`location_code`) REFERENCES `locations` (`location_code`) ON UPDATE CASCADE,
  ADD CONSTRAINT `invtry_purchase_requests_ibfk_2` FOREIGN KEY (`request_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `invtry_purchase_requests_ibfk_3` FOREIGN KEY (`handle_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `invtry_purchase_requests_ibfk_4` FOREIGN KEY (`approve_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `invtry_purchase_requests_ibfk_5` FOREIGN KEY (`request_for`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `invtry_purchase_requests_ibfk_6` FOREIGN KEY (`forward_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `invtry_purchase_requests_ibfk_7` FOREIGN KEY (`company_code`) REFERENCES `companies` (`company_code`) ON UPDATE CASCADE,
  ADD CONSTRAINT `invtry_purchase_requests_ibfk_8` FOREIGN KEY (`discard_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE;

--
-- Constraints for table `invtry_purchase_request_quotations`
--
ALTER TABLE `invtry_purchase_request_quotations`
  ADD CONSTRAINT `invtry_purchase_request_quotations_ibfk_1` FOREIGN KEY (`pr_id`) REFERENCES `invtry_purchase_requests` (`pr_id`) ON UPDATE CASCADE;

--
-- Constraints for table `invtry_purchase_request_specifications`
--
ALTER TABLE `invtry_purchase_request_specifications`
  ADD CONSTRAINT `invtry_purchase_request_specifications_ibfk_1` FOREIGN KEY (`pr_id`) REFERENCES `invtry_purchase_requests` (`pr_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
