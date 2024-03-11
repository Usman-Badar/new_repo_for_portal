-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2024 at 07:20 AM
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
-- Table structure for table `tbl_fuel_entry_for_trip`
--

CREATE TABLE `tbl_fuel_entry_for_trip` (
  `id` int(11) NOT NULL,
  `company_code` int(11) NOT NULL DEFAULT 10,
  `location_code` int(11) NOT NULL DEFAULT 4,
  `total_fuel_to_issue` double NOT NULL DEFAULT 0,
  `trip_date` date NOT NULL,
  `equipment_type` int(11) NOT NULL,
  `equipment_number` int(11) NOT NULL,
  `additional_fuel` double NOT NULL DEFAULT 0,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_issued_by` int(11) DEFAULT NULL,
  `last_issued_at` datetime DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'waiting for issue',
  `additional_fuel_issued` tinyint(1) NOT NULL DEFAULT 0,
  `additional_fuel_issued_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_fuel_entry_for_trip`
--

INSERT INTO `tbl_fuel_entry_for_trip` (`id`, `company_code`, `location_code`, `total_fuel_to_issue`, `trip_date`, `equipment_type`, `equipment_number`, `additional_fuel`, `created_by`, `created_at`, `last_issued_by`, `last_issued_at`, `status`, `additional_fuel_issued`, `additional_fuel_issued_at`) VALUES
(1, 10, 4, 7, '2024-02-23', 3, 1, 0, 5000, '2024-02-22 19:49:54', 5000, '2024-02-23 10:50:17', 'issued', 0, NULL),
(2, 10, 4, 8, '2024-02-23', 3, 1, 0, 5000, '2024-02-22 20:00:31', 5000, '2024-02-23 12:32:50', 'issued', 0, NULL),
(3, 10, 4, 4, '2024-02-23', 1, 3, 0, 5000, '2024-02-22 20:04:00', 5000, '2024-02-23 12:32:44', 'issued', 0, NULL),
(4, 10, 4, 3, '2024-02-23', 1, 3, 0, 5000, '2024-02-22 20:04:27', 5000, '2024-02-23 12:32:39', 'issued', 0, NULL),
(5, 10, 4, 14, '2024-02-23', 1, 3, 0, 5000, '2024-02-22 20:07:24', 5000, '2024-02-23 11:07:49', 'issued', 0, NULL),
(6, 10, 4, 2, '2024-02-26', 1, 3, 0, 5000, '2024-02-25 23:07:17', 5000, '2024-02-26 09:13:57', 'issued', 0, NULL),
(7, 10, 4, 20, '2024-02-26', 1, 3, 0, 5000, '2024-02-25 23:26:12', NULL, NULL, 'waiting for issue', 0, NULL),
(8, 10, 4, 20, '2024-02-26', 1, 3, 0, 5000, '2024-02-25 23:27:24', NULL, NULL, 'waiting for issue', 0, NULL),
(9, 10, 4, 20, '2024-02-26', 1, 3, 0, 5000, '2024-02-25 23:28:01', NULL, NULL, 'waiting for issue', 0, NULL),
(10, 10, 4, 20, '2024-02-26', 1, 3, 0, 5000, '2024-02-25 23:28:44', NULL, NULL, 'waiting for issue', 0, NULL),
(11, 10, 4, 20, '2024-02-26', 1, 3, 10, 5000, '2024-02-25 23:29:50', 5000, '2024-02-26 09:51:03', 'issued', 1, '2024-02-26 09:48:57'),
(12, 10, 4, 10, '2024-02-26', 1, 3, 6, 5000, '2024-02-25 23:51:44', 5000, '2024-02-26 09:52:36', 'partial issued', 1, '2024-02-26 09:52:36'),
(13, 10, 4, 5, '2024-02-26', 1, 3, 3, 5000, '2024-02-26 00:09:23', 5000, '2024-02-26 10:09:28', 'issued', 0, NULL),
(14, 10, 4, 5, '2024-02-26', 1, 3, 3, 5000, '2024-02-26 00:10:20', 5000, '2024-02-26 10:10:26', 'issued', 0, NULL),
(15, 10, 4, 5, '2024-02-26', 1, 3, 3, 5000, '2024-02-26 00:11:17', 5000, '2024-02-26 10:15:00', 'issued', 1, '2024-02-26 10:15:00'),
(16, 10, 4, 2, '2024-02-26', 1, 3, 0, 5000, '2024-02-26 00:16:26', 5000, '2024-02-26 10:16:43', 'issued', 0, NULL),
(17, 10, 4, 12, '2024-02-26', 1, 3, 0, 5000, '2024-02-26 00:16:37', 5000, '2024-02-26 10:16:59', 'issued', 0, NULL),
(18, 10, 4, 11, '2024-02-26', 1, 3, 1, 5000, '2024-02-26 00:19:10', 5000, '2024-02-26 10:19:21', 'issued', 1, '2024-02-26 10:19:15'),
(19, 10, 4, 142, '2024-02-27', 1, 3, 28, 5000, '2024-02-27 06:02:42', 5000, '2024-02-27 11:04:50', 'partial issued', 1, '2024-02-27 11:04:50'),
(20, 10, 4, 106, '2024-03-04', 3, 1, 100, 5000, '2024-03-04 06:08:23', NULL, NULL, 'waiting for issue', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fuel_entry_trips_list`
--

CREATE TABLE `tbl_fuel_entry_trips_list` (
  `id` int(11) NOT NULL,
  `entry_code` int(11) NOT NULL,
  `trip_id` int(11) NOT NULL,
  `route` varchar(255) NOT NULL,
  `fuel` double NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `issued_by` int(11) DEFAULT NULL,
  `issued_at` datetime DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'not issued'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_fuel_entry_trips_list`
--

INSERT INTO `tbl_fuel_entry_trips_list` (`id`, `entry_code`, `trip_id`, `route`, `fuel`, `created_at`, `issued_by`, `issued_at`, `status`) VALUES
(1, 1, 1, 'Qfs to Nlc', 6, '2024-02-22 19:49:54', 5000, '2024-02-23 10:50:17', 'issued'),
(2, 2, 1, 'Qfs to Nlc', 6, '2024-02-22 20:00:31', 5000, '2024-02-23 12:32:50', 'issued'),
(3, 3, 2, 'landhi to qfs', 2, '2024-02-22 20:04:00', 5000, '2024-02-23 12:32:44', 'issued'),
(4, 4, 2, 'landhi to qfs', 2, '2024-02-22 20:04:27', 5000, '2024-02-23 12:32:39', 'issued'),
(5, 5, 2, 'landhi to qfs', 2, '2024-02-22 20:07:24', 5000, '2024-02-23 11:07:49', 'issued'),
(6, 5, 3, 'QFS to NLC', 10, '2024-02-22 20:07:24', 5000, '2024-02-23 11:07:49', 'issued'),
(7, 5, 2, 'landhi to qfs', 2, '2024-02-22 20:07:24', 5000, '2024-02-23 11:07:49', 'issued'),
(8, 6, 2, 'landhi to qfs', 2, '2024-02-25 23:07:17', 5000, '2024-02-26 09:13:57', 'issued'),
(9, 7, 3, 'QFS to NLC', 10, '2024-02-25 23:26:12', NULL, NULL, 'not issued'),
(10, 8, 3, 'QFS to NLC', 10, '2024-02-25 23:27:24', NULL, NULL, 'not issued'),
(11, 9, 3, 'QFS to NLC', 10, '2024-02-25 23:28:01', NULL, NULL, 'not issued'),
(12, 10, 3, 'QFS to NLC', 10, '2024-02-25 23:28:44', NULL, NULL, 'not issued'),
(13, 11, 3, 'QFS to NLC', 10, '2024-02-25 23:29:50', 5000, '2024-02-26 09:51:03', 'issued'),
(14, 12, 2, 'landhi to qfs', 2, '2024-02-25 23:51:44', 5000, '2024-02-26 09:51:58', 'issued'),
(15, 13, 2, 'landhi to qfs', 2, '2024-02-26 00:09:23', 5000, '2024-02-26 10:09:28', 'issued'),
(16, 14, 2, 'landhi to qfs', 2, '2024-02-26 00:10:20', 5000, '2024-02-26 10:10:26', 'issued'),
(17, 15, 2, 'landhi to qfs', 2, '2024-02-26 00:11:17', 5000, '2024-02-26 10:11:22', 'issued'),
(18, 16, 2, 'landhi to qfs', 2, '2024-02-26 00:16:26', 5000, '2024-02-26 10:16:43', 'issued'),
(19, 17, 3, 'QFS to NLC', 10, '2024-02-26 00:16:37', 5000, '2024-02-26 10:16:53', 'issued'),
(20, 17, 2, 'landhi to qfs', 2, '2024-02-26 00:16:37', 5000, '2024-02-26 10:16:59', 'issued'),
(21, 18, 3, 'QFS to NLC', 10, '2024-02-26 00:19:10', 5000, '2024-02-26 10:19:21', 'issued'),
(22, 19, 4, 'QFS to QFS', 100, '2024-02-27 06:02:42', NULL, NULL, 'not issued'),
(23, 19, 3, 'QFS to NLC', 10, '2024-02-27 06:02:42', NULL, NULL, 'not issued'),
(24, 19, 2, 'landhi to qfs', 2, '2024-02-27 06:02:42', NULL, NULL, 'not issued'),
(25, 19, 2, 'landhi to qfs', 2, '2024-02-27 06:02:42', 5000, '2024-02-27 11:03:33', 'issued'),
(26, 20, 1, 'Qfs to Nlc', 6, '2024-03-04 06:08:23', NULL, NULL, 'not issued');

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

--
-- Dumping data for table `tbl_fuel_equipment_company_setup`
--

INSERT INTO `tbl_fuel_equipment_company_setup` (`id`, `company_code`, `location_code`, `equipment_type`, `equipment_number`, `created_by`, `created_at`, `edit_by`, `edit_at`) VALUES
(1, 100, 1, 3, 'ABCD-3456', 5000, '2024-02-22 19:33:16', NULL, NULL),
(2, 10, 1, 1, 'ERT-098', 5000, '2024-02-22 19:33:31', NULL, NULL),
(3, 20, 1, 1, 'TRY-087', 5000, '2024-02-22 19:37:33', NULL, NULL),
(4, 20, 1, 3, '3298-sdfs', 5000, '2024-03-04 06:28:22', NULL, NULL),
(5, 1, 1, 1, 'try-081', 5000, '2024-03-05 06:09:06', NULL, NULL),
(6, 7000, 1, 1, 'GGH-0988', 5000, '2024-03-06 04:49:43', NULL, NULL),
(7, 5, 1, 1, 'yyt-223', 5000, '2024-03-06 04:50:36', NULL, NULL);

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
-- Dumping data for table `tbl_fuel_equipment_setup`
--

INSERT INTO `tbl_fuel_equipment_setup` (`id`, `equipment_type`, `created_by`, `created_at`, `edited_by`, `edited_at`) VALUES
(1, 'Trailer', 1, '2024-02-22 19:31:51', NULL, NULL),
(2, 'Office Vehicle', 1, '2024-02-22 19:32:16', NULL, NULL),
(3, 'Top Loader', 1, '2024-02-22 19:32:27', NULL, NULL),
(4, 'Trailer', 1, '2024-03-07 05:52:51', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fuel_issued_to_equipments`
--

CREATE TABLE `tbl_fuel_issued_to_equipments` (
  `id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `in_out` varchar(5) NOT NULL DEFAULT 'IN',
  `quantity_in_ltr` double NOT NULL DEFAULT 0,
  `inserted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `other_than_trip` tinyint(1) NOT NULL DEFAULT 0,
  `trip_based` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_fuel_issued_to_equipments`
--

INSERT INTO `tbl_fuel_issued_to_equipments` (`id`, `request_id`, `equipment_id`, `in_out`, `quantity_in_ltr`, `inserted_at`, `other_than_trip`, `trip_based`) VALUES
(1, 2, 1, 'IN', 1, '2024-02-22 19:42:28', 1, 0),
(2, 1, 1, 'IN', 6, '2024-02-22 19:50:17', 0, 1),
(3, 3, 1, 'IN', 1, '2024-02-22 19:57:17', 1, 0),
(4, 5, 3, 'IN', 2, '2024-02-22 20:07:49', 0, 1),
(5, 5, 3, 'IN', 10, '2024-02-22 20:07:49', 0, 1),
(6, 5, 3, 'IN', 2, '2024-02-22 20:07:49', 0, 1),
(7, 4, 3, 'IN', 2, '2024-02-22 21:32:39', 0, 1),
(8, 3, 3, 'IN', 2, '2024-02-22 21:32:44', 0, 1),
(9, 2, 1, 'IN', 6, '2024-02-22 21:32:50', 0, 1),
(10, 6, 3, 'IN', 2, '2024-02-25 23:13:57', 0, 1),
(11, 11, 3, 'IN', 10, '2024-02-25 23:45:04', 0, 1),
(12, 11, 3, 'IN', 10, '2024-02-25 23:51:03', 0, 1),
(13, 12, 3, 'IN', 2, '2024-02-25 23:51:58', 0, 1),
(14, 12, 3, 'IN', 6, '2024-02-25 23:52:36', 0, 1),
(15, 13, 3, 'IN', 2, '2024-02-26 00:09:28', 0, 1),
(16, 14, 3, 'IN', 2, '2024-02-26 00:10:26', 0, 1),
(17, 15, 3, 'IN', 2, '2024-02-26 00:11:22', 0, 1),
(18, 15, 3, 'IN', 3, '2024-02-26 00:15:00', 0, 1),
(19, 16, 3, 'IN', 2, '2024-02-26 00:16:43', 0, 1),
(20, 17, 3, 'IN', 10, '2024-02-26 00:16:53', 0, 1),
(21, 17, 3, 'IN', 2, '2024-02-26 00:16:59', 0, 1),
(22, 18, 3, 'IN', 1, '2024-02-26 00:19:15', 0, 1),
(23, 18, 3, 'IN', 10, '2024-02-26 00:19:21', 0, 1),
(24, 4, 2, 'IN', 50, '2024-02-27 05:58:41', 1, 0),
(25, 19, 3, 'IN', 2, '2024-02-27 06:03:33', 0, 1),
(26, 19, 3, 'IN', 28, '2024-02-27 06:04:50', 0, 1),
(27, 11, 3, 'IN', 2, '2024-03-01 07:44:27', 0, 1),
(28, 12, 3, 'IN', 2, '2024-03-01 07:55:32', 0, 1),
(29, 21, 3, 'IN', 2, '2024-03-05 05:35:09', 0, 1),
(30, 22, 4, 'IN', 1, '2024-03-05 05:46:02', 1, 0),
(31, 23, 3, 'IN', 2, '2024-03-05 05:47:41', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fuel_issue_for_equipments`
--

CREATE TABLE `tbl_fuel_issue_for_equipments` (
  `id` int(11) NOT NULL,
  `company_code` int(11) NOT NULL DEFAULT 10,
  `location_code` int(11) NOT NULL DEFAULT 4,
  `fuel_issued` double NOT NULL DEFAULT 0,
  `issued_date` date NOT NULL,
  `equipment_type` int(11) NOT NULL,
  `equipment_number` int(11) NOT NULL,
  `hrs_meter_reading` double NOT NULL DEFAULT 0,
  `submitted_by` int(11) NOT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `verified_by` int(11) DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Waiting For Verification',
  `trip_based` tinyint(1) NOT NULL DEFAULT 0,
  `stock_at_station` double DEFAULT NULL,
  `trips` text DEFAULT NULL,
  `trip_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_fuel_issue_for_equipments`
--

INSERT INTO `tbl_fuel_issue_for_equipments` (`id`, `company_code`, `location_code`, `fuel_issued`, `issued_date`, `equipment_type`, `equipment_number`, `hrs_meter_reading`, `submitted_by`, `submitted_at`, `verified_by`, `verified_at`, `status`, `trip_based`, `stock_at_station`, `trips`, `trip_id`) VALUES
(1, 10, 4, 12, '2024-02-23', 3, 1, 12, 5000, '2024-02-22 19:41:35', 5000, '2024-02-23 10:41:53', 'Rejected', 0, NULL, NULL, NULL),
(2, 10, 4, 1, '2024-02-23', 3, 1, 12, 5000, '2024-02-22 19:42:21', 5000, '2024-02-23 10:42:28', 'Verified', 0, 11, NULL, NULL),
(3, 10, 4, 1, '2024-02-23', 3, 1, 1, 5000, '2024-02-22 19:56:47', 5000, '2024-02-23 10:57:17', 'Verified', 0, 5, NULL, NULL),
(4, 10, 4, 50, '2024-02-27', 1, 2, 565543, 5000, '2024-02-27 05:57:25', 5000, '2024-02-27 10:58:41', 'Verified', 0, 146, NULL, NULL),
(5, 10, 4, 1200, '2024-03-01', 1, 2, 123, 5000, '2024-03-01 06:18:40', NULL, NULL, 'Waiting For Verification', 0, NULL, NULL, NULL),
(6, 10, 4, 0, '2024-03-01', 1, 3, 549884, 5000, '2024-03-01 06:51:56', NULL, NULL, 'Waiting For Verification', 1, NULL, NULL, NULL),
(7, 10, 4, 110, '2024-03-01', 1, 3, 54656, 5000, '2024-03-01 06:59:26', NULL, NULL, 'Waiting For Verification', 1, NULL, NULL, NULL),
(8, 10, 4, 112, '2024-03-01', 1, 3, 879655, 5000, '2024-03-01 07:01:49', NULL, NULL, 'Waiting For Verification', 1, NULL, '[object Object], [object Object], [object Object]', NULL),
(9, 10, 4, 112, '2024-03-01', 1, 3, 54646, 5000, '2024-03-01 07:03:43', NULL, NULL, 'Waiting For Verification', 1, NULL, 'QFS to NLC, QFS to QFS, landhi to qfs', NULL),
(10, 10, 4, 110, '2024-03-01', 1, 3, 56456456, 5000, '2024-03-01 07:12:11', NULL, NULL, 'Waiting For Verification', 1, NULL, 'QFS to QFS, QFS to NLC', NULL),
(11, 10, 4, 2, '2024-03-01', 1, 3, 546454, 5000, '2024-03-01 07:44:06', 5000, '2024-03-01 12:44:27', 'issued', 1, NULL, 'landhi to qfs', NULL),
(12, 10, 4, 2, '2024-03-01', 1, 3, 546546, 5000, '2024-03-01 07:55:27', 5000, '2024-03-01 12:55:32', 'issued', 1, 64, 'landhi to qfs', NULL),
(13, 10, 4, 102, '2024-03-04', 1, 3, 283479, 5000, '2024-03-04 05:59:10', NULL, NULL, 'Waiting For Verification', 1, NULL, 'QFS to QFS, landhi to qfs', NULL),
(14, 10, 4, 100, '2024-03-04', 3, 1, 364564, 5000, '2024-03-04 05:59:33', NULL, NULL, 'Waiting For Verification', 0, NULL, '', NULL),
(15, 10, 4, 100, '2024-03-04', 3, 1, 3242342, 5000, '2024-03-04 06:02:01', NULL, NULL, 'Waiting For Verification', 0, NULL, '', NULL),
(16, 10, 4, 1000, '2024-03-04', 3, 1, 143532, 5000, '2024-03-04 06:03:18', NULL, NULL, 'Waiting For Verification', 0, NULL, '', NULL),
(17, 10, 4, 100, '2024-03-04', 3, 1, 345345345, 5000, '2024-03-04 06:03:51', NULL, NULL, 'Waiting For Verification', 0, NULL, '', NULL),
(18, 10, 4, 1000, '2024-03-04', 3, 1, 42343242, 5000, '2024-03-04 06:04:36', NULL, NULL, 'Waiting For Verification', 0, NULL, '', NULL),
(19, 10, 4, 1000, '2024-03-04', 3, 1, 342323423, 5000, '2024-03-04 06:06:47', NULL, NULL, 'Waiting For Verification', 0, NULL, '', NULL),
(20, 10, 4, 1000, '2024-03-04', 1, 3, 232323, 5000, '2024-03-04 07:40:16', NULL, NULL, 'Waiting For Verification', 0, NULL, '', NULL),
(21, 10, 4, 2, '2024-03-05', 1, 3, 34534, 5000, '2024-03-05 05:34:51', 5000, '2024-03-05 10:35:09', 'issued', 1, 62, 'landhi to qfs', NULL),
(22, 10, 4, 1, '2024-03-05', 3, 4, 45456456, 5000, '2024-03-05 05:45:56', 5000, '2024-03-05 10:46:02', 'Verified', 0, 60, '', NULL),
(23, 10, 4, 2, '2024-03-05', 1, 3, 34345345, 5000, '2024-03-05 05:47:30', 5000, '2024-03-05 10:47:41', 'issued', 1, 59, 'landhi to qfs', NULL),
(24, 10, 4, 102, '2024-03-06', 1, 3, 3223432, 5000, '2024-03-06 07:21:08', NULL, NULL, 'Waiting For Verification', 1, NULL, 'QFS to QFS, landhi to qfs', NULL),
(25, 10, 4, 12, '2024-03-06', 1, 3, 657645456, 5000, '2024-03-06 07:50:46', NULL, NULL, 'Waiting For Verification', 1, NULL, 'landhi to qfs', NULL),
(26, 10, 4, 12, '2024-03-06', 1, 3, 657645456, 5000, '2024-03-06 07:50:46', NULL, NULL, 'Waiting For Verification', 1, NULL, 'QFS to NLC', NULL),
(27, 10, 4, 2, '2024-03-06', 1, 3, 454534, 5000, '2024-03-06 07:52:24', NULL, NULL, 'Waiting For Verification', 1, NULL, 'landhi to qfs', NULL),
(28, 10, 4, 10, '2024-03-06', 1, 3, 454534, 5000, '2024-03-06 07:52:24', NULL, NULL, 'Waiting For Verification', 1, NULL, 'QFS to NLC', NULL),
(29, 10, 4, 100, '2024-03-06', 1, 3, 3423423, 5000, '2024-03-06 07:53:19', NULL, NULL, 'Waiting For Verification', 1, NULL, 'QFS to QFS', NULL),
(30, 10, 4, 10, '2024-03-06', 1, 3, 3423423, 5000, '2024-03-06 07:53:19', NULL, NULL, 'Waiting For Verification', 1, NULL, 'QFS to NLC', NULL),
(31, 10, 4, 100, '2024-03-06', 1, 3, 45435345, 5000, '2024-03-06 07:55:25', NULL, NULL, 'Waiting For Verification', 1, NULL, 'QFS to QFS', 4),
(32, 10, 4, 10, '2024-03-06', 1, 3, 45435345, 5000, '2024-03-06 07:55:25', NULL, NULL, 'Waiting For Verification', 1, NULL, 'QFS to NLC', 3),
(33, 10, 4, 2, '2024-03-06', 1, 3, 45435345, 5000, '2024-03-06 07:55:25', NULL, NULL, 'Waiting For Verification', 1, NULL, 'landhi to qfs', 2),
(34, 10, 4, 2, '2024-03-07', 1, 3, 56456456, 5000, '2024-03-07 04:48:28', NULL, NULL, 'Waiting For Verification', 1, NULL, 'landhi to qfs', 2),
(35, 10, 4, 2, '2024-03-07', 1, 3, 56456456, 5000, '2024-03-07 04:48:28', NULL, NULL, 'Waiting For Verification', 1, NULL, 'landhi to qfs', 2),
(36, 10, 4, 2, '2024-03-07', 1, 3, 56456456, 5000, '2024-03-07 04:48:28', NULL, NULL, 'Waiting For Verification', 1, NULL, 'landhi to qfs', 2);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fuel_issue_for_trailers`
--

CREATE TABLE `tbl_fuel_issue_for_trailers` (
  `id` int(11) NOT NULL,
  `company_code` int(11) NOT NULL DEFAULT 10,
  `location_code` int(11) NOT NULL DEFAULT 4,
  `fuel_to_issue` double NOT NULL DEFAULT 0,
  `trip_date` date NOT NULL,
  `equipment_type` int(11) NOT NULL,
  `equipment_number` int(11) NOT NULL,
  `trip_from` varchar(255) NOT NULL,
  `trip_to` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_fuel_issue_for_trailers`
--

INSERT INTO `tbl_fuel_issue_for_trailers` (`id`, `company_code`, `location_code`, `fuel_to_issue`, `trip_date`, `equipment_type`, `equipment_number`, `trip_from`, `trip_to`, `created_by`, `created_at`, `status`) VALUES
(1, 10, 4, 6, '2024-02-23', 3, 1, 'Qfs', 'Nlc', 5000, '2024-02-22 19:49:12', 'Active'),
(2, 10, 4, 2, '2024-02-23', 1, 3, 'landhi', 'qfs', 5000, '2024-02-22 20:02:22', 'Active'),
(3, 10, 4, 10, '2024-02-23', 1, 3, 'QFS', 'NLC', 5000, '2024-02-22 20:06:48', 'Active'),
(4, 10, 4, 100, '2024-02-26', 1, 3, 'QFS', 'QFS', 5000, '2024-02-26 00:51:34', 'Active'),
(5, 10, 4, 1000, '2024-03-06', 1, 6, 'QFS', 'NLC', 5000, '2024-03-06 04:54:49', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fuel_receival_for_workshop`
--

CREATE TABLE `tbl_fuel_receival_for_workshop` (
  `id` int(11) NOT NULL,
  `company_code` int(11) NOT NULL,
  `location_code` int(11) NOT NULL,
  `supplier` varchar(255) NOT NULL,
  `fuel_received` double NOT NULL DEFAULT 0,
  `receival_date` date NOT NULL,
  `submitted_by` int(11) NOT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `verified_by` int(11) DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Waiting for verification',
  `stock_at_workshop` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_fuel_receival_for_workshop`
--

INSERT INTO `tbl_fuel_receival_for_workshop` (`id`, `company_code`, `location_code`, `supplier`, `fuel_received`, `receival_date`, `submitted_by`, `submitted_at`, `verified_by`, `verified_at`, `status`, `stock_at_workshop`) VALUES
(1, 7000, 1, 'Test', 12, '2024-02-22', 5000, '2024-02-22 19:38:33', 5000, '2024-02-22 19:39:37', 'Verified', 0),
(2, 10, 4, 'QFS', 50, '2024-02-26', 5000, '2024-02-25 23:11:10', 5000, '2024-02-25 23:12:11', 'Verified', 0),
(3, 10, 4, 'QFS', 100, '2024-02-26', 5000, '2024-02-26 00:07:38', 5000, '2024-02-26 00:07:58', 'Verified', 0),
(4, 20, 3, 'QFS', 100, '2024-02-26', 5000, '2024-02-26 00:38:14', 5000, '2024-02-26 00:38:47', 'Verified', 20),
(5, 10, 4, 'MRK TRADER PVT LTD', 6000, '2024-02-23', 5000, '2024-02-27 05:44:54', 5000, '2024-02-27 05:51:24', 'Verified', 120),
(6, 5, 1, 'QFS', 1000, '2024-03-06', 5000, '2024-03-06 04:51:14', 5000, '2024-03-06 04:51:27', 'Verified', 6020),
(7, 10, 1, '345435', 200, '2024-03-05', 5000, '2024-03-06 04:51:45', 5000, '2024-03-06 04:51:49', 'Rejected', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fuel_request_for_station`
--

CREATE TABLE `tbl_fuel_request_for_station` (
  `id` int(11) NOT NULL,
  `company_code` int(11) NOT NULL DEFAULT 10,
  `location_code` int(11) NOT NULL DEFAULT 4,
  `fuel_required` double NOT NULL DEFAULT 0,
  `requested_by` int(11) NOT NULL,
  `requested_at` datetime NOT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Waiting for approval',
  `stock_at_workshop` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_fuel_request_for_station`
--

INSERT INTO `tbl_fuel_request_for_station` (`id`, `company_code`, `location_code`, `fuel_required`, `requested_by`, `requested_at`, `approved_by`, `approved_at`, `status`, `stock_at_workshop`) VALUES
(1, 10, 4, 11, 5000, '2024-02-23 10:39:06', 5000, '2024-02-23 10:40:11', 'Approved', 12),
(2, 10, 4, 1, 5000, '2024-02-23 10:53:34', 5000, '2024-02-23 10:53:40', 'Rejected', NULL),
(3, 10, 4, 123456781, 5000, '2024-02-23 10:54:21', 5000, '2024-02-23 10:54:30', 'Rejected', NULL),
(4, 10, 4, 1124312, 5000, '2024-02-23 10:55:15', 5000, '2024-02-23 10:55:29', 'Rejected', NULL),
(5, 10, 4, 1, 5000, '2024-02-23 10:55:43', 5000, '2024-02-23 10:55:57', 'Approved', 1),
(6, 10, 4, 20, 5000, '2024-02-26 09:09:19', 5000, '2024-02-26 09:13:17', 'Approved', 50),
(7, 10, 4, 2, 5000, '2024-02-26 09:13:38', 5000, '2024-02-26 09:13:43', 'Approved', 30),
(8, 10, 4, 10, 5000, '2024-02-26 09:44:50', 5000, '2024-02-26 09:44:55', 'Approved', 28),
(9, 10, 4, 18, 5000, '2024-02-26 09:50:53', 5000, '2024-02-26 09:50:58', 'Approved', 18),
(10, 10, 4, 80, 5000, '2024-02-26 10:07:44', 5000, '2024-02-26 10:08:02', 'Approved', 100),
(11, 10, 4, 1, 5000, '2024-02-26 10:35:06', NULL, NULL, 'Waiting for approval', NULL),
(12, 10, 4, 1, 5000, '2024-02-26 10:35:10', NULL, NULL, 'Waiting for approval', NULL),
(13, 10, 4, 1, 5000, '2024-02-27 10:45:55', NULL, NULL, 'Waiting for approval', NULL),
(14, 10, 4, 100, 5000, '2024-02-27 10:58:20', 5000, '2024-02-27 10:58:27', 'Approved', 6120),
(15, 10, 4, 100, 5000, '2024-03-06 09:53:01', 5000, '2024-03-06 09:53:39', 'Rejected', NULL),
(16, 10, 4, 200, 5000, '2024-03-06 09:53:25', 5000, '2024-03-06 09:53:34', 'Approved', 7020);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fuel_stock_at_fueling_station`
--

CREATE TABLE `tbl_fuel_stock_at_fueling_station` (
  `id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `in_out` varchar(5) NOT NULL DEFAULT 'IN',
  `quantity_in_ltr` double NOT NULL DEFAULT 0,
  `fuel_requested_at` datetime NOT NULL,
  `inserted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `other_than_trip` tinyint(1) NOT NULL DEFAULT 0,
  `trip_based` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_fuel_stock_at_fueling_station`
--

INSERT INTO `tbl_fuel_stock_at_fueling_station` (`id`, `request_id`, `in_out`, `quantity_in_ltr`, `fuel_requested_at`, `inserted_at`, `other_than_trip`, `trip_based`) VALUES
(1, 1, 'IN', 11, '2024-02-23 10:39:06', '2024-02-22 19:40:11', 0, 0),
(2, 2, 'OUT', 1, '2024-02-23 00:00:00', '2024-02-22 19:42:28', 1, 0),
(3, 1, 'OUT', 6, '2024-02-23 00:00:00', '2024-02-22 19:50:17', 0, 1),
(4, 5, 'IN', 1, '2024-02-23 10:55:43', '2024-02-22 19:55:57', 0, 0),
(5, 3, 'OUT', 1, '2024-02-23 00:00:00', '2024-02-22 19:57:17', 1, 0),
(6, 5, 'OUT', 2, '2024-02-23 00:00:00', '2024-02-22 20:07:49', 0, 1),
(7, 5, 'OUT', 10, '2024-02-23 00:00:00', '2024-02-22 20:07:49', 0, 1),
(8, 5, 'OUT', 2, '2024-02-23 00:00:00', '2024-02-22 20:07:49', 0, 1),
(9, 4, 'OUT', 2, '2024-02-23 00:00:00', '2024-02-22 21:32:39', 0, 1),
(10, 3, 'OUT', 2, '2024-02-23 00:00:00', '2024-02-22 21:32:44', 0, 1),
(11, 2, 'OUT', 6, '2024-02-23 00:00:00', '2024-02-22 21:32:50', 0, 1),
(12, 6, 'IN', 20, '2024-02-26 09:09:19', '2024-02-25 23:13:17', 0, 0),
(13, 7, 'IN', 2, '2024-02-26 09:13:38', '2024-02-25 23:13:43', 0, 0),
(14, 6, 'OUT', 2, '2024-02-26 00:00:00', '2024-02-25 23:13:57', 0, 1),
(15, 8, 'IN', 10, '2024-02-26 09:44:50', '2024-02-25 23:44:55', 0, 0),
(16, 11, 'OUT', 10, '2024-02-26 00:00:00', '2024-02-25 23:45:04', 0, 1),
(17, 9, 'IN', 18, '2024-02-26 09:50:53', '2024-02-25 23:50:58', 0, 0),
(18, 11, 'OUT', 10, '2024-02-26 00:00:00', '2024-02-25 23:51:03', 0, 1),
(19, 12, 'OUT', 2, '2024-02-26 00:00:00', '2024-02-25 23:51:58', 0, 1),
(20, 12, 'OUT', 6, '2024-02-26 00:00:00', '2024-02-25 23:52:36', 0, 1),
(21, 10, 'IN', 80, '2024-02-26 10:07:44', '2024-02-26 00:08:02', 0, 0),
(22, 13, 'OUT', 2, '2024-02-26 00:00:00', '2024-02-26 00:09:28', 0, 1),
(23, 14, 'OUT', 2, '2024-02-26 00:00:00', '2024-02-26 00:10:26', 0, 1),
(24, 15, 'OUT', 2, '2024-02-26 00:00:00', '2024-02-26 00:11:22', 0, 1),
(25, 15, 'OUT', 3, '2024-02-26 00:00:00', '2024-02-26 00:15:00', 0, 1),
(26, 16, 'OUT', 2, '2024-02-26 00:00:00', '2024-02-26 00:16:43', 0, 1),
(27, 17, 'OUT', 10, '2024-02-26 00:00:00', '2024-02-26 00:16:53', 0, 1),
(28, 17, 'OUT', 2, '2024-02-26 00:00:00', '2024-02-26 00:16:59', 0, 1),
(29, 18, 'OUT', 1, '2024-02-26 00:00:00', '2024-02-26 00:19:15', 0, 1),
(30, 18, 'OUT', 10, '2024-02-26 00:00:00', '2024-02-26 00:19:21', 0, 1),
(31, 14, 'IN', 100, '2024-02-27 10:58:20', '2024-02-27 05:58:27', 0, 0),
(32, 4, 'OUT', 50, '2024-02-27 00:00:00', '2024-02-27 05:58:41', 1, 0),
(33, 19, 'OUT', 2, '2024-02-27 00:00:00', '2024-02-27 06:03:33', 0, 1),
(34, 19, 'OUT', 28, '2024-02-27 00:00:00', '2024-02-27 06:04:50', 0, 1),
(35, 11, 'OUT', 2, '0000-00-00 00:00:00', '2024-03-01 07:44:27', 0, 1),
(36, 12, 'OUT', 2, '0000-00-00 00:00:00', '2024-03-01 07:55:32', 0, 1),
(37, 21, 'OUT', 2, '0000-00-00 00:00:00', '2024-03-05 05:35:09', 0, 1),
(38, 22, 'OUT', 1, '2024-03-05 00:00:00', '2024-03-05 05:46:02', 1, 0),
(39, 23, 'OUT', 2, '0000-00-00 00:00:00', '2024-03-05 05:47:41', 0, 1),
(40, 16, 'IN', 200, '2024-03-06 09:53:25', '2024-03-06 04:53:34', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fuel_stock_at_workshop`
--

CREATE TABLE `tbl_fuel_stock_at_workshop` (
  `id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `in_out` varchar(5) NOT NULL DEFAULT 'IN',
  `quantity_in_ltr` double NOT NULL DEFAULT 0,
  `fuel_received_at` date DEFAULT NULL,
  `inserted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_fuel_stock_at_workshop`
--

INSERT INTO `tbl_fuel_stock_at_workshop` (`id`, `request_id`, `in_out`, `quantity_in_ltr`, `fuel_received_at`, `inserted_at`) VALUES
(1, 1, 'IN', 12, '2024-02-22', '2024-02-22 19:39:37'),
(2, 1, 'OUT', 11, '2024-02-23', '2024-02-22 19:40:11'),
(3, 5, 'OUT', 1, '2024-02-23', '2024-02-22 19:55:57'),
(4, 2, 'IN', 50, '2024-02-26', '2024-02-25 23:12:11'),
(5, 6, 'OUT', 20, '2024-02-26', '2024-02-25 23:13:17'),
(6, 7, 'OUT', 2, '2024-02-26', '2024-02-25 23:13:43'),
(7, 8, 'OUT', 10, '2024-02-26', '2024-02-25 23:44:55'),
(8, 9, 'OUT', 18, '2024-02-26', '2024-02-25 23:50:58'),
(9, 3, 'IN', 100, '2024-02-26', '2024-02-26 00:07:58'),
(10, 10, 'OUT', 80, '2024-02-26', '2024-02-26 00:08:02'),
(11, 4, 'IN', 100, '2024-02-26', '2024-02-26 00:38:47'),
(12, 5, 'IN', 6000, '2024-02-23', '2024-02-27 05:51:24'),
(13, 14, 'OUT', 100, '2024-02-27', '2024-02-27 05:58:27'),
(14, 6, 'IN', 1000, '2024-03-06', '2024-03-06 04:51:27'),
(15, 16, 'OUT', 200, '2024-03-06', '2024-03-06 04:53:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_fuel_entry_for_trip`
--
ALTER TABLE `tbl_fuel_entry_for_trip`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_fuel_entry_trips_list`
--
ALTER TABLE `tbl_fuel_entry_trips_list`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `tbl_fuel_issued_to_equipments`
--
ALTER TABLE `tbl_fuel_issued_to_equipments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_fuel_issue_for_equipments`
--
ALTER TABLE `tbl_fuel_issue_for_equipments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_fuel_issue_for_trailers`
--
ALTER TABLE `tbl_fuel_issue_for_trailers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_fuel_receival_for_workshop`
--
ALTER TABLE `tbl_fuel_receival_for_workshop`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_code` (`company_code`),
  ADD KEY `location_code` (`location_code`),
  ADD KEY `submitted_by` (`submitted_by`),
  ADD KEY `verified_by` (`verified_by`);

--
-- Indexes for table `tbl_fuel_request_for_station`
--
ALTER TABLE `tbl_fuel_request_for_station`
  ADD PRIMARY KEY (`id`),
  ADD KEY `requested_by` (`requested_by`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `tbl_fuel_stock_at_fueling_station`
--
ALTER TABLE `tbl_fuel_stock_at_fueling_station`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_fuel_stock_at_workshop`
--
ALTER TABLE `tbl_fuel_stock_at_workshop`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_fuel_entry_for_trip`
--
ALTER TABLE `tbl_fuel_entry_for_trip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `tbl_fuel_entry_trips_list`
--
ALTER TABLE `tbl_fuel_entry_trips_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `tbl_fuel_equipment_company_setup`
--
ALTER TABLE `tbl_fuel_equipment_company_setup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_fuel_equipment_setup`
--
ALTER TABLE `tbl_fuel_equipment_setup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_fuel_issued_to_equipments`
--
ALTER TABLE `tbl_fuel_issued_to_equipments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `tbl_fuel_issue_for_equipments`
--
ALTER TABLE `tbl_fuel_issue_for_equipments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `tbl_fuel_issue_for_trailers`
--
ALTER TABLE `tbl_fuel_issue_for_trailers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_fuel_receival_for_workshop`
--
ALTER TABLE `tbl_fuel_receival_for_workshop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_fuel_request_for_station`
--
ALTER TABLE `tbl_fuel_request_for_station`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tbl_fuel_stock_at_fueling_station`
--
ALTER TABLE `tbl_fuel_stock_at_fueling_station`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `tbl_fuel_stock_at_workshop`
--
ALTER TABLE `tbl_fuel_stock_at_workshop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

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

--
-- Constraints for table `tbl_fuel_receival_for_workshop`
--
ALTER TABLE `tbl_fuel_receival_for_workshop`
  ADD CONSTRAINT `tbl_fuel_receival_for_workshop_ibfk_1` FOREIGN KEY (`company_code`) REFERENCES `companies` (`company_code`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_fuel_receival_for_workshop_ibfk_2` FOREIGN KEY (`location_code`) REFERENCES `locations` (`location_code`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_fuel_receival_for_workshop_ibfk_3` FOREIGN KEY (`submitted_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_fuel_receival_for_workshop_ibfk_4` FOREIGN KEY (`verified_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE;

--
-- Constraints for table `tbl_fuel_request_for_station`
--
ALTER TABLE `tbl_fuel_request_for_station`
  ADD CONSTRAINT `tbl_fuel_request_for_station_ibfk_1` FOREIGN KEY (`requested_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_fuel_request_for_station_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
