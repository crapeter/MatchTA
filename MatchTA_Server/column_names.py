#-First File-------------------------------------------------------------------------
f1 = {
  'Grad Level': 0,
  'Headcount': 1,
  'FTE count': 2,
  'Applicant Name (first name last name) ': 3,
  'Research Advisor\'s Name (first name last name) ': 4,
  'Do you have TA Experience in CS department at TTU? If yes, when?': 5,
  'List the courses that you want to be a TA in the order from highest preference to lowest. For each course you listed, you must have taken it before and include your grade. Example of format: 5383(A), 6345(B). ''before and include your grade. Example of format: 5383(A), 6345(B). ': 6
}
f1_grad_level = 'Grad Level'
f1_headcount = 'Headcount'
f1_FTE = 'FTE count'
f1_grader_name = 'Applicant Name (first name last name) '
f1_advisor = 'Research Advisor\'s Name (first name last name) '
f1_grader_exp = 'Do you have TA Experience in CS department at TTU? If yes, when?'
f1_course_pref = 'List the courses that you want to be a TA in the order from highest preference to lowest. For each course you listed, you must have taken it before and include your grade. Example of format: 5383(A), 6345(B). '

#-Second File, Sheet 1---------------------------------------------------------------
s1 = {
  'TA grader name ': 0,
  'Time/day of the class TA/grader has to attend in spring 2025': 1,
  'Course you are taking spring 2025 ': 2,
  'course you have taught (as TA/grader/GPTI)\nSemester + course code': 3,
  'Notes': 4
}
s1_grader_name = 'TA grader name '
s1_class_times = 'Time/day of the class TA/grader has to attend in spring 2025'
s1_grader_courses = 'Course you are taking spring 2025 '
s1_taught_courses = 'course you have taught (as TA/grader/GPTI)\nSemester + course code'
s1_notes = 'Notes'

#-Second File, Sheet 2---------------------------------------------------------------
s2 = {
  '2025-TA/Grader Teaching Preference and Constraint - Spring 2025': 0,
  'Unnamed: 1': 1,
  'Unnamed: 2': 2,
  'Unnamed: 3': 3,
  'Unnamed: 4': 4,
  'Unnamed: 5': 5,
  'Unnamed: 6': 6,
}
s2_course_codes = '2025-TA/Grader Teaching Preference and Constraint - Spring 2025'
s2_sections = 'Unnamed: 1'
s2_course_titles = 'Unnamed: 2'
s2_days = 'Unnamed: 3'
s2_times = 'Unnamed: 4'
s2_prefered_courses = 'Unnamed: 5'
s2_taken_courses = 'Unnamed: 6'

def change_sheet2_vals():
  global s2_course_codes, s2_sections, s2_course_titles, s2_days, s2_times, s2_prefered_courses, s2_taken_courses
  s2_course_codes = 'Course Codes'
  s2_sections = 'Section'
  s2_course_titles = 'Course Titles'
  s2_days = 'Days'
  s2_times = 'Times'
  s2_prefered_courses = 'Preferred Courses'
  s2_taken_courses = 'Taken Courses'

#-Second File, Sheet 2---------------------------------------------------------------
s3 = {
  'Course code + instructor': 0,
  'request description ': 1,
  'request preferenece': 2,
  'Response  (type your name + note) ': 3,
}
s3_instructor = 'Course code + instructor'
s3_request_description = 'request description '
s3_request_preference = 'request preferenece'
s3_response = 'Response  (type your name + note) '

#-Third File-------------------------------------------------------------------------
f3 = {
  'CRN': 0,
  'Subject Title': 1,
  'Subject Code': 2,
  'Course Number': 3,
  'Section Number': 4,
  'Course Title': 5,
  'Days': 6,
  'Times': 7,
  'Start Date': 8,
  'End Date': 9,
  'Campus': 10,
  'Building': 11,
  'Room Number': 12,
  'Instructor': 13,
  'Max Enrollment': 14,
  'Current Enrollment': 15,
  'Seats Available': 16,
  'Wait Capacity': 17,
  'Wait Count': 18,
  'Wait Available': 19,
  'Section Type': 20,
  'Available for Visiting Students': 21,
  'Linked To': 22
}
f3_crn = 'CRN'
f3_department = 'Subject Title'
f3_subject_code = 'Subject Code'
f3_course_number = 'Course Number'
f3_section_number = 'Section Number'
f3_course_title = 'Course Title'
f3_days = 'Days'
f3_times = 'Times'
f3_start_date = 'Start Date'
f3_end_date = 'End Date'
f3_campus = 'Campus'
f3_building = 'Building'
f3_room_number = 'Room Number'
f3_instructor = 'Instructor'
f3_max_enrollment = 'Max Enrollment'
f3_current_enrollment = 'Current Enrollment'
f3_seats_available = 'Seats Available'
f3_wait_capacity = 'Wait Capacity'
f3_wait_count = 'Wait Count'
f3_wait_available = 'Wait Available'
f3_section_type = 'Section Type'
f3_available_for_visiting_students = 'Available for Visiting Students'
f3_linked_to = 'Linked To'