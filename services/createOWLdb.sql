CREATE DATABASE owldb1;
USE owldb1;

# ============ Now Creating Tables ==================
# --------------------------------------------------------
# Table structure for table tab_installations
#
CREATE TABLE tab_installations(
	nr			 		smallint unsigned auto_increment,
	inst_type			tinyint,			# 0=House, 1=TownHouse, 2=Bungalow, 3=Apartment, 4=Building, 5=Plaza, 6=Hotel, 7=RestHouse, 8=Shop, 9=Mall
	ctrl_atomic_lvl		tinyint,			# 0=Installation, 1=Floor, 2=Room, 3=Resource (Currently 0,3 would be used)
	loginRqrdInside		tinyint,			# 0=NotRequired, 1=Required
	lowest_lvl			tinyint,			# GF=0, negative would mean below ground level i.e. basement
	highest_lvl			tinyint,			# to deterimine the highest_lvl in the building
	floor_number		tinyint,			# for flats to indicate the Apartment at which OWL is installed
	address1			varchar(30),
	address2			varchar(30),
	city				varchar(20),
	state				varchar(20),
	zip					varchar(11),
	country				varchar(25),
	latitude			decimal(12,9),
	longitude			decimal(12,9),
	contact_person		varchar(30),
	phone1				varchar(20),
	phone2				varchar(20),
	email1				varchar(25),
	email2				varchar(25),
	note				varchar(255),
	record_last_modified	timestamp,
	record_last_modified_by	varchar(16),
	record_creation_date	date,
	record_creation_time	time,
	record_created_by		varchar(16),
	is_rec_alive		enum('Y','N') DEFAULT 'Y' NOT NULL,
	PRIMARY KEY (nr)
);
# To ensure no duplicate entries for the same address
ALTER TABLE tab_installations ADD UNIQUE KEY `my_unique_key` (`address1`, `address2`, `city`);
#

# --------------------------------------------------------
#
# Table structure for table tab_users
# 
CREATE TABLE tab_users(
	nr				int unsigned auto_increment,
	fname			varchar(20),
	lname			varchar(20),
	minitials		varchar(5),
	login_id		varchar(16) UNIQUE,
	login_pswd		varchar(512), # Example: INSERT INTO user_md5 VALUES ('member1',MD5('secretpassword') ); SELECT * FROM user_md5 WHERE user_name='member1' AND password=MD5('secretpassword');
#	salt 			varchar(10) NOT NULL, # In future for more secured login access
	login_lvl		varchar(10), #OBSERVER(1-5), CONTROLLER(6-10), MANAGER(11-15), ADMINISTRATOR(16-20)
	email1			varchar(30),
	email2			varchar(30),  # It will be used as fax number
	phonew			varchar(20),
	phonem			varchar(20),
	phoneh			varchar(20),
	addr1			varchar(35),
	addr2			varchar(35),
	city			varchar(20),
	state			varchar(20),
	zip				varchar(11),
	country			varchar(25),
	note				varchar(255),
	record_last_modified	timestamp,
	record_last_modified_by	varchar(16),
	record_creation_date	date,
	record_creation_time	time,
	record_created_by		varchar(16),
	is_rec_alive		enum('Y','N') DEFAULT 'Y' NOT NULL,
	PRIMARY KEY (nr)
);

# --------------------------------------------------------
# table will be used to identify the areas and allow the control of resources on the basis of areas, such as bedroom1 etc
# Table structure for table tab_areas
#
CREATE TABLE tab_areas(
	nr				int unsigned auto_increment,
	inst_number		smallint default 1,
	floor_number	tinyint,
	area			varchar(35),	# e.g. Bedroom1, Bedroom2, Bath1, Dressing Area, 
	area_name2		varchar(50)character set utf8,	# Name in 2nd Language (urdu)
	pos_tlx			int,			# TopLeftPos 
	pos_tly			int,			# TopLeftPos 
	pos_trx			int,			# TopRight	
	pos_try			int,			# TopRight	
	pos_blx			int,			# BottonLeft
	pos_bly			int,			# BottonLeft
	pos_brx			int,			# BottomRight
	pos_bry			int,			# BottomRight
	note			varchar(255),
	record_last_modified	timestamp,
	record_last_modified_by	varchar(16),
	record_creation_date	date,
	record_creation_time	time,
	record_created_by		varchar(16),
	is_rec_alive		enum('Y','N') DEFAULT 'Y' NOT NULL,
	PRIMARY KEY (nr)
);


# --------------------------------------------------------
#
# Table structure for table tab_ui	:	USER-INSTALLATION mapping
#
CREATE TABLE tab_ui(
	nr						int unsigned auto_increment,
	inst_number 			smallint default 1,
	user_number				int,
	user_control_lvl		varchar(15),	# ADMIN: Can add/remove user of an installation, OBSERVER: Can see the status of an installation, CONTROLLER: Can also ON/OFF MANAGER: Can add/remove user of an installation and decide control level, ADMINISTRATOR: Can add/remove installation, users, ui, ur etc. (Note: #OBSERVER(1-5), CONTROLLER(6-10), MANAGER(11-15), ADMINISTRATOR(16-20))
	note					varchar(255),
	record_last_modified	timestamp,
	record_last_modified_by	varchar(16),
	record_creation_date	date,
	record_creation_time	time,
	record_created_by		varchar(16),
	is_rec_alive		enum('Y','N') DEFAULT 'Y' NOT NULL,
	PRIMARY KEY (nr)
);

# --------------------------------------------------------
#
# Table structure for table tab_resources
#
CREATE TABLE tab_resources(
	nr					int unsigned auto_increment,
	resource_id			smallint,		# Unique within an installation and would be forwarded to Raspberry (specfic address)
	inst_number			smallint default 1,
	appliance			tinyint,		# 0 - 255: e.g. 0=Fan, 1=Tube light, 3=AC, 4=socket etc.
	res_level			tinyint,		# would be used to determine who can observe, change/update state/status 0 - 255 levels
	res_status			tinyint,		# 0=OFF, 1=ON, 2=STANDBY, 3=IDLE, 4=SLEEP
	loc_lvl1			smallint,	# e.g. Floor No
	loc_lvl2			smallint,	# e.g. Area: bedroom1, drawing, kitchen, gallery etc.
	loc_lvl3			varchar(15),	# e.g. Wall1, Wall2, Wall3, Ceiling etc.
	pos_x				int,			# x position on map: 0 - 9999: 0: left most, 9999: right most:  [<------>] on the screen or page
	pos_y				int,			# y position on map: 0 - 9999: 0: bottom, 9999: top: [<------>]Transpose on the screen or page
	pos_z				int,			# z position, i.e. height, not visible on the map, but would allow multiple resources on same x,y but different height(z) 
	angle				smallint,		# 0 is default, would be used to display the appliance direction on the map
	powerConsumption	smallint,		# May be used in future for power consumption analysis
	switch_id			smallint,		# refers to switch controlling the resource, could be same as resource_id
	switch_loc_lvl1		varchar(15),	# e.g. Floor No
	switch_loc_lvl2		varchar(15),	# e.g. Area: bedroom1, drawing, kitchen, Gallery etc.
	switch_loc_lvl3		varchar(15),	# e.g. Wall1, Wall2, Wall3, Ceiling etc.
	switch_pos_x		int,			# x position on map: 0 - 9999: 0: left most, 9999: right most:  [<------>] on the screen or page
	switch_pos_y		int,			# y position on map: 0 - 9999: 0: bottom, 9999: top: [<------>]Transpose on the screen or page
	switch_pos_z		int,			# z position, i.e. height, not visible on the map, but would allow multiple resources on same x,y but different height(z) 	
	note				varchar(255),
	record_last_modified	timestamp,
	record_last_modified_by	varchar(16),
	record_creation_date	date,
	record_creation_time	time,
	record_created_by		varchar(16),
	is_rec_alive		enum('Y','N') DEFAULT 'Y' NOT NULL,
	PRIMARY KEY (nr)
);

# --------------------------------------------------------
# Table structure for table tab_ur	:	USER-RESOURCE mapping (Required when each resource has to determined who can control which resources, for this field "ctrl_atomic_lvl" has to be 2 in tab_installations)
#
CREATE TABLE tab_ur(
	nr						int unsigned auto_increment,
	resource_number 		int unsigned,	# nr number of the resource
	user_number				int unsigned,	# nr number of the user, who can control
	user_control_lvl		varchar(15),	# ADMIN: Can add/remove user of an installation, OBSERVER: Can see the status of an installation, User: Can also OFF/ON/TOGGLE/GET_STATE etc. (Note: 0=CanNotSeeRes 1-5=OBSERVER, 6-10=User, 11-15=Admin)
	note					varchar(255),
	record_last_modified	timestamp,
	record_last_modified_by	varchar(16),
	record_creation_date	date,
	record_creation_time	time,
	record_created_by		varchar(16),
	is_rec_alive		enum('Y','N') DEFAULT 'Y' NOT NULL,
	PRIMARY KEY (nr)
);
# --------------------------------------------------------
#
# Table structure for table tab_statuses
#
CREATE TABLE tab_statuses(
	nr 						tinyint unsigned auto_increment,
	status_name				varchar(10),
	record_last_modified	timestamp,
	record_last_modified_by	varchar(16),
	record_creation_date	date,
	record_creation_time	time,
	record_created_by		varchar(16),
	is_rec_alive		enum('Y','N') DEFAULT 'Y' NOT NULL,
	PRIMARY KEY (nr)
);

# --------------------------------------------------------
#
# Table structure for table tab_appliances
#
CREATE TABLE tab_appliances(
	nr 						tinyint unsigned auto_increment,
	appliance_name			varchar(20),
	record_last_modified	timestamp,
	record_last_modified_by	varchar(16),
	record_creation_date	date,
	record_creation_time	time,
	record_created_by		varchar(16),
	is_rec_alive		enum('Y','N') DEFAULT 'Y' NOT NULL,
	PRIMARY KEY (nr)
);

# ============ Create Super Users and Initialize Tables ==================
#Create super user/admin
#

#Remeber '1234' is default password for a user and must be changed immediately. Anyother Password will crash the system
INSERT INTO tab_users (fname, lname, minitials, login_id, login_pswd, login_lvl, email1, email2, phonew, phonem, phoneh, addr1, addr2, city, state, zip, country, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES 
						 ('OWL','ADMIN','', 'owladmin', '1234','9','riaz2000@yahoo.com','','03335638665','051-5159481', '','27, St. 4', 'Naval Anchorage', 'Islamabad', 'FC','44000','Pakistan','This is one of the super users',now(),'owladmin',now(),now(),'owladmin','Y');
						 
INSERT INTO tab_users (fname, lname, minitials, login_id, login_pswd, login_lvl, email1, email2, phonew, phonem, phoneh, addr1, addr2, city, state, zip, country, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES 
						 ('CPALS','ADMIN','', 'cpalsadmin','1234','9','riaz2000@yahoo.com','','03335638665','051-5159481', '','27, St. 4', 'Naval Anchorage', 'Islamabad', 'FC','44000','Pakistan','This is one of the super users',now(),'owladmin',now(),now(),'owladmin','Y');
						 
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Ceiling Fan',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Bracket Fan',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Pedestal Fan',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Exhaust Fan',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Tube Light',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Bulb',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Energy Saver Bulb',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('LED Bulb',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Chandeliers',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Tele Vision',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Plasma TV',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('LED TV',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Air Conditioner',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Microwave Oven',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Oven',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Refrigerator',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Freezer',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Dispenser',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Water Pump',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Motor',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Socket',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Geyser',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Thermometer',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Remote Control',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_appliances (appliance_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('Video Camera',now(),'owladmin',now(),now(),'owladmin','Y');



INSERT INTO tab_statuses (status_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('OFF',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_statuses (status_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('ON',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_statuses (status_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('IDLE',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_statuses (status_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('SLEEP',now(),'owladmin',now(),now(),'owladmin','Y');
INSERT INTO tab_statuses (status_name, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('STANDBY',now(),'owladmin',now(),now(),'owladmin','Y');



################
# Rough: To run on OWLBox3
#ALTER TABLE tab_resources MODIFY COLUMN loc_lvl1 smallint
#ALTER TABLE tab_resources MODIFY COLUMN loc_lvl2 smallint

#ALTER TABLE tab_areas ADD area_name2 varchar(50)character set utf8 after area;
#ALTER TABLE tab_areas ADD pos_tlx int after area_name2
#ALTER TABLE tab_areas ADD pos_tly int after pos_tlx
#ALTER TABLE tab_areas ADD pos_trx int after pos_tly
#ALTER TABLE tab_areas ADD pos_try int after pos_trx
#ALTER TABLE tab_areas ADD pos_blx int after pos_try
#ALTER TABLE tab_areas ADD pos_bly int after pos_blx
#ALTER TABLE tab_areas ADD pos_brx int after pos_bly
#ALTER TABLE tab_areas ADD pos_bry int after pos_brx

#ALTER TABLE tab_installations ADD floor_number tinyint after highest_lvl

#ALTER TABLE tab_installations ADD  latitude	decimal(12,9) after country
#ALTER TABLE tab_installations ADD  longitude 	decimal(12,9) after latitude


