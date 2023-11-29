-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2023 at 02:42 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_portal_issues`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pi_categories`
--

CREATE TABLE `tbl_pi_categories` (
  `pi_category_id` int(11) NOT NULL,
  `pi_category_name` varchar(100) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_pi_categories`
--

INSERT INTO `tbl_pi_categories` (`pi_category_id`, `pi_category_name`, `created_by`, `created_at`, `status`) VALUES
(1, 'Attendance', 5000, '2023-11-16 14:11:44', 'Active'),
(2, 'Purchase Requistion', 5000, '2023-11-16 14:16:29', 'Active'),
(3, 'Purchase Order', 5000, '2023-11-16 14:17:20', 'Active'),
(4, 'Advance Cash', 5000, '2023-11-16 14:17:20', 'Active'),
(5, 'Notification', 5000, '2023-11-16 14:17:20', 'Active'),
(6, 'Network', 5000, '2023-11-16 14:17:20', 'Active'),
(7, 'Inventory', 5000, '2023-11-16 14:17:20', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pi_reported`
--

CREATE TABLE `tbl_pi_reported` (
  `portal_issue_id` int(11) NOT NULL,
  `pi_category_id` int(11) NOT NULL,
  `pi_category` varchar(100) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `issue_date` date NOT NULL,
  `priority` varchar(10) NOT NULL DEFAULT 'Low',
  `status` varchar(20) NOT NULL DEFAULT 'Pending',
  `requested_by` int(11) NOT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `support_by` int(11) DEFAULT NULL,
  `support_at` datetime DEFAULT NULL,
  `support_comments` varchar(255) DEFAULT NULL,
  `last_edit_by` int(11) DEFAULT NULL,
  `last_edit_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_pi_categories`
--
ALTER TABLE `tbl_pi_categories`
  ADD PRIMARY KEY (`pi_category_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `tbl_pi_reported`
--
ALTER TABLE `tbl_pi_reported`
  ADD PRIMARY KEY (`portal_issue_id`),
  ADD KEY `pi_category_id` (`pi_category_id`),
  ADD KEY `last_edit_by` (`last_edit_by`),
  ADD KEY `requested_by` (`requested_by`),
  ADD KEY `support_by` (`support_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_pi_categories`
--
ALTER TABLE `tbl_pi_categories`
  MODIFY `pi_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_pi_reported`
--
ALTER TABLE `tbl_pi_reported`
  MODIFY `portal_issue_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_pi_categories`
--
ALTER TABLE `tbl_pi_categories`
  ADD CONSTRAINT `tbl_pi_categories_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE;

--
-- Constraints for table `tbl_pi_reported`
--
ALTER TABLE `tbl_pi_reported`
  ADD CONSTRAINT `tbl_pi_reported_ibfk_1` FOREIGN KEY (`pi_category_id`) REFERENCES `tbl_pi_categories` (`pi_category_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_pi_reported_ibfk_2` FOREIGN KEY (`last_edit_by`) REFERENCES `seaboard`.`employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_pi_reported_ibfk_3` FOREIGN KEY (`requested_by`) REFERENCES `seaboard`.`employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_pi_reported_ibfk_4` FOREIGN KEY (`support_by`) REFERENCES `seaboard`.`employees` (`emp_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
