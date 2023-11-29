-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 28, 2023 at 07:34 AM
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
-- Database: `seaboard`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fuel_equipment_company_setup`
--

CREATE TABLE `tbl_fuel_equipment_company_setup` (
  `id` int(11) NOT NULL,
  `company_code` int(11) NOT NULL,
  `location_code` int(11) NOT NULL,
  `equipment_type` int(11) NOT NULL,
  `equipment_number` varchar(25) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `edit_by` int(11) DEFAULT NULL,
  `edit_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fuel_equipment_setup`
--

CREATE TABLE `tbl_fuel_equipment_setup` (
  `id` int(11) NOT NULL,
  `equipment_type` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `edited_by` int(11) DEFAULT NULL,
  `edited_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_fuel_equipment_company_setup`
--
ALTER TABLE `tbl_fuel_equipment_company_setup`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_code` (`company_code`),
  ADD KEY `location_code` (`location_code`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `edit_by` (`edit_by`),
  ADD KEY `equipment_type` (`equipment_type`);

--
-- Indexes for table `tbl_fuel_equipment_setup`
--
ALTER TABLE `tbl_fuel_equipment_setup`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_fuel_equipment_company_setup`
--
ALTER TABLE `tbl_fuel_equipment_company_setup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_fuel_equipment_setup`
--
ALTER TABLE `tbl_fuel_equipment_setup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_fuel_equipment_company_setup`
--
ALTER TABLE `tbl_fuel_equipment_company_setup`
  ADD CONSTRAINT `tbl_fuel_equipment_company_setup_ibfk_1` FOREIGN KEY (`company_code`) REFERENCES `companies` (`company_code`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_fuel_equipment_company_setup_ibfk_2` FOREIGN KEY (`location_code`) REFERENCES `locations` (`location_code`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_fuel_equipment_company_setup_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_fuel_equipment_company_setup_ibfk_4` FOREIGN KEY (`edit_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_fuel_equipment_company_setup_ibfk_5` FOREIGN KEY (`equipment_type`) REFERENCES `tbl_fuel_equipment_setup` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
