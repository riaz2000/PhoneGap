#######################
# Create Installation #	
#######################
# Make sure, fields are properly updated
# There will be only one entry in tab_installations

	#inst_type			tinyint,			# New field, 0=House, 1=TownHouse, 2=Bungalow, 3=Apartment, 4=Building, 5=Plaza, 6=Hotel, 7=RestHouse
	#ctrl_atomic_lvl	tinyint,			# New field, 0=Installation, 1=Floor, 2=Room, 3=Resource (Currently 0,3 would be used)
	#loginRqrdInside	tinyint,			# New field, 0=NotRequired, 1=Required
	#lowest_lvl			tinyint,			# GF=0, negative would mean below ground level i.e. basement
	#highest_lvl		tinyint,			# to determine the highest_lvl in the building
	#floor_number		tinyint,			# New field (for flats to indicate the floor at which OWL is installed)
	
INSERT INTO tab_installations (inst_type, ctrl_atomic_lvl, loginRqrdInside, lowest_lvl, highest_lvl, floor_number, address1, address2, city, state,	zip, country, contact_person, phone1, phone2, email1, email2, note, record_last_modified, record_last_modified_by,	record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES
	('2', '0', '1', '-1', '2', '0', '12, St. 6, Block "E"', 'Naval Anchorage', 'Islamabad', 'FC', '44000', 'Pakistan', 'Riaz Hussain', '051-5159481', '0333-5638665', 'riaz2000@yahoo.com', 'smriazhussain@gmail.com', 'Test installation', now(),'owladmin',now(),now(),'owladmin','Y');
	
# Note the installation number i.e. "nr" (auto increment field)	
# When installing on OWLBox the inst_number remains 1, and it is the defualt value in whichever table it is used	

################
# Define Areas #	
################
# For each defined area copy the following insert command and fill fields appropriately
# It has to be done for each floor of the installation
# Note: installation number (nr = 1 in OWLBoxDB) [note when Installation Created above: look into database to get this number]
#		1st field = -1 indicates Basement (so according to floor change this number)

# Basement: (Note 1st field = -1)
INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'Bed1','', '445', '245', '670', '245', '445', '470', '670', '470', 'Master Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'Bed2', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Chilren\'s Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'Bed3','', '445', '245', '670', '245', '445', '470', '670', '470', 'Guest Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'Bath1','', '445', '245', '670', '245', '445', '470', '670', '470', 'with Master Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'Bath2','', '445', '245', '670', '245', '445', '470', '670', '470', 'with Chilren\'s Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'Bath3','', '445', '245', '670', '245', '445', '470', '670', '470', 'with Guest Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'TV Lounge','', '445', '245', '670', '245', '445', '470', '670', '470', 'Living Room', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'Dining Room','', '445', '245', '670', '245', '445', '470', '670', '470', 'Dining Area', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'Kitchen','', '445', '245', '670', '245', '445', '470', '670', '470', 'Kitchen', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'Store','', '445', '245', '670', '245', '445', '470', '670', '470', 'Store', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'Stairs','', '445', '245', '670', '245', '445', '470', '670', '470', 'Stairs Area', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'Powder Room','', '445', '245', '670', '245', '445', '470', '670', '470', 'Washroom with stairs', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'Right Gallery','', '445', '245', '670', '245', '445', '470', '670', '470', 'Right Gallery', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'Left Gallery','', '445', '245', '670', '245', '445', '470', '670', '470', 'Left Gallery', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('-1', 'Back Gallery','', '445', '245', '670', '245', '445', '470', '670', '470', 'Back area', now(),'owladmin',now(),now(),'owladmin','Y');

# Ground Floor: (Note 1st field = 0)
INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Bed1','', '445', '245', '670', '245', '445', '470', '670', '470', 'Master Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Bed2','', '445', '245', '670', '245', '445', '470', '670', '470', 'Chilren\'s Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Bed3','', '445', '245', '670', '245', '445', '470', '670', '470', 'Guest Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Bath1','', '445', '245', '670', '245', '445', '470', '670', '470', 'Bath and dressing with Master Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Bath2','', '445', '245', '670', '245', '445', '470', '670', '470', 'with Chilren\'s Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Bath3','', '445', '245', '670', '245', '445', '470', '670', '470', 'with Guest Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'TV Lounge','', '445', '245', '670', '245', '445', '470', '670', '470', 'Living Room', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Kitchen','', '445', '245', '670', '245', '445', '470', '670', '470', 'Kitchen', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Dirty Kitchen','', '445', '245', '670', '245', '445', '470', '670', '470', 'Dirty Kitchen and Laundry', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Store','', '445', '245', '670', '245', '445', '470', '670', '470', 'Store', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Stairs','', '445', '245', '670', '245', '445', '470', '670', '470', 'Stairs Area', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Dining Room', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Dining Area', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Drawing Room','', '445', '245', '670', '245', '445', '470', '670', '470', 'Drawing room', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Powder Room','', '445', '245', '670', '245', '445', '470', '670', '470', 'Washroom with drawing room', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Entrance Lobby','', '445', '245', '670', '245', '445', '470', '670', '470', 'Entrance', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Right Gallery','', '445', '245', '670', '245', '445', '470', '670', '470', 'Right Gallery', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Left Gallery','', '445', '245', '670', '245', '445', '470', '670', '470', 'Left Gallery', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Back Gallery','', '445', '245', '670', '245', '445', '470', '670', '470', 'Back area', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Lawn','', '445', '245', '670', '245', '445', '470', '670', '470', 'Lawn outside', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Porch','', '445', '245', '670', '245', '445', '470', '670', '470', 'Porch', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Outer Lawn','', '445', '245', '670', '245', '445', '470', '670', '470', 'Lawn outside', now(),'owladmin',now(),now(),'owladmin','Y');

# First Floor: (Note 1st field = 1)
INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Bed1','', '445', '245', '670', '245', '445', '470', '670', '470',  'Master Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Bed2','', '445', '245', '670', '245', '445', '470', '670', '470', 'Chilren\'s Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Bed3','', '445', '245', '670', '245', '445', '470', '670', '470', 'Guest Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Bath1','', '445', '245', '670', '245', '445', '470', '670', '470', 'Bath and dressing with Master Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Bath2','', '445', '245', '670', '245', '445', '470', '670', '470', 'with Chilren\'s Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Bath3','', '445', '245', '670', '245', '445', '470', '670', '470', 'with Guest Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'TV Lounge','', '445', '245', '670', '245', '445', '470', '670', '470', 'Living Room', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Kitchen','', '445', '245', '670', '245', '445', '470', '670', '470', 'Kitchen', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Dirty Kitchen','', '445', '245', '670', '245', '445', '470', '670', '470', 'Dirty Kitchen and Laundry', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Store', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Store', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Stairs', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Stairs Area', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Dining Room', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Dining Area', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Drawing Room', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Drawing room', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Powder Room', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Washroom with drawing room', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Entrance Lobby', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Entrance', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Right Gallery','', '445', '245', '670', '245', '445', '470', '670', '470', 'Right Gallery', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Left Gallery', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Left Gallery', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('1', 'Back Gallery', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Back area', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('0', 'Terrace', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Terrace', now(),'owladmin',now(),now(),'owladmin','Y');

# Mumty: (Note 1st field = 2)
INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('2', 'Bed1', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Master Bedroom', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('2', 'Bath', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Bath at mumty', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('2', 'Roof', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Roof open area', now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_areas (floor_number, area, area_name2, pos_tlx, pos_tly, pos_trx, pos_try, pos_blx, pos_bly, pos_brx, pos_bry, note, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('2', 'Stairs', '', '445', '245', '670', '245', '445', '470', '670', '470', 'Roof open area', now(),'owladmin',now(),now(),'owladmin','Y');
	
	
################
# Create Users #
################
# For each user copy the following insert command and fill fields appropriately
# Default password is '1234' and has to be '1234' later on can be changed
# Make sure login_lvl is filled appropriately

	#login_lvl: OBSERVER(1-5), OPERATOR(6-10), MANAGER(11-15), ADMINISTRATOR(16-20)
	
INSERT INTO tab_users (fname, lname, login_id, login_pswd, login_lvl, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES 
						 ('Riaz','Hussain','rhussain','1234','18',now(),'owladmin',now(),now(),'owladmin','Y');
						 
INSERT INTO tab_users (fname, lname, login_id, login_pswd, login_lvl, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES 
						 ('Maria','Riaz','mriaz','1234','13',now(),'owladmin',now(),now(),'owladmin','Y');
						 
INSERT INTO tab_users (fname, lname, login_id, login_pswd, login_lvl, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES 
						 ('Zahra','Riaz','zriaz','1234','8',now(),'owladmin',now(),now(),'owladmin','Y');
						 
INSERT INTO tab_users (fname, lname, login_id, login_pswd, login_lvl, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES 
						 ('Hamza','Riaz','hriaz','1234','8',now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_users (fname, lname, login_id, login_pswd, login_lvl, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES 
						 ('Sara','Riaz','sriaz','1234','3',now(),'owladmin',now(),now(),'owladmin','Y');
						 
# Note: login_id has to be unique, so in case of failure retry with a different login_id
# Using MySql Workbench database open the table tab_users and note down the 'nr' for each user created
# These 'nr' will be different in OServer and OBox so be careful
# In this case we got 3, 4, 5, 6, 7, respectively

################
# Map UI       #	i.e. which user can access which installation 	
################
# When installing on OWLBox the inst_number remains 1, and it is the defualt value in whichever table it is used, so defualt value of inst_number will # go in

INSERT INTO tab_ui (user_number, user_control_lvl, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('3','18',now(),'owladmin',now(),now(),'owladmin','Y');	

INSERT INTO tab_ui (user_number, user_control_lvl, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('4','13',now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_ui (user_number, user_control_lvl, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('5','8',now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_ui (user_number, user_control_lvl, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('6','8',now(),'owladmin',now(),now(),'owladmin','Y');

INSERT INTO tab_ui (user_number, user_control_lvl, record_last_modified, record_last_modified_by, record_creation_date, record_creation_time, record_created_by, is_rec_alive) VALUES ('7','3',now(),'owladmin',now(),now(),'owladmin','Y');	 

################
# Add Resources#	Grab the map of each floor 	
################						 
# Grab the map printout
# get the resource_id from Dr. Junaid, for the time being start from 1 and increment: RES_ID will be unique in an installation
# Note inst_number = 3
# Appliance: See tab_appliances to get the appliance nr ()
# Note the area and get 'nr' number and put that number on the map(MySql Workbench, see table tab_areas)
# Floor No : BM=-1, GF=0 etc. loc_lvl1
# Note the location of each resource, mark it on the map. Also, note the type (i.e. fan, tubelight etc.) loc_lvl2
# Open the map in MS Paint to get pos_x, pos_y, pos_z (in MS Paint use 100% Zoom)

# When installing on OWLBox the inst_number remains 1, and it is the defualt value in whichever table it is used, so defualt value of inst_number will # go in. Note inst_number is removed to get the default value of 1 


INSERT INTO tab_resources (resource_id,	appliance,	res_level, res_status, loc_lvl1, loc_lvl2, loc_lvl3, pos_x, pos_y, pos_z, angle) VALUES ('1','1','8','','0','Bed Room 1', 'East Wall', '230', '120', '100', '20');
