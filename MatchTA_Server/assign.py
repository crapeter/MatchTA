import pandas as pd
import networkx as nx
import column_names as col
import re
from openpyxl import Workbook
from pprint import pprint

'''
This class will be where the sorting algorithms will be implemented, following the restraints at the top of this file.
It will take in the data from the Data class and output the sorted data.
The sorted data will be stored in a pandas dataframe.
The sorted data will be stored in an excel file.
The excel file will be named 'Capstone_Project.xlsx'.
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
		else:
			if ta_name in self.data.masters_students[col.s1_grader_name].values:
				weight += 4

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
		return True, weight if weight > 1 else 1

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
		assignments = []
		ta_to_course_map = {}
		ta_assignment_count = {}
		reserved_tas = set()

		courses = sorted(
			[c for c in self.graph.nodes() if str(c)[0].isdigit()],
			key=lambda x: (int(x.split('-')[0]), int(x.split('-')[1]))
		)

		# Iterate through the courses in the graph
		for course in courses:
			# Skip non-course nodes (e.g., "Masters Thesis", "Individual Study", etc.)
			if course not in self.graph or not str(course)[0].isdigit() or int(str(course).split('-')[0]) >= 6000 or int(str(course).split('-')[0]) == 4000:
				continue

			course_number, section_number = course.split('-')
			section_number = int(section_number)

			grad_course_info_df = self.data.grad_courses[
				(self.data.grad_courses[col.f3_course_number] == int(course_number)) &
				(self.data.grad_courses[col.f3_section_number] == section_number)
			]
			undergrad_course_info_df = self.data.undergrad_courses[
				(self.data.undergrad_courses[col.f3_course_number] == int(course_number)) &
				(self.data.undergrad_courses[col.f3_section_number] == section_number)
			]

			if not grad_course_info_df.empty:
				course_info = grad_course_info_df.iloc[0]
			elif not undergrad_course_info_df.empty:
				course_info = undergrad_course_info_df.iloc[0]

			instructor = course_info[col.f3_instructor]
			current_enrollment = course_info[col.f3_current_enrollment]

			viable_tas = [
				ta for ta in self.graph.neighbors(course)
				if ta_assignment_count.get(ta, 0) < 4 and ta not in reserved_tas
			]
			if not viable_tas:
				continue

			# Sort TAs by weight
			sorted_tas = sorted(
				viable_tas,
				key=lambda ta: (
					self.graph.get_edge_data(course, ta, {}).get('weight', 0)
					if self.graph.has_edge(course, ta)
					else 0
				),
				reverse=True
			)

			has_lab = self._course_has_lab(course_number, section_number, instructor)

			# Assign the TAs
			if has_lab:
				if sorted_tas:
					selected_ta = sorted_tas[0]
					ta_to_course_map[course] = [f"TA: {selected_ta}"]
					ta_assignment_count[selected_ta] = ta_assignment_count.get(selected_ta, 0) + 5
					reserved_tas.add(f"{selected_ta}: {instructor}, {course_number}")
			elif section_number < 500:
				if current_enrollment < 30 or section_number > 500:
					max_tas = 1
				elif current_enrollment < 70 or int(course_number) // 1000 == 5:
					max_tas = 2
				else:
					max_tas = 3

				tas = []
				while len(tas) < max_tas:
					selected_ta = sorted_tas.pop(0)
					if ta_assignment_count.get(selected_ta, 0) < 4 and selected_ta not in reserved_tas:
						tas.append(selected_ta)

				ta_to_course_map[course] = [f"TA: {ta}" for ta in tas]
				for ta in tas:
					ta_assignment_count[ta] = ta_assignment_count.get(ta, 0) + 1
			else:
				for ta in reserved_tas:
					if f"{instructor}, {course_number}" in ta:
						ta_to_course_map[course] = [f"TA: {ta.split(': ')[0]}"]
						break

		# Create the final assignments DataFrame
		for course_key in sorted(ta_to_course_map.keys(), key=lambda x: int(x.split('-')[0])):
			ta_list = ta_to_course_map[course_key]
			course_number, section_number = course_key.split('-')
			section_number = int(section_number)

			grad_course_info_df = self.data.grad_courses[
				(self.data.grad_courses[col.f3_course_number] == int(course_number)) &
				(self.data.grad_courses[col.f3_section_number] == section_number)
			]
			undergrad_course_info_df = self.data.undergrad_courses[
				(self.data.undergrad_courses[col.f3_course_number] == int(course_number)) &
				(self.data.undergrad_courses[col.f3_section_number] == section_number)
			]

			if not grad_course_info_df.empty:
				course_info = grad_course_info_df.iloc[0]
			elif not undergrad_course_info_df.empty:
				course_info = undergrad_course_info_df.iloc[0]

			assignments.append({
				'Course Number': course_info[col.f3_course_number],
				'Section Number': course_info[col.f3_section_number],
				'Instructor': course_info[col.f3_instructor],
				'Assignment': ', '.join(ta_list),
				'Course Title': course_info[col.f3_course_title],
				'Days': course_info[col.f3_days],
				'Times': course_info[col.f3_times],
				'Building': course_info[col.f3_building],
				'Room Number': course_info[col.f3_room_number],
			})

		return pd.DataFrame(assignments)

	def _course_has_lab(self, course_number, section_number, instructor):
		# Check if the course is a lab course
		if section_number > 500:
			return False

		# Check grad courses
		lab_df = self.data.grad_courses[
			(self.data.grad_courses[col.f3_course_number] == int(course_number)) &
			(self.data.grad_courses[col.f3_instructor] == instructor) &
			(self.data.grad_courses[col.f3_section_number] > 500)
		]
		# Check undergrad courses if no lab found in grad
		if lab_df.empty:
			lab_df = self.data.undergrad_courses[
				(self.data.undergrad_courses[col.f3_course_number] == int(course_number)) &
				(self.data.undergrad_courses[col.f3_instructor] == instructor) &
				(self.data.undergrad_courses[col.f3_section_number] > 500)
			]
		return not lab_df.empty
