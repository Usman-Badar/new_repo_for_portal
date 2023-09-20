-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 16, 2021 at 08:16 AM
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
-- Table structure for table `accesses`
--

CREATE TABLE `accesses` (
  `access_id` int(11) NOT NULL,
  `access_title` varchar(255) NOT NULL,
  `access_desc` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `accesses`
--

INSERT INTO `accesses` (`access_id`, `access_title`, `access_desc`) VALUES
(1, 'Application Admin', 'Application Admin'),
(3, 'Employment Form', 'Employement Form Admin'),
(4, 'Head Of Department', 'Head Of Department'),
(100, 'Attendance Admin', 'Attendance Admin'),
(101, 'Mark Attednace', 'Mark Attednace'),
(102, 'Device Setup', 'Device Setup'),
(103, 'View Employees', 'View Employees'),
(500, 'Inventory', 'Inventory'),
(502, 'View All Employees Attendance', 'View All Employees Attendance'),
(503, 'View Guests Meetings', 'View Guests Meetings'),
(504, 'Inventory Home Page Purchase Requisition List', 'Inventory Home Page Purchase Requisition List'),
(505, 'Inventory Home Page Purchase Order List', 'Inventory Home Page Purchase Order List'),
(506, 'View Employees Attendance Companywise', 'View Employees Attendance Companywise'),
(509, 'View Employees Leave Requests', 'View Employees Leave Requests'),
(510, 'Send Request On Behalf Of Other Employee', 'Send Request On Behalf Of Other Employee'),
(512, 'put forward the purchase request for approval', 'put forward the purchase request for approval'),
(513, 'approve the purchase request', 'approve the purchase request'),
(514, 'override the purchase request', 'override the purchase request'),
(515, 'approve purchase requests that are greater than 150000', 'approve purchase requests that are greater than 150000'),
(516, 'approve purchase requests for mulltiple companies', 'approve purchase requests for mulltiple companies');

-- --------------------------------------------------------

--
-- Table structure for table `invtry_emp_approval_to_related_companies`
--

CREATE TABLE `invtry_emp_approval_to_related_companies` (
  `id` int(11) NOT NULL,
  `emp_id` int(11) NOT NULL,
  `company_code` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `invtry_emp_approval_to_related_companies`
--

INSERT INTO `invtry_emp_approval_to_related_companies` (`id`, `emp_id`, `company_code`) VALUES
(1, 2013, 100),
(2, 2013, 200),
(3, 2013, 20),
(4, 2013, 1),
(5, 1011, 100),
(6, 1011, 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accesses`
--
ALTER TABLE `accesses`
  ADD PRIMARY KEY (`access_id`);

--
-- Indexes for table `invtry_emp_approval_to_related_companies`
--
ALTER TABLE `invtry_emp_approval_to_related_companies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emp_id` (`emp_id`),
  ADD KEY `company_code` (`company_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accesses`
--
ALTER TABLE `accesses`
  MODIFY `access_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=517;

--
-- AUTO_INCREMENT for table `invtry_emp_approval_to_related_companies`
--
ALTER TABLE `invtry_emp_approval_to_related_companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `invtry_emp_approval_to_related_companies`
--
ALTER TABLE `invtry_emp_approval_to_related_companies`
  ADD CONSTRAINT `invtry_emp_approval_to_related_companies_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `invtry_emp_approval_to_related_companies_ibfk_2` FOREIGN KEY (`company_code`) REFERENCES `companies` (`company_code`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
