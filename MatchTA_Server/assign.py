'''
Basic rules:
	1.  For graduate courses, it is strongly encouraged to select PhD students.
	2.  Faculty may prefer their own PhD students or research students to be their TA/graders.
	3.  Avoid the overlapping of your class time and students' class time.
	4.  TA/grader can NOT be TA of their spring 2025 registered course.
	5.  For a TA/grader, we prefer not to assign more than two courses.
	6.  For one course, we prefer not to assign more than two TA/graders.

Output:
	1. Needs to be an excel file
	2. The excel file should have the columns: Course Number, Section Number (1 or 2), Instructor, Assignment (TA/grader), Course Title, Days, Times, BUilding, Room Number
'''

import pandas as pd
import networkx as nx
import column_names as col
import re
from openpyxl import Workbook

'''
This class will be where the sorting algorithms will be implemented, following the restraints at the top of this file.
It will take in the data from the Data class and output the sorted data.
The sorted data will be stored in a pandas dataframe.
The sorted data will be stored in an excel file.
The excel file will be named 'name_tbd.xlsx'.
'''
class Assign:
	# get hours: (course_num % 1000) // 100
	def __init__(self, data):
		self.data = data
		self.graph = nx.Graph()

	# Check if the TA is viable for the course based on the rules
	def is_viable(self, ta, course):
		weight = 0  # Higher weight means better match

		ta_name = ta[col.s1_grader_name]
		ta_time = ta[col.s1_class_times]
		ta_days = ta[col.s1_class_times]
		ta_registered_courses = ta[col.s1_grader_courses]
		ta_advisor = self.data.general_info[self.data.general_info[col.f1_grader_name] == ta_name][col.f1_advisor].values

		course_time = course[col.f3_times]
		course_days = course[col.f3_days]
		instructor = course[col.f3_instructor]
		course_number = course[col.f3_course_number]
		course_section = course[col.f3_section_number]

		preferred_courses = self.data.ta_grader_preferred_courses[
			self.data.ta_grader_preferred_courses[col.s2_course_codes] == course_number
		]

		# order needed in case of multiple sections where the section number isn't counting up numerically, ie 002 -> 004
		if not preferred_courses.empty:
			order = 0
			for x in preferred_courses[col.s2_sections]:
				if pd.notna(x) and int(x) == int(course_section):
					preferred_courses = preferred_courses[col.s2_prefered_courses]
					preferred_courses = preferred_courses.iloc[order]
					break
				order += 1

		# Rule 1: Time conflict – very basic check
		if pd.notna(ta_days) and pd.notna(course_days) and any(day in ta_days for day in course_days):
			if pd.notna(ta_time) and pd.notna(course_time) and ta_time == course_time:
				return False, 0  # Conflict found

		# Rule 2: Can't TA for a course they're registered in
		if pd.notna(ta_registered_courses) and str(course_number) in str(ta_registered_courses):
			return False, 0

		# Rule 3: Prefer PhD for grad courses
		is_grad_course = course_number >= 5000
		if is_grad_course:
			if ta_name in self.data.phd_students[col.s1_grader_name].values:
				weight += 2
			else:
				weight -= 2  # Soft penalty for non-PhD

		# Rule 4: Faculty prefers their own students
		if len(ta_advisor) > 0 and pd.notna(ta_advisor[0]):
			if str(ta_advisor[0]).strip().lower() in str(instructor).strip().lower():
				weight += 7
		
		# Rule 5: Preferred courses
		if isinstance(preferred_courses, str) and preferred_courses:
			if ta_name in preferred_courses:
				pattern = re.compile(rf"{re.escape(ta_name)}\s*\((\d+)\)")
				priority = pattern.findall(preferred_courses)
				priority = int(priority[0]) if priority else None
				weight += (5/priority) if priority else 0

		# Rule 6: Special requests from courses
		for _, request in self.data.special_request_from_courses.iterrows():
			instructor_name = str(instructor).split()
			if len(instructor_name) < 2:
				continue
			if str(course_number) in str(request[col.s3_instructor]) and instructor_name[1] in str(request[col.s3_instructor]):
				if str(ta_name) in str(request[col.s3_response]):
					weight += 10

		# Always return True because someones got to do it
		# They will only be assigned if they don't have a course that they fit best with
		return True, weight

	def create_graph(self):
		# Add nodes for TAs/graders, bipartite=0
		for _, ta in self.data.ta_grader_avail.iterrows():
			self.graph.add_node(ta[col.s1_grader_name], bipartite=0)  

		# Add nodes for grad courses with their section numbers as unique identifiers, bipartite=1
		for _, course in self.data.grad_courses.iterrows():
			course_id = f"{course[col.f3_course_number]}-{course[col.f3_section_number]}"
			self.graph.add_node(course_id, bipartite=1)  

		# Add nodes for undergrad courses with their section numbers as unique identifiers, bipartite=1
		for _, course in self.data.undergrad_courses.iterrows():
			course_id = f"{course[col.f3_course_number]}-{course[col.f3_section_number]}"
			self.graph.add_node(course_id, bipartite=1)

		# Add edges between TAs/graders and courses if the assignment is viable
		for _, ta in self.data.ta_grader_avail.iterrows():
			# If the TA is a PhD student, then they are allowed to TA for graduate level courses.
			if ta[col.s1_grader_name] in self.data.phd_students[col.s1_grader_name].values:
				for _, course in self.data.grad_courses.iterrows():
					course_id = f"{course[col.f3_course_number]}-{course[col.f3_section_number]}"
					viable, weight = self.is_viable(ta, course)
					if viable:
						self.graph.add_edge(ta[col.s1_grader_name], course_id, weight=weight)

			for _, course in self.data.undergrad_courses.iterrows():
				course_id = f"{course[col.f3_course_number]}-{course[col.f3_section_number]}"
				viable, weight = self.is_viable(ta, course)
				if viable:
					self.graph.add_edge(ta[col.s1_grader_name], course_id, weight=weight)


	def assign_ta_graders(self):
		ta_lab = set()
		dataframes = []

		for _ in range(self.data.num_of_tas):
			assignments = []
			matching = nx.algorithms.matching.max_weight_matching(self.graph, maxcardinality=True)
			for ta, course in matching:
				if ta in ta_lab:
					continue

				if ta[0].isdigit():
					ta, course = course, ta

				if ta in self.data.ta_grader_avail[col.s1_grader_name].values:
					course_number, section_number = course.split('-')
					
					grad_course_info_df = self.data.grad_courses[
						(self.data.grad_courses[col.f3_course_number] == int(course_number)) &
						(self.data.grad_courses[col.f3_section_number] == int(section_number))
					]
					undergrad_course_info_df = self.data.undergrad_courses[
						(self.data.undergrad_courses[col.f3_course_number] == int(course_number)) &
						(self.data.undergrad_courses[col.f3_section_number] == int(section_number))
					]

					grad_course_info = None
					undergrad_course_info = None

					if not grad_course_info_df.empty:
						grad_course_info = grad_course_info_df.iloc[0]
					elif not undergrad_course_info_df.empty:
						undergrad_course_info = undergrad_course_info_df.iloc[0]
					else:
						continue

					course_info = grad_course_info if grad_course_info is not None else undergrad_course_info

					assignments.append({
						'Course Number': course,
						'Section Number': course_info[col.f3_section_number],
						'Instructor': course_info[col.f3_instructor],
						'Assignment': ta,
						'Course Title': course_info[col.f3_course_title],
						'Days': course_info[col.f3_days],
						'Times': course_info[col.f3_times],
						'Building': course_info[col.f3_building],
						'Room Number': course_info[col.f3_room_number]
					})

					# Lab section match — use whichever course info is available
					instructor_raw = course_info[col.f3_instructor]
					instructor_name = str(instructor_raw).strip().lower() if pd.notna(instructor_raw) else ""


					lab_df = (
						self.data.grad_courses if grad_course_info is not None else self.data.undergrad_courses
					)

					lab_sections = lab_df[
						(lab_df[col.f3_course_number] == int(course_number)) &
						(lab_df[col.f3_section_number] > 500) &
						(lab_df[col.f3_instructor].str.strip().str.lower() == instructor_name)
					]

					for _, lab in lab_sections.iterrows():
						assignments.append({
							'Course Number': f"{course_number}-{lab[col.f3_section_number]}",
							'Section Number': lab[col.f3_section_number],
							'Instructor': lab[col.f3_instructor],
							'Assignment': ta,
							'Course Title': lab[col.f3_course_title],
							'Days': lab[col.f3_days],
							'Times': lab[col.f3_times],
							'Building': lab[col.f3_building],
							'Room Number': lab[col.f3_room_number]
						})
						ta_lab.add(ta)
					self.graph.remove_edge(ta, course)
			dataframes.append(pd.DataFrame(assignments))

		print(len(dataframes))
		return dataframes
