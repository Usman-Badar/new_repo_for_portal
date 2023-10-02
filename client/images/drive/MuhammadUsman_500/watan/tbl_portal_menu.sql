-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 11, 2022 at 07:43 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

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
(5, 'Black Board', 'las la-video', 'link', NULL, 'blackboard', 'portal', NULL, '[1]', 5),
(6, 'Help', 'las la-question', 'link', NULL, '/help', 'portal', NULL, '[1]', 6),
(7, 'Inventory', 'las la-file-invoice-dollar', 'link', NULL, '/inventory/dashboard', 'portal', NULL, '[1,517]', 7),
(8, 'Store', 'las la-store', 'menu', 'store_options', NULL, 'portal', NULL, '[1,527]', 8),
(9, 'Store Items', 'las la-tasks', 'link', NULL, '/store/items', 'portal', 'store_options', '[1,527]', 1),
(10, 'Inward', 'las la-sign-in-alt', 'link', NULL, '/store/inward', 'portal', 'store_options', '[1,527]', 2),
(11, 'Outward', 'las la-sign-out-alt', 'link', NULL, '/store/outward', 'portal', 'store_options', '[1,527]', 3),
(12, 'Attendance', 'las la-calendar-day', 'menu', 'attendance_options', NULL, 'portal', NULL, NULL, 9),
(13, 'Attendance Requests', 'las la-traffic-light', 'link', NULL, '/attendance_requests', 'portal', 'attendance_options', '[1,101]', 1),
(14, 'View Guests', 'las la-user-injured', 'link', NULL, '/guests', 'portal', 'attendance_options', '[1,503]', 2),
(15, 'View Employees Attendance', 'las la-users', 'link', NULL, '/view_employees_attendance', 'portal', 'attendance_options', '[1,506,502]', 3),
(16, 'View Leave Requests', 'las la-mail-bulk', 'link', NULL, '/view_leave_requests', 'portal', 'attendance_options', '[1,509]', 4),
(17, 'Procurement', 'las la-dollar-sign', 'menu', 'procurement_options', NULL, 'portal', NULL, '[1,521]', 10),
(18, 'View Purchase Requisition', 'las la-stream', 'link', NULL, '/purchaserequisition/home', 'portal', 'procurement_options', '[1,510,512,513,514,515]', 1),
(19, 'View Purchase Orders', 'las la-stream', 'link', NULL, '/purchaseorder/home', 'portal', 'procurement_options', '[1,523,524]', 2),
(20, 'Archiving', 'las la-archive', 'menu', 'documentation_options', NULL, 'portal', NULL, '[1]', 11),
(21, 'Documentation', 'las la-book', 'link', NULL, '/purchaserequisition/home', 'portal', 'documentation_options', '[1]', 1),
(22, 'Forms', 'las la-server', 'menu', 'form_options', NULL, 'portal', NULL, NULL, 12),
(23, 'Purchase Requisition', 'las la-hand-holding-usd', 'link', NULL, '/purchaserequisition/view=home', 'portal', 'form_options', NULL, 2),
(24, 'Leave Form', 'las la-scroll', 'link', NULL, '/leave_form', 'portal', 'form_options', NULL, 1),
(25, 'Documents Request Form', 'las la-paste', 'link', NULL, '/invtry/view=purchase_order', 'portal', 'form_options', '[1]', 3),
(26, 'Employment Form', 'las la-scroll', 'link', NULL, '/employment_setup', 'portal', 'form_options', '[1]', 7),
(27, 'Item Request', 'las la-cash-register', 'link', NULL, '/item_requests', 'portal', 'form_options', NULL, 4),
(28, 'Purchase Order', 'las la-signature', 'link', NULL, '/purchaseorder/view=home', 'portal', 'form_options', '[1,519]', 6),
(29, 'Attendance Request', 'las la-cash-register', 'link', NULL, '/attendance_request', 'portal', 'form_options', NULL, 5),
(30, 'Back To Portal', 'las la-arrow-left', 'link', NULL, '/dashboard', 'inventory', NULL, NULL, 1),
(31, 'Dashboard', 'las la-home', 'link', NULL, '/inventory/dashboard', 'inventory', NULL, NULL, 2),
(32, 'Assets', 'las la-hand-holding-usd', 'link', NULL, '/inventory/assets', 'inventory', NULL, NULL, 3),
(33, 'Item Names', 'lab la-app-store-ios', 'link', NULL, '/inventory/items_names', 'inventory', NULL, NULL, 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_portal_menu`
--
ALTER TABLE `tbl_portal_menu`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_portal_menu`
--
ALTER TABLE `tbl_portal_menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
