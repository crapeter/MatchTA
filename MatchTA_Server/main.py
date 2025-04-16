import pandas as pd
from flask import Flask, request, send_file, jsonify, render_template
from flask_cors import CORS
from data import Data
from assign import Assign

app = Flask(__name__)
CORS(app)

@app.route("/upload", methods=["POST"])
def upload():
	try:
		uploaded_files = request.files.getlist("file")
		num_of_tas = int(request.form.get("num_of_tas", 0))


		if len(uploaded_files) != 3:
			return jsonify({"error": "Exactly 3 files must be uploaded"}), 400

		file_paths = []
		for i, file in enumerate(uploaded_files, start=1):
			path = f"temp_file{i}.xlsx"
			file.save(path)
			file_paths.append(path)

		file1_path, file2_path, file3_path = file_paths

		data = Data(file1_path, file2_path, file3_path, num_of_tas)
		assign = Assign(data)
		assign.create_graph()
		assignments = assign.assign_ta_graders()

		course_priority = {
			"1": "Primary",
			"2": "Secondary",
			"3": "Tertiary"
		}

		# for i in assignments:
		# 	print(i.head(10))

		output_path = "Capstone_Project.xlsx"
		with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
			for i, df in enumerate(assignments, start=1):
				sheet_name = course_priority.get(str(i), "Other")
				df.to_excel(writer, sheet_name=sheet_name, index=False)


		return send_file(
			output_path,
			as_attachment=True,
			download_name="Capstone_Project.xlsx",
			mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		)

	except Exception as e:
		print("Error during upload:", e)
		return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
	app.run(debug=True)
