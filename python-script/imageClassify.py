from ultralytics import YOLO
import sys
import json
import ast

model_source = sys.argv[1]
image_source = sys.argv[2]

model = YOLO(model_source)

results = model.predict(image_source,save=False,verbose=False)

result = results[0]

class_id = []
for box in result.boxes:
  class_id.append(result.names[box.cls[0].item()])

response = {"message" : class_id}

print(json.dumps(response))

sys.stdout.flush()