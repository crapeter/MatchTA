import pandas as pd
import column_names as col
import os
from dotenv import load_dotenv
from pprint import pprint
load_dotenv()

'''
This class is used to load the data from the excel files.
This class is used to split the data into undergrad and grad courses. It also splits the students between masters and phd. The data is stored in pandas dataframes
'''
class Data:
	def __init__(self, file1_path, file2_path, file3_path, num_of_tas):
		# Loads dictionaries from column_names.py to access column names via dot notation.
		self.FILE1 = col.f1
		self.FILE2_S1 = col.s1
		self.FILE2_S2 = col.s2
		self.FILE2_S3 = col.s3
		self.FILE3 = col.f3
		self.num_of_tas = num_of_tas

		# f1_
		self.general_info = pd.read_excel(file1_path).dropna(how="all")

		# iloc[1:] is used to skip the first row, which is a dummy row that is not needed.
		self.grader_info = pd.read_excel(file2_path, sheet_name=None)

		# these are the sheets of the second file
		self.sheet_names = list(self.grader_info.keys()) # ['TA grader availability', 'TA grader preferred courses', 'special request from courses']

		self.ta_grader_avail = self.grader_info[self.sheet_names[0]].dropna(how="all") #s1
		self.ta_grader_preferred_courses = self.grader_info[self.sheet_names[1]].dropna(how="all") #s2
		self.special_request_from_courses = self.grader_info[self.sheet_names[2]].dropna(how="all") #s3
		self.ta_grader_avail, self.ta_grader_preferred_courses, self.special_request_from_courses = self.remove_temp_data()

		# f3_
		self.classes = pd.read_excel(file3_path).dropna(how="all")

		# split courses into undergrad and grad courses, !!! to access data via a list, use .values.tolist() !!!
		self.undergrad_courses, self.grad_courses = self.split_courses(self.classes)

		# splits the students between masters and phd, !!! to access data via a list, use .values.tolist() !!!
		# masters students are required to take 20 hours, compared to phd which is between 10 and 20 inclusive
		self.masters_students, self.phd_students = self.split_grader_info(self.ta_grader_avail, self.general_info)

	# This function uses boolean masking to split the courses into undergrad and grad courses. Undergrad courses are courses with a course number less than 5000. Grad courses are courses with a course number greater than or equal to 5000.
	def split_courses(self, courses):
		u_courses = courses[courses[col.f3_course_number] // 1000 < 5]
		g_courses = courses[courses[col.f3_course_number] // 1000 >= 5]
		return u_courses, g_courses

	# This function uses boolean masking to split the grader info into graders and TA's. Graders are students who have the word 'grader' in their notes. TA's are students who do not have the word 'grader' in their notes.
	def split_grader_info(self, gr_info, g_info):
		general_filter = g_info[col.f1_advisor].isna() | (g_info[col.f1_advisor].str.strip() == '')
		return gr_info.loc[general_filter], gr_info.loc[~general_filter]

	def remove_temp_data(self):
		# Remove temporary row for ta_grader_avail that only applies to the original data given
		if self.ta_grader_avail.iloc[0, 0].strip() == 'John Doe':
			ta_a = self.grader_info[self.sheet_names[0]].dropna(how="all").iloc[1:].reset_index(drop=True) #s1
		else:
			ta_a = self.grader_info[self.sheet_names[0]].dropna(how="all").reset_index(drop=True) #s1

		# Remove temporary rows for ta_grader_preferred_courses that only applies to the original data given
		if not str(self.ta_grader_preferred_courses.iloc[0, 0]).strip()[0].isdigit():
			ta_p = self.grader_info[self.sheet_names[1]].dropna(how="all").iloc[3:].reset_index(drop=True) #s2
		else:
			ta_p = self.grader_info[self.sheet_names[1]].dropna(how="all").reset_index(drop=True) #s2
			print("changed")
			col.change_sheet2_vals() # change the column names to the correct ones for the new data given

		# Remove temporary rows for special_request_from_courses that only applies to the original data given
		if not self.special_request_from_courses.iloc[0, 0].strip()[0].isdigit():
			s_r = self.grader_info[self.sheet_names[2]].dropna(how="all").iloc[1:].reset_index(drop=True) #s3
		else:
			s_r = self.grader_info[self.sheet_names[2]].dropna(how="all").reset_index(drop=True)
		
		return ta_a, ta_p, s_r
