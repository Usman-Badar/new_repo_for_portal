-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 14, 2022 at 04:53 AM
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
-- Table structure for table `tbl_inventory_categories`
--

CREATE TABLE `tbl_inventory_categories` (
  `category_id` int(11) NOT NULL,
  `icon` text DEFAULT NULL,
  `name` text NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_inventory_categories`
--

INSERT INTO `tbl_inventory_categories` (`category_id`, `icon`, `name`, `status`) VALUES
(1, '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 512\"><path d=\"M255.03 261.65c6.25 6.25 16.38 6.25 22.63 0l11.31-11.31c6.25-6.25 6.25-16.38 0-22.63L253.25 192l35.71-35.72c6.25-6.25 6.25-16.38 0-22.63l-11.31-11.31c-6.25-6.25-16.38-6.25-22.63 0l-58.34 58.34c-6.25 6.25-6.25 16.38 0 22.63l58.35 58.34zm96.01-11.3l11.31 11.31c6.25 6.25 16.38 6.25 22.63 0l58.34-58.34c6.25-6.25 6.25-16.38 0-22.63l-58.34-58.34c-6.25-6.25-16.38-6.25-22.63 0l-11.31 11.31c-6.25 6.25-6.25 16.38 0 22.63L386.75 192l-35.71 35.72c-6.25 6.25-6.25 16.38 0 22.63zM624 416H381.54c-.74 19.81-14.71 32-32.74 32H288c-18.69 0-33.02-17.47-32.77-32H16c-8.8 0-16 7.2-16 16v16c0 35.2 28.8 64 64 64h512c35.2 0 64-28.8 64-64v-16c0-8.8-7.2-16-16-16zM576 48c0-26.4-21.6-48-48-48H112C85.6 0 64 21.6 64 48v336h512V48zm-64 272H128V64h384v256z\"/></svg>', 'Laptop', 'removed'),
(2, '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path d=\"M229.3 182.6c-49.3 0-89.2 39.9-89.2 89.2 0 49.3 39.9 89.2 89.2 89.2s89.2-39.9 89.2-89.2c0-49.3-40-89.2-89.2-89.2zm62.7 56.6l-58.9 30.6c-1.8.9-3.8-.4-3.8-2.3V201c0-1.5 1.3-2.7 2.7-2.6 26.2 1 48.9 15.7 61.1 37.1.7 1.3.2 3-1.1 3.7zM389.1 32H58.9C26.4 32 0 58.4 0 90.9V421c0 32.6 26.4 59 58.9 59H389c32.6 0 58.9-26.4 58.9-58.9V90.9C448 58.4 421.6 32 389.1 32zm-202.6 84.7c0-10.8 8.7-19.5 19.5-19.5h45.3c10.8 0 19.5 8.7 19.5 19.5v15.4c0 1.8-1.7 3-3.3 2.5-12.3-3.4-25.1-5.1-38.1-5.1-13.5 0-26.7 1.8-39.4 5.5-1.7.5-3.4-.8-3.4-2.5v-15.8zm-84.4 37l9.2-9.2c7.6-7.6 19.9-7.6 27.5 0l7.7 7.7c1.1 1.1 1 3-.3 4-6.2 4.5-12.1 9.4-17.6 14.9-5.4 5.4-10.4 11.3-14.8 17.4-1 1.3-2.9 1.5-4 .3l-7.7-7.7c-7.6-7.5-7.6-19.8 0-27.4zm127.2 244.8c-70 0-126.6-56.7-126.6-126.6s56.7-126.6 126.6-126.6c70 0 126.6 56.6 126.6 126.6 0 69.8-56.7 126.6-126.6 126.6z\"/></svg>', 'Stationary', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_inventory_delivery_challan`
--

CREATE TABLE `tbl_inventory_delivery_challan` (
  `challan_id` int(11) NOT NULL,
  `invoice_no` text DEFAULT NULL,
  `vender_id` int(11) NOT NULL,
  `received_from_name` text NOT NULL,
  `received_from_number` text NOT NULL,
  `received_by` int(11) NOT NULL,
  `generate_time` time NOT NULL,
  `generate_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_inventory_delivery_challan`
--

INSERT INTO `tbl_inventory_delivery_challan` (`challan_id`, `invoice_no`, `vender_id`, `received_from_name`, `received_from_number`, `received_by`, `generate_time`, `generate_date`) VALUES
(1, '423324', 1, 'Muhammad Malahim', '03422618992', 2015, '16:10:52', '2022-10-13');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_inventory_delivery_challan_items`
--

CREATE TABLE `tbl_inventory_delivery_challan_items` (
  `id` int(11) NOT NULL,
  `challan_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_inventory_delivery_challan_items`
--

INSERT INTO `tbl_inventory_delivery_challan_items` (`id`, `challan_id`, `description`, `quantity`) VALUES
(1, 1, 'Red pen', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_inventory_products`
--

CREATE TABLE `tbl_inventory_products` (
  `product_id` int(11) NOT NULL,
  `entering_code` text NOT NULL,
  `delivery_challan` int(11) DEFAULT NULL,
  `company_code` int(11) NOT NULL,
  `location_code` int(11) NOT NULL,
  `sub_location_code` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `sub_category_id` int(11) NOT NULL,
  `employee` int(11) DEFAULT NULL,
  `request_id` int(11) DEFAULT NULL,
  `product_type` varchar(100) NOT NULL DEFAULT 'consumable',
  `preview` text DEFAULT NULL,
  `name` text NOT NULL,
  `physical_condition` text NOT NULL DEFAULT 'Good',
  `description` text NOT NULL,
  `note` text DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` float NOT NULL DEFAULT 0,
  `status` varchar(50) NOT NULL DEFAULT 'active',
  `recording_date` date DEFAULT NULL,
  `acquisition_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_inventory_products`
--

INSERT INTO `tbl_inventory_products` (`product_id`, `entering_code`, `delivery_challan`, `company_code`, `location_code`, `sub_location_code`, `category_id`, `sub_category_id`, `employee`, `request_id`, `product_type`, `preview`, `name`, `physical_condition`, `description`, `note`, `quantity`, `unit_price`, `status`, `recording_date`, `acquisition_date`) VALUES
(1, '1665659024070_13102022', NULL, 1, 1, 1, 2, 1, NULL, NULL, 'consumable', NULL, 'Red Pen', 'Good', 'Red Pen', 'Red Pen', 98, 0, 'active', '2022-10-13', NULL),
(2, '1665659058346_13102022', NULL, 1, 1, 1, 2, 1, NULL, NULL, 'consumable', NULL, 'Red Pen', 'Good', 'for testing purpose', 'Red Pen', 80, 0, 'active', '2022-10-13', NULL),
(3, '1665659708208_13102022', NULL, 1, 1, 1, 2, 1, NULL, NULL, 'consumable', 'products/testing for Inventory2..vnd.openxmlformats-officedocument.wordprocessingml.document', 'Red Pen', 'Good', 'Red Pen', 'red pen', 1, 0, 'active', '2022-10-13', NULL),
(4, '1665659921201_13102022', 1, 1, 1, 1, 2, 1, NULL, NULL, 'non-consumable', 'products/portallogo..png', 'Red Pen', 'Good', 'Red Pen', 'Red Pen', 100, 0, 'active', '2022-10-13', '2022-10-13'),
(5, '1665661051768_13102022', NULL, 1, 1, 1, 2, 1, 500, 1, 'consumable', NULL, 'Red Pen', 'Good', 'Red Pen', 'Red Pen', 2, 0, 'active', '2022-10-13', NULL),
(6, '1665662116626_13102022', NULL, 1, 1, 1, 2, 1, 500, 3, 'consumable', NULL, 'Red Pen', 'Good', 'for testing purpose', 'Red Pen', 10, 0, 'active', '2022-10-13', NULL),
(7, '1665662323562_13102022', NULL, 1, 1, 1, 2, 1, 500, 2, 'consumable', NULL, 'Red Pen', 'Good', 'for testing purpose', 'Red Pen', 10, 0, 'active', '2022-10-13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_inventory_product_attributes`
--

CREATE TABLE `tbl_inventory_product_attributes` (
  `attribute_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `value_str` text DEFAULT NULL,
  `value_int` int(11) DEFAULT NULL,
  `value_float` float DEFAULT NULL,
  `value_date` date DEFAULT NULL,
  `value_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_inventory_product_attributes`
--

INSERT INTO `tbl_inventory_product_attributes` (`attribute_id`, `product_id`, `description`, `value_str`, `value_int`, `value_float`, `value_date`, `value_time`) VALUES
(1, 4, 'size', 'large', NULL, NULL, NULL, NULL),
(2, 4, 'color', 'red', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_inventory_request_to_store`
--

CREATE TABLE `tbl_inventory_request_to_store` (
  `id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `entry_code` text NOT NULL,
  `requested_by` int(11) NOT NULL,
  `request_date` date NOT NULL,
  `request_time` time NOT NULL,
  `accepted_by` int(11) DEFAULT NULL,
  `accept_date` date DEFAULT NULL,
  `accept_time` time DEFAULT NULL,
  `issued` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_inventory_request_to_store`
--

INSERT INTO `tbl_inventory_request_to_store` (`id`, `request_id`, `entry_code`, `requested_by`, `request_date`, `request_time`, `accepted_by`, `accept_date`, `accept_time`, `issued`) VALUES
(1, 1, '1665660968134_13102022', 500, '2022-10-13', '16:36:08', 500, '2022-10-13', '16:36:17', 1),
(2, 3, '1665662096485_13102022', 500, '2022-10-13', '16:54:56', 500, '2022-10-13', '16:55:05', 1),
(3, 2, '1665662308233_13102022', 500, '2022-10-13', '16:58:28', 500, '2022-10-13', '16:58:34', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_inventory_request_to_store_assigned_items`
--

CREATE TABLE `tbl_inventory_request_to_store_assigned_items` (
  `id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `assigned_quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_inventory_request_to_store_assigned_items`
--

INSERT INTO `tbl_inventory_request_to_store_assigned_items` (`id`, `request_id`, `product_id`, `assigned_quantity`) VALUES
(1, 1, 1, 2),
(2, 2, 2, 10),
(3, 3, 2, 10);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_inventory_sub_categories`
--

CREATE TABLE `tbl_inventory_sub_categories` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `icon` text DEFAULT NULL,
  `name` text NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_inventory_sub_categories`
--

INSERT INTO `tbl_inventory_sub_categories` (`id`, `category_id`, `icon`, `name`, `status`) VALUES
(1, 2, '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M136.6 138.79a64.003 64.003 0 0 0-43.31 41.35L0 460l14.69 14.69L164.8 324.58c-2.99-6.26-4.8-13.18-4.8-20.58 0-26.51 21.49-48 48-48s48 21.49 48 48-21.49 48-48 48c-7.4 0-14.32-1.81-20.58-4.8L37.31 497.31 52 512l279.86-93.29a64.003 64.003 0 0 0 41.35-43.31L416 224 288 96l-151.4 42.79zm361.34-64.62l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.75 18.75-49.15 0-67.91z\"/></svg>', 'Red Pen', 'active'),
(2, 2, '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z\"/></svg>', 'Blue Pen', 'active'),
(3, 2, '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M352 96c0-53.02-42.98-96-96-96s-96 42.98-96 96 42.98 96 96 96 96-42.98 96-96zM233.59 241.1c-59.33-36.32-155.43-46.3-203.79-49.05C13.55 191.13 0 203.51 0 219.14v222.8c0 14.33 11.59 26.28 26.49 27.05 43.66 2.29 131.99 10.68 193.04 41.43 9.37 4.72 20.48-1.71 20.48-11.87V252.56c-.01-4.67-2.32-8.95-6.42-11.46zm248.61-49.05c-48.35 2.74-144.46 12.73-203.78 49.05-4.1 2.51-6.41 6.96-6.41 11.63v245.79c0 10.19 11.14 16.63 20.54 11.9 61.04-30.72 149.32-39.11 192.97-41.4 14.9-.78 26.49-12.73 26.49-27.06V219.14c-.01-15.63-13.56-28.01-29.81-27.09z\"/></svg>', 'Notebook', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_inventory_sub_locations`
--

CREATE TABLE `tbl_inventory_sub_locations` (
  `sub_location_code` int(11) NOT NULL,
  `location_code` int(11) NOT NULL,
  `sub_location_name` text NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_inventory_sub_locations`
--

INSERT INTO `tbl_inventory_sub_locations` (`sub_location_code`, `location_code`, `sub_location_name`, `status`) VALUES
(1, 1, 'Accounts dept', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_inventory_venders`
--

CREATE TABLE `tbl_inventory_venders` (
  `vender_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `phone` text NOT NULL,
  `address` text NOT NULL,
  `ntn_no` text DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_inventory_venders`
--

INSERT INTO `tbl_inventory_venders` (`vender_id`, `name`, `phone`, `address`, `ntn_no`, `status`) VALUES
(1, 'Ali Enterprises', '03562221520', 'For testing purpose', '959566526', 'active'),
(2, 'mughal systems', '0352215223522', 'For testing Purpose', NULL, 'active'),
(3, 'Ali Enterprises2', 'defwerwerwer', 'sdfsdfsdfsdfsd', '32423', 'active'),
(4, 'jsbdwnjv', '2985125125125', 'sdrgrebhetnhb', NULL, 'removed');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_portal_menu`
--

CREATE TABLE `tbl_portal_menu` (
  `id` int(11) NOT NULL,
  `menu_txt` varchar(255) NOT NULL,
  `icon_class_name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'link',
  `option_id` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `view` varchar(255) NOT NULL DEFAULT 'portal',
  `under_menu` varchar(255) DEFAULT NULL,
  `access` text DEFAULT NULL,
  `indexing` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_portal_menu`
--

INSERT INTO `tbl_portal_menu` (`id`, `menu_txt`, `icon_class_name`, `type`, `option_id`, `link`, `view`, `under_menu`, `access`, `indexing`) VALUES
(1, 'Home', 'las la-home', 'link', NULL, '/dashboard', 'portal', NULL, NULL, 1),
(2, 'Chat', 'lab la-rocketchat', 'link', NULL, '/chat', 'portal', NULL, NULL, 2),
(3, 'Drive', 'lab la-google-drive', 'link', NULL, '/drive', 'portal', NULL, NULL, 3),
(4, 'News', 'lar la-newspaper', 'link', NULL, '/news', 'portal', NULL, NULL, 4),
(7, 'Inventory', 'las la-file-invoice-dollar', 'link', NULL, '/inventory/dashboard', 'portal', NULL, '[1,517]', 7),
(8, 'Store', 'las la-store', 'menu', 'store_options', NULL, 'portal', NULL, '[1,527]', 8),
(9, 'Inventory Requests', 'las la-tasks', 'link', NULL, '/store/inventory_requests', 'portal', 'store_options', '[1,527]', 1),
(12, 'Attendance', 'las la-calendar-day', 'menu', 'attendance_options', NULL, 'portal', NULL, NULL, 9),
(13, 'Attendance Requests', 'las la-traffic-light', 'link', NULL, '/attendance_requests', 'portal', 'attendance_options', '[1,101]', 1),
(14, 'View Guests', 'las la-user-injured', 'link', NULL, '/guests', 'portal', 'attendance_options', '[1,503]', 2),
(15, 'View Employees Attendance', 'las la-users', 'link', NULL, '/view_employees_attendance', 'portal', 'attendance_options', '[1,506,502]', 3),
(16, 'View Leave Requests', 'las la-mail-bulk', 'link', NULL, '/view_leave_requests', 'portal', 'attendance_options', '[1,509]', 4),
(17, 'Procurement', 'las la-dollar-sign', 'menu', 'procurement_options', NULL, 'portal', NULL, '[1,521]', 10),
(18, 'View Purchase Requisition', 'las la-stream', 'link', NULL, '/purchaserequisition/home', 'portal', 'procurement_options', '[1,510,512,513,514,515]', 1),
(19, 'View Purchase Orders', 'las la-stream', 'link', NULL, '/purchaseorder/home', 'portal', 'procurement_options', '[1,523,524]', 2),
(22, 'Forms', 'las la-server', 'menu', 'form_options', NULL, 'portal', NULL, NULL, 12),
(24, 'Leave Form', 'las la-scroll', 'link', NULL, '/leave_form', 'portal', 'form_options', NULL, 1),
(27, 'Item Request', 'las la-cash-register', 'link', NULL, '/item_requests', 'portal', 'form_options', NULL, 4),
(29, 'Attendance Request', 'las la-cash-register', 'link', NULL, '/attendance_request', 'portal', 'form_options', NULL, 5),
(30, 'Back To Portal', 'las la-arrow-left', 'link', NULL, '/dashboard', 'inventory', NULL, NULL, 1),
(31, 'Dashboard', 'las la-home', 'link', NULL, '/inventory/dashboard', 'inventory', NULL, NULL, 2),
(32, 'Assets', 'las la-hand-holding-usd', 'link', NULL, '/inventory/assets', 'inventory', NULL, NULL, 3),
(33, 'Item Names', 'lab la-app-store-ios', 'link', NULL, '/inventory/items_names', 'inventory', NULL, NULL, 4),
(35, 'Back To Portal', 'las la-arrow-left', 'link', NULL, '/dashboard', 'leave', NULL, NULL, 1),
(36, 'Leave Form', 'lab la-wpforms', 'link', NULL, '/leave/leave_form', 'leave', NULL, NULL, 3),
(37, 'Short Leave Form', 'las la-paste', 'link', NULL, '/leave/short_leave_form', 'leave', NULL, NULL, 4),
(38, 'Dashboard', 'las la-chart-line', 'link', NULL, '/leave/dashboard', 'leave', NULL, NULL, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_inventory_categories`
--
ALTER TABLE `tbl_inventory_categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `tbl_inventory_delivery_challan`
--
ALTER TABLE `tbl_inventory_delivery_challan`
  ADD PRIMARY KEY (`challan_id`),
  ADD KEY `received_by` (`received_by`),
  ADD KEY `vender_id` (`vender_id`);

--
-- Indexes for table `tbl_inventory_delivery_challan_items`
--
ALTER TABLE `tbl_inventory_delivery_challan_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `challan_id` (`challan_id`);

--
-- Indexes for table `tbl_inventory_products`
--
ALTER TABLE `tbl_inventory_products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `location_code` (`location_code`),
  ADD KEY `sub_category_id` (`sub_category_id`),
  ADD KEY `sub_location_code` (`sub_location_code`),
  ADD KEY `company_code` (`company_code`),
  ADD KEY `delivery_challan` (`delivery_challan`),
  ADD KEY `employee` (`employee`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `tbl_inventory_product_attributes`
--
ALTER TABLE `tbl_inventory_product_attributes`
  ADD PRIMARY KEY (`attribute_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `tbl_inventory_request_to_store`
--
ALTER TABLE `tbl_inventory_request_to_store`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `accepted_by` (`accepted_by`),
  ADD KEY `requested_by` (`requested_by`);

--
-- Indexes for table `tbl_inventory_request_to_store_assigned_items`
--
ALTER TABLE `tbl_inventory_request_to_store_assigned_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `tbl_inventory_sub_categories`
--
ALTER TABLE `tbl_inventory_sub_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_inventory_sub_locations`
--
ALTER TABLE `tbl_inventory_sub_locations`
  ADD PRIMARY KEY (`sub_location_code`),
  ADD KEY `location_code` (`location_code`);

--
-- Indexes for table `tbl_inventory_venders`
--
ALTER TABLE `tbl_inventory_venders`
  ADD PRIMARY KEY (`vender_id`);

--
-- Indexes for table `tbl_portal_menu`
--
ALTER TABLE `tbl_portal_menu`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_inventory_categories`
--
ALTER TABLE `tbl_inventory_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_inventory_delivery_challan`
--
ALTER TABLE `tbl_inventory_delivery_challan`
  MODIFY `challan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_inventory_delivery_challan_items`
--
ALTER TABLE `tbl_inventory_delivery_challan_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_inventory_products`
--
ALTER TABLE `tbl_inventory_products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_inventory_product_attributes`
--
ALTER TABLE `tbl_inventory_product_attributes`
  MODIFY `attribute_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_inventory_request_to_store`
--
ALTER TABLE `tbl_inventory_request_to_store`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_inventory_request_to_store_assigned_items`
--
ALTER TABLE `tbl_inventory_request_to_store_assigned_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_inventory_sub_categories`
--
ALTER TABLE `tbl_inventory_sub_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_inventory_sub_locations`
--
ALTER TABLE `tbl_inventory_sub_locations`
  MODIFY `sub_location_code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_inventory_venders`
--
ALTER TABLE `tbl_inventory_venders`
  MODIFY `vender_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_portal_menu`
--
ALTER TABLE `tbl_portal_menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_inventory_delivery_challan`
--
ALTER TABLE `tbl_inventory_delivery_challan`
  ADD CONSTRAINT `tbl_inventory_delivery_challan_ibfk_1` FOREIGN KEY (`received_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_inventory_delivery_challan_ibfk_2` FOREIGN KEY (`vender_id`) REFERENCES `tbl_inventory_venders` (`vender_id`) ON UPDATE CASCADE;

--
-- Constraints for table `tbl_inventory_delivery_challan_items`
--
ALTER TABLE `tbl_inventory_delivery_challan_items`
  ADD CONSTRAINT `tbl_inventory_delivery_challan_items_ibfk_1` FOREIGN KEY (`challan_id`) REFERENCES `tbl_inventory_delivery_challan` (`challan_id`) ON UPDATE CASCADE;

--
-- Constraints for table `tbl_inventory_products`
--
ALTER TABLE `tbl_inventory_products`
  ADD CONSTRAINT `tbl_inventory_products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `tbl_inventory_categories` (`category_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_inventory_products_ibfk_2` FOREIGN KEY (`location_code`) REFERENCES `locations` (`location_code`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_inventory_products_ibfk_3` FOREIGN KEY (`sub_category_id`) REFERENCES `tbl_inventory_sub_categories` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_inventory_products_ibfk_4` FOREIGN KEY (`sub_location_code`) REFERENCES `tbl_inventory_sub_locations` (`sub_location_code`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_inventory_products_ibfk_5` FOREIGN KEY (`company_code`) REFERENCES `companies` (`company_code`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_inventory_products_ibfk_6` FOREIGN KEY (`delivery_challan`) REFERENCES `tbl_inventory_delivery_challan` (`challan_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_inventory_products_ibfk_7` FOREIGN KEY (`employee`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_inventory_products_ibfk_8` FOREIGN KEY (`request_id`) REFERENCES `tbl_item_requests` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `tbl_inventory_product_attributes`
--
ALTER TABLE `tbl_inventory_product_attributes`
  ADD CONSTRAINT `tbl_inventory_product_attributes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `tbl_inventory_products` (`product_id`) ON UPDATE CASCADE;

--
-- Constraints for table `tbl_inventory_request_to_store`
--
ALTER TABLE `tbl_inventory_request_to_store`
  ADD CONSTRAINT `tbl_inventory_request_to_store_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `tbl_item_requests` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_inventory_request_to_store_ibfk_2` FOREIGN KEY (`accepted_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_inventory_request_to_store_ibfk_3` FOREIGN KEY (`requested_by`) REFERENCES `employees` (`emp_id`) ON UPDATE CASCADE;

--
-- Constraints for table `tbl_inventory_request_to_store_assigned_items`
--
ALTER TABLE `tbl_inventory_request_to_store_assigned_items`
  ADD CONSTRAINT `tbl_inventory_request_to_store_assigned_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `tbl_inventory_products` (`product_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_inventory_request_to_store_assigned_items_ibfk_2` FOREIGN KEY (`request_id`) REFERENCES `tbl_inventory_request_to_store` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `tbl_inventory_sub_locations`
--
ALTER TABLE `tbl_inventory_sub_locations`
  ADD CONSTRAINT `tbl_inventory_sub_locations_ibfk_1` FOREIGN KEY (`location_code`) REFERENCES `locations` (`location_code`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
