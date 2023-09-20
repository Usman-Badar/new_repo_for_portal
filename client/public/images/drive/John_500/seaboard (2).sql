-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 14, 2022 at 05:02 AM
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

--
-- Dumping data for table `tbl_item_requests`
--

INSERT INTO `tbl_item_requests` (`id`, `location_code`, `company_code`, `request_by`, `request_date`, `request_time`, `received_by`, `received_date`, `received_time`, `acted_by`, `acted_date`, `acted_time`, `status`, `remarks`, `pr_request_generate_date`, `pr_request_generate_time`, `pr_request_generate_by`, `delivery_date`, `delivery_time`) VALUES
(1, 1, 20, 500, '2022-10-13', '16:33:29', 2013, '2022-10-13', '16:33:29', 2013, '2022-10-13', '16:34:37', 'delivered', 'ndnvkndvbk', NULL, NULL, NULL, '2022-10-13', '16:37:31'),
(2, 1, 10, 500, '2022-10-13', '16:44:15', 2013, '2022-10-13', '16:44:15', 2013, '2022-10-13', '16:45:42', 'delivered', 'Approved the items', NULL, NULL, NULL, '2022-10-13', '16:58:43'),
(3, 1, 7, 500, '2022-10-13', '16:51:35', 2013, '2022-10-13', '16:51:35', 2013, '2022-10-13', '16:53:43', 'delivered', 'please provide  the required items', NULL, NULL, NULL, '2022-10-13', '16:55:16');

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

--
-- Dumping data for table `tbl_item_requests_specifications`
--

INSERT INTO `tbl_item_requests_specifications` (`id`, `request_id`, `item_id`, `reason`, `required_quantity`, `edited`, `new_added`, `availability`) VALUES
(1, 1, 1, 'For Testing Purpose', 2, 0, 0, NULL),
(2, 2, 1, 'For Testing Purpose', 10, 0, 0, NULL),
(3, 3, 2, 'for office use', 10, 0, 0, NULL),
(4, 3, 1, 'for office use', 10, 0, 0, NULL);

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
-- Dumping data for table `tbl_item_request_comments`
--

INSERT INTO `tbl_item_request_comments` (`id`, `item_request_id`, `sender_id`, `send_date`, `send_time`, `comment`) VALUES
(1, 3, 2013, '2022-10-13', '16:56:48', 'size is large');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_item_requests_specifications`
--
ALTER TABLE `tbl_item_requests_specifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_item_request_comments`
--
ALTER TABLE `tbl_item_request_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
