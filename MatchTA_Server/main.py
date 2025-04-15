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
		if len(uploaded_files) != 3:
			return jsonify({"error": "Exactly 3 files must be uploaded"}), 400

		file_paths = []
		for i, file in enumerate(uploaded_files, start=1):
			path = f"temp_file{i}.xlsx"
			file.save(path)
			file_paths.append(path)

		file1_path, file2_path, file3_path = file_paths

		data = Data(file1_path, file2_path, file3_path)
		assign = Assign(data)
		assign.create_graph()
		assignments = assign.assign_ta_graders()

		output_path = "Capstone_Project.xlsx"
		assignments.to_excel(output_path, index=False)

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
